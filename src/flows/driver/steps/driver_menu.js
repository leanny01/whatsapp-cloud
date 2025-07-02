import { sendText } from "../../../lib/messages.js";

const menu =
  "*Driver Registration*\n\n" +
  "1️⃣ Register as Driver\n" +
  "2️⃣ Check Application Status\n" +
  "3️⃣ Back to Main Menu\n\n" +
  "Reply with 1, 2, or 3.";

export default async function driver_menu(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      state = { step: "awaiting_name", driver: {} };
      await sendText({
        phone: msg.phone,
        text: "Let's get started! What is your full name?",
      });
      break;
    case "2":
      state.step = "driver_status";
      await sendText({
        phone: msg.phone,
        text: "Checking your application status..., enter OK or 👍🏼 to continue",
      });
      break;
    case "3":
      state = { step: "main_menu" };
      await sendText({
        phone: msg.phone,
        text: "Returning to main menu..., enter OK or 👍🏼 to continue",
      });
      break;
    default:
      await sendText({ phone: msg.phone, text: menu });
      break;
  }
  return state;
}
