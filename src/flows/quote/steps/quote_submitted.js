import { sendText } from "../../../lib/messages.js";

const menu =
  "🎉 *Quote Submitted Successfully!*\n\nWhat would you like to do next?\n\n1️⃣ *Submit Another Quote* - Start a new request\n2️⃣ *Main Menu* - Back to main options\n\nReply with *1* or *2*";

export default async function quote_submitted(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      state = { step: "awaiting_from", lead: {} };
      await sendText({
        phone: msg.phone,
        text: "🚚 Awesome! Let's create another quote for you!\n\nWhere are you moving *from*? 📍",
      });
      break;
    case "2":
      state = { step: "main_menu" };
      await sendText({
        phone: msg.phone,
        text: "🏠 Taking you back to the main menu...\n\nReply with *OK* or 👍 to continue! 👋",
      });
      break;
    default:
      await sendText({ phone: msg.phone, text: menu });
      break;
  }
  return state;
}
