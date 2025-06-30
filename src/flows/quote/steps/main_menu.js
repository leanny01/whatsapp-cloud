import { sendText } from "../../../lib/messages.js";
import { getUserQuotes } from "../service.js";

const mainMenu =
  "*Main Menu*\n\n" +
  "1️⃣ New Quote Request\n" +
  "2️⃣ My Quote Requests\n" +
  "3️⃣ Driver Registration\n\n" +
  "Reply with 1, 2, or 3.";

export default async function main_menu(msg, state) {
  // If this is the first time entering main_menu or no valid option selected, show menu
  if (
    !msg.text ||
    !["1", "2", "3", "yes", "👍"].includes(
      (msg.text || "").trim().toLowerCase()
    )
  ) {
    await sendText({ phone: msg.phone, text: mainMenu });
    return state;
  }

  switch ((msg.text || "").trim().toLowerCase()) {
    case "1":
    case "yes":
    case "👍":
      state = { step: "awaiting_from", lead: {} };
      await sendText({
        phone: msg.phone,
        text: "Let's start a new quote! Where are you moving from?",
      });
      break;
    case "2": {
      const quotes = await getUserQuotes(msg.wa_id);
      state.quotes = quotes; // Store in state for later steps
      if (!quotes.length) {
        state.step = "main_menu";
        await sendText({
          phone: msg.phone,
          text: "You haven't submitted any quotes yet. Reply YES or 👍 to start a new quote.",
        });
      } else {
        state.step = "my_quotes_list";
        const quotesList = quotes
          .map(
            (q, i) =>
              `${i + 1}. *From:* ${q.from}\n   *To:* ${q.to}\n   *Status:* ${q.status}`
          )
          .join("\n\n");

        await sendText({
          phone: msg.phone,
          text: `*Your Quotes*\n\n${quotesList}\n\n*Reply with the number to view details*\n\n0️⃣ Return to main menu`,
        });
      }
      break;
    }
    case "3":
      state = { step: "driver_menu" };
      await sendText({
        phone: msg.phone,
        text: "*Driver Registration*\n\n1️⃣ Register as Driver\n2️⃣ Check Application Status\n3️⃣ Back to Main Menu\n\nReply with 1, 2, or 3.",
      });
      break;
    default:
      await sendText({ phone: msg.phone, text: mainMenu });
      break;
  }
  return state;
}
