import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

const menu =
  "🚛 *Join the Bubakii Team!* 👨‍💼\n\n" +
  "Ready to be part of something great? We're building the best moving team in South Africa! 🇿🇦\n\n" +
  "📝 *1️⃣ Start Application* - Begin your journey with us\n" +
  "📊 *2️⃣ Check My Status* - See how your application is doing\n" +
  "🏠 *3️⃣ Back to Main Menu* - Return to main options\n\n" +
  "What would you like to do? Reply with 1, 2, or 3! 😊";

export default async function driver_menu(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      await sendText({
        phone: msg.phone,
        text: "🎉 Fantastic! Let's get you started on your journey with Bubakii!\n\nFirst, I need to know your full name. What should I call you? 😊",
      });
      return updateState(state, { step: "awaiting_name", driver: {} });
    case "2":
      await sendText({
        phone: msg.phone,
        text: "📊 Let me check on your application status for you...\n\nJust reply with *OK* or 👍 to continue!",
      });
      return updateState(state, { step: "driver_status" });
    case "3":
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
