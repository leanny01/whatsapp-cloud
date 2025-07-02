import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

const menu =
  "🎉 *Quote Submitted Successfully!*\n\nWhat would you like to do next?\n\n1️⃣ *Submit Another Quote* - Start a new request\n2️⃣ *Main Menu* - Back to main options\n\nReply with *1* or *2*";

export default async function quote_submitted(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      await sendText({
        phone: msg.phone,
        text: "🚚 Awesome! Let's create another quote for you!\n\nWhere are you moving *from*? 📍",
      });
      return updateState(state, { step: "awaiting_from", lead: {} });
    case "2":
      await sendText({
        phone: msg.phone,
        text: "🏠 Taking you back to the main menu...\n\nReply with *OK* or 👍 to continue! 👋",
      });
      return updateState(state, { step: "main_menu" });
    default:
      await sendText({ phone: msg.phone, text: menu });
      return state;
  }
}
