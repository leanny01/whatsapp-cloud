import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";
import main_menu from "./main_menu.js";

export default async function quote_submitted_actions(msg, state) {
  if (!msg.text || !["1", "2", "3"].includes((msg.text || "").trim())) {
    await sendText({
      phone: msg.phone,
      text: "What would you like to do next?\n\n1️⃣ *Submit Another Quote* - Start a new request\n2️⃣ *View My Quote* - See your submitted quote\n3️⃣ *Main Menu* - Back to main options\n\nReply with *1*, *2*, or *3*",
    });
    return state;
  }

  switch ((msg.text || "").trim()) {
    case "1":
      await sendText({
        phone: msg.phone,
        text: "🚚 Awesome! Let's create another quote for you!\n\nWhere are you moving *from*? 📍",
      });
      return updateState(state, { step: "awaiting_from", lead: {} });
    case "2":
      // View the most recent quote
      return updateState(state, { step: "view_recent_quote" });
    case "3":
      await sendText({
        phone: msg.phone,
        text: "🏠 Taking you back to the main menu...\n\nReply with *OK* or 👍 to continue! 👋",
      });
      // Immediately render the main menu
      await main_menu({ ...msg, text: "" }, state);
      return updateState(state, { step: "main_menu" });
    default:
      await sendText({
        phone: msg.phone,
        text: "What would you like to do next?\n\n1️⃣ *Submit Another Quote* - Start a new request\n2️⃣ *View My Quote* - See your submitted quote\n3️⃣ *Main Menu* - Back to main options\n\nReply with *1*, *2*, or *3*",
      });
      break;
  }
  return state;
}
