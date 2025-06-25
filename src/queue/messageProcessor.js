import { Worker } from "bullmq";
import Redis from "ioredis";
import {
  getUserState,
  saveUserState,
  isDuplicateMessage,
} from "../leads/state.js";
//import { handleQuote } from "../flows/quote/handler.js";
import { sendText } from "../lib/messages.js";
// import other handlers as needed
import "dotenv/config";

const connection = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  }
);
connection.on("error", (err) => console.log("Redis Client Error", err));

// Add in-memory quote storage for demonstration (replace with DB in production)
const userQuotes = {};

// Helper: Save a quote for a user
async function saveUserQuote(wa_id, quote) {
  if (!userQuotes[wa_id]) userQuotes[wa_id] = [];
  userQuotes[wa_id].push({
    ...quote,
    id: userQuotes[wa_id].length + 1,
    status: "pending",
  });
}

// Helper: Get all quotes for a user
async function getUserQuotes(wa_id) {
  return userQuotes[wa_id] || [];
}

// Helper: Build a list of quotes for display
function buildQuotesList(quotes) {
  if (!quotes.length) return "";
  return quotes
    .map((q, i) => `${i + 1}. From: ${q.from} to ${q.to} (${q.status})`)
    .join("\n");
}

// Helper: Build quote details
function buildQuoteDetails(quote) {
  return (
    `*Quote Details:*
` +
    `From: ${quote.from}\n` +
    `To: ${quote.to}\n` +
    `Date: ${quote.date}\n` +
    `Items: ${quote.items}\n` +
    `Status: ${quote.status}`
  );
}

const mainMenu =
  "*Main Menu*\n" +
  "1️⃣ New Quote Request\n" +
  "2️⃣ My Quote Requests\n" +
  "Reply with 1 or 2.";

const confirmationMenu =
  "✅ Your quote has been submitted! We will contact you soon.\n\n" +
  "1️⃣ Submit another quote\n" +
  "2️⃣ Back to main menu\n\n" +
  "Reply with 1 or 2.";

// Helper: Validate date in YYYY-MM-DD format
function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

// Helper: Build review summary
function buildQuoteSummary(lead) {
  return (
    `*Quote Summary:*
` +
    `\nFrom: ${lead.from || "-"}\n` +
    `\nTo: ${lead.to || "-"}\n` +
    `\nDate: ${lead.date || "-"}\n` +
    `\nItems: ${lead.items || "-"}`
  );
}

// Helper: Review menu
const reviewMenu =
  `\n\n*What would you like to do?*\n\n` +
  `1️⃣ Submit\n\n` +
  `2️⃣ Edit\n\n` +
  `3️⃣ Cancel\n\n` +
  `4️⃣ Main Menu\n\n` +
  `Reply with 1, 2, 3, or 4.`;

const editMenu =
  `\n*What would you like to edit?*\n` +
  `1️⃣ From\n` +
  `2️⃣ To\n` +
  `3️⃣ Date\n` +
  `4️⃣ Items\n` +
  `5️⃣ Back to review\n\n` +
  `Reply with 1, 2, 3, 4, or 5.`;

/**
 * BullMQ worker to process incoming WhatsApp messages from the queue.
 * For each message: deduplicate, load state, route, respond, save state, log.
 */
const worker = new Worker(
  "incoming-message",
  async (job) => {
    try {
      const msg = job.data; // { wa_id, text, messageId, ... }

      // Validate message structure
      if (!msg || !msg.wa_id || !msg.messageId) {
        console.warn("⚠️ Skipping invalid message format:", msg);
        return;
      }

      // 1. Deduplication
      if (await isDuplicateMessage(msg.wa_id, msg.messageId)) {
        console.log("Duplicate message detected, ignoring:", msg.messageId);
        return;
      }

      // 2. Load user state
      let state = await getUserState(msg.wa_id);
      // Ensure state is initialized
      if (!state) {
        state = { step: "main_menu" };
      }

      // 3. Route based on state/step
      switch (state.step) {
        case "main_menu": {
          switch (msg.text.trim()) {
            case "1":
              state = { step: "awaiting_from", lead: {} };
              await sendText({
                phone: msg.phone,
                text: "Let's start a new quote! Where are you moving from?",
              });
              break;
            case "2": {
              const quotes = await getUserQuotes(msg.wa_id);
              if (!quotes.length) {
                state.step = "main_menu";
                await sendText({
                  phone: msg.phone,
                  text: "You haven't submitted any quotes yet. Reply YES to start a new quote.",
                });
              } else {
                state.step = "my_quotes_list";
                await sendText({
                  phone: msg.phone,
                  text:
                    buildQuotesList(quotes) +
                    "\n\nReply with the number to view details.",
                });
              }
              break;
            }
            default:
              await sendText({ phone: msg.phone, text: mainMenu });
              break;
          }
          break;
        }
        case "my_quotes_list": {
          const idx = parseInt(msg.text.trim(), 10) - 1;
          const quotes = await getUserQuotes(msg.wa_id);
          if (quotes[idx]) {
            state.step = "quote_inquiry";
            state.selected_quote = quotes[idx].id;
            await sendText({
              phone: msg.phone,
              text: buildQuoteDetails(quotes[idx]),
            });
            if (quotes[idx].status === "pending") {
              await sendText({
                phone: msg.phone,
                text: "Your quote is still pending. For urgent inquiries, call us at: 123-456-7890",
              });
            }
          } else {
            await sendText({
              phone: msg.phone,
              text: "Invalid selection. Reply with the number of the quote you want to view.",
            });
          }
          break;
        }
        case "quote_inquiry": {
          // After showing details, return to main menu or allow another action
          state.step = "main_menu";
          await sendText({ phone: msg.phone, text: mainMenu });
          break;
        }
        case "awaiting_from": {
          if (!msg.text || msg.text.length < 3) {
            await sendText({
              phone: msg.phone,
              text: "Please enter a valid location (at least 3 characters).",
            });
            break;
          }
          state.lead = { ...state.lead, from: msg.text };
          state.step = "awaiting_to";
          await sendText({
            phone: msg.phone,
            text: "Where are you moving to?",
          });
          break;
        }
        case "awaiting_to": {
          if (!msg.text || msg.text.length < 3) {
            await sendText({
              phone: msg.phone,
              text: "Please enter a valid destination (at least 3 characters).",
            });
            break;
          }
          state.lead = { ...state.lead, to: msg.text };
          state.step = "awaiting_date";
          await sendText({
            phone: msg.phone,
            text: "What date is your move? (YYYY-MM-DD)",
          });
          break;
        }
        case "awaiting_date": {
          if (!isValidDate(msg.text)) {
            await sendText({
              phone: msg.phone,
              text: "Please enter a valid date in YYYY-MM-DD format.",
            });
            break;
          }
          state.lead = { ...state.lead, date: msg.text };
          state.step = "awaiting_items";
          await sendText({
            phone: msg.phone,
            text: "What are you moving? (List items or send a description)",
          });
          break;
        }
        case "awaiting_items": {
          if (!msg.text || msg.text.length < 2) {
            await sendText({
              phone: msg.phone,
              text: "Please describe what you are moving.",
            });
            break;
          }
          state.lead = { ...state.lead, items: msg.text };
          state.step = "review_quote";
          await sendText({
            phone: msg.phone,
            text: buildQuoteSummary(state.lead) + reviewMenu,
          });
          break;
        }
        case "review_quote": {
          // Handle review menu options
          switch (msg.text.trim()) {
            case "1": // Submit
              // Save lead to in-memory storage
              await saveUserQuote(msg.wa_id, state.lead);
              await sendText({
                phone: msg.phone,
                text: "✅ Your quote has been submitted! We will contact you soon.",
              });
              state = { step: "quote_submitted_menu" };
              break;
            case "2": // Edit
              state.step = "edit_menu";
              await sendText({ phone: msg.phone, text: editMenu });
              break;
            case "3": // Cancel
              state.step = "cancel_confirm";
              await sendText({
                phone: msg.phone,
                text: "Are you sure you want to cancel? Reply YES to confirm or NO to go back.",
              });
              break;
            case "4": // Main Menu
              state.step = "main_menu_confirm";
              await sendText({
                phone: msg.phone,
                text: "Go back to main menu? All progress will be lost. Reply YES to confirm or NO to stay.",
              });
              break;
            default:
              await sendText({
                phone: msg.phone,
                text: "Please reply with 1, 2, 3, or 4.",
              });
              break;
          }
          break;
        }
        case "edit_menu": {
          switch (msg.text.trim()) {
            case "1":
              state.step = "edit_from";
              await sendText({
                phone: msg.phone,
                text: "Enter new 'from' location:",
              });
              break;
            case "2":
              state.step = "edit_to";
              await sendText({
                phone: msg.phone,
                text: "Enter new 'to' location:",
              });
              break;
            case "3":
              state.step = "edit_date";
              await sendText({
                phone: msg.phone,
                text: "Enter new date (YYYY-MM-DD):",
              });
              break;
            case "4":
              state.step = "edit_items";
              await sendText({
                phone: msg.phone,
                text: "Enter new items/description:",
              });
              break;
            case "5":
              state.step = "review_quote";
              await sendText({
                phone: msg.phone,
                text: buildQuoteSummary(state.lead) + reviewMenu,
              });
              break;
            default:
              await sendText({
                phone: msg.phone,
                text: "Please reply with 1, 2, 3, 4, or 5.",
              });
              break;
          }
          break;
        }
        case "edit_from": {
          if (!msg.text || msg.text.length < 3) {
            await sendText({
              phone: msg.phone,
              text: "Please enter a valid location (at least 3 characters).",
            });
            break;
          }
          state.lead.from = msg.text;
          state.step = "review_quote";
          await sendText({
            phone: msg.phone,
            text: buildQuoteSummary(state.lead) + reviewMenu,
          });
          break;
        }
        case "edit_to": {
          if (!msg.text || msg.text.length < 3) {
            await sendText({
              phone: msg.phone,
              text: "Please enter a valid destination (at least 3 characters).",
            });
            break;
          }
          state.lead.to = msg.text;
          state.step = "review_quote";
          await sendText({
            phone: msg.phone,
            text: buildQuoteSummary(state.lead) + reviewMenu,
          });
          break;
        }
        case "edit_date": {
          if (!isValidDate(msg.text)) {
            await sendText({
              phone: msg.phone,
              text: "Please enter a valid date in YYYY-MM-DD format.",
            });
            break;
          }
          state.lead.date = msg.text;
          state.step = "review_quote";
          await sendText({
            phone: msg.phone,
            text: buildQuoteSummary(state.lead) + reviewMenu,
          });
          break;
        }
        case "edit_items": {
          if (!msg.text || msg.text.length < 2) {
            await sendText({
              phone: msg.phone,
              text: "Please describe what you are moving.",
            });
            break;
          }
          state.lead.items = msg.text;
          state.step = "review_quote";
          await sendText({
            phone: msg.phone,
            text: buildQuoteSummary(state.lead) + reviewMenu,
          });
          break;
        }
        case "cancel_confirm": {
          if (msg.text.trim().toLowerCase() === "yes") {
            state = { step: "awaiting_from", lead: {} };
            await sendText({
              phone: msg.phone,
              text: "❌ Your quote has been cancelled. Returning to main menu.",
            });
          } else {
            state.step = "review_quote";
            await sendText({
              phone: msg.phone,
              text: buildQuoteSummary(state.lead) + reviewMenu,
            });
          }
          break;
        }
        case "main_menu_confirm": {
          if (msg.text.trim().toLowerCase() === "yes") {
            state = { step: "awaiting_from", lead: {} };
            await sendText({
              phone: msg.phone,
              text: "Returning to main menu. Welcome! Where are you moving from?",
            });
          } else {
            state.step = "review_quote";
            await sendText({
              phone: msg.phone,
              text: buildQuoteSummary(state.lead) + reviewMenu,
            });
          }
          break;
        }
        case "quote_submitted_menu": {
          switch (msg.text.trim()) {
            case "1":
              state = { step: "awaiting_from", lead: {} };
              await sendText({
                phone: msg.phone,
                text: "Let's start a new quote! Where are you moving from?",
              });
              break;
            case "2":
              state.step = "main_menu";
              await sendText({ phone: msg.phone, text: mainMenu });
              break;
            default:
              await sendText({ phone: msg.phone, text: confirmationMenu });
              break;
          }
          break;
        }
        default: {
          // Unknown state, reset to main menu
          state = { step: "main_menu" };
          await sendText({ phone: msg.phone, text: mainMenu });
          break;
        }
      }

      // 4. Save updated state
      state.last_message_id = msg.messageId;
      await saveUserState(msg.wa_id, state);
    } catch (error) {
      console.error("Error processing message:", error);
    }

    // 5. Log if needed
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Processed message job ${job.id}`);
});
worker.on("failed", (job, err) => {
  console.error(`Failed job ${job.id}:`, err);
});
