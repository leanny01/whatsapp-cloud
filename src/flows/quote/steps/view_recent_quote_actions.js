import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function view_recent_quote_actions(msg, state) {
  const input = (msg.text || "").trim();

  switch (input) {
    case "0":
      // Go back to previous options
      await sendText({
        phone: msg.phone,
        text: "🔙 Going back to previous options...",
      });
      return updateState(state, { step: "quote_submitted_actions" });

    case "1":
      // Submit another quote
      await sendText({
        phone: msg.phone,
        text: "🚚 Awesome! Let's create another quote for you!\n\nWhere are you moving *from*? 📍",
      });
      return updateState(state, { step: "awaiting_from", lead: {} });

    case "2":
      // View all quotes
      return updateState(state, { step: "my_quotes_list" });

    case "3":
      // Main menu
      await sendText({
        phone: msg.phone,
        text: "🏠 Taking you back to the main menu...\n\nReply with *OK* or 👍 to continue! 👋",
      });
      return updateState(state, { step: "main_menu" });

    default:
      await sendText({
        phone: msg.phone,
        text: "What would you like to do next?\n\n0️⃣ *Go Back* - Previous options\n1️⃣ *Submit Another Quote* - Start new request\n2️⃣ *View All Quotes* - See all your quotes\n3️⃣ *Main Menu* - Back to main options\n\nReply with *0*, *1*, *2*, or *3*",
      });
      return state;
  }
}
