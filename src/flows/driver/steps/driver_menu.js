import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

const menu =
  "*Driver Registration*\n\n" +
  "1️⃣ Register as Driver\n" +
  "2️⃣ Check Application Status\n" +
  "3️⃣ Back to Main Menu\n\n" +
  "Reply with 1, 2, or 3.";

export default async function driver_menu(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      await sendText({
        phone: msg.phone,
        text: "Let's get started! What is your full name?",
      });
      return updateState(state, { step: "awaiting_name", driver: {} });
    case "2":
      await sendText({
        phone: msg.phone,
        text: "Checking your application status..., enter OK or 👍🏼 to continue",
      });
      return updateState(state, { step: "driver_status" });
    case "3":
      await sendText({
        phone: msg.phone,
        text: "Returning to main menu..., enter OK or 👍🏼 to continue",
      });
      return updateState(state, { step: "main_menu" });
    default:
      await sendText({ phone: msg.phone, text: menu });
      return state;
  }
}
