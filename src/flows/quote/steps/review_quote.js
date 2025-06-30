import { sendText } from "../../../lib/messages.js";
import { saveUserQuote } from "../service.js";
import { getContactMessage } from "../../../lib/contact.js";

function buildQuoteSummary(lead) {
  console.log("lead--------*>", lead);
  let summary = `*Quote Summary:*
`;
  summary += `From: ${lead.from || "-"}
`;
  summary += `To: ${lead.to || "-"}
`;
  summary += `Date: ${lead.date || "-"}
`;

  // Display all collected items
  if (lead.items && lead.items.length > 0) {
    summary += `Items (${lead.items.length}):\n`;
    lead.items.forEach((item, index) => {
      switch (item.type) {
        case "text":
          summary += `${index + 1}. 📝 ${item.content}\n`;
          break;
        case "image":
          summary += `${index + 1}. 📸 Photo${item.caption ? `: ${item.caption}` : ""}\n`;
          break;
        case "video":
          summary += `${index + 1}. 📹 Video${item.caption ? `: ${item.caption}` : ""}\n`;
          break;
        case "document":
          summary += `${index + 1}. 📄 Document: ${item.filename || "File"}\n`;
          break;
        case "audio":
          summary += `${index + 1}. 🎵 Audio file\n`;
          break;
        default:
          // Handle legacy string format for backward compatibility
          if (typeof item === "string") {
            summary += `${index + 1}. 📝 ${item}\n`;
          }
          break;
      }
    });
  } else if (typeof lead.items === "string") {
    // Handle legacy string format for backward compatibility
    summary += `Items: ${lead.items}\n`;
  } else {
    summary += `Items: -\n`;
  }

  return summary;
}

const reviewMenu =
  `\n\n*What would you like to do?*\n\n` +
  `1️⃣ Submit\n` +
  `2️⃣ Edit\n` +
  `3️⃣ Cancel\n` +
  `4️⃣ Main Menu\n` +
  `Reply with 1, 2, 3, or 4.`;

export default async function review_quote(msg, state) {
  // Check if we have lead data, if not redirect to main menu
  if (!state.lead) {
    state = { step: "main_menu" };
    await sendText({
      phone: msg.phone,
      text: "It looks like we need to start fresh. Let me take you to the main menu.\n\n*Main Menu*\n\n1️⃣ New Quote Request\n2️⃣ My Quote Requests\n3️⃣ Driver Registration\n\nReply with 1, 2, or 3.",
    });
    return state;
  }

  // Show summary and menu if this is the first time in this step
  if (!msg.text || !["1", "2", "3", "4"].includes(msg.text.trim())) {
    await sendText({
      phone: msg.phone,
      text: buildQuoteSummary(state.lead) + reviewMenu,
    });
    return state;
  }
  switch (msg.text.trim()) {
    case "1": {
      // Submit
      const quoteId = await saveUserQuote(msg.wa_id, state.lead);
      state.lastQuoteId = quoteId; // Store quote ID for feedback tracking
      state.step = "quote_submitted_menu";
      // Immediately show the feedback request
      await sendText({
        phone: msg.phone,
        text: `✅ Your quote has been submitted! ${getContactMessage()}\n\nHow would you rate your experience with our quote service?\n\n5 ⭐⭐⭐⭐⭐ Excellent\n4 ⭐⭐⭐⭐ Good\n3 ⭐⭐⭐ Okay\n2 ⭐⭐ Poor\n1 ⭐ Very Poor\n\nReply with 1, 2, 3, 4, or 5`,
      });
      break;
    }
    case "2": // Edit
      state.step = "edit_menu";
      await sendText({
        phone: msg.phone,
        text: "What would you like to edit?\n\n1️⃣ From\n\n2️⃣ To\n\n3️⃣ Date\n\n4️⃣ Items\n\n5️⃣ Back to review\n\nReply with 1, 2, 3, 4, or 5.",
      });
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
        text: buildQuoteSummary(state.lead) + reviewMenu,
      });
      break;
  }
  return state;
}
