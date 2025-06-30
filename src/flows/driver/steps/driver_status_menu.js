import { sendText } from "../../../lib/messages.js";

export default async function driver_status_menu(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      // Start new registration
      state = { step: "awaiting_name", driver: {} };
      await sendText({
        phone: msg.phone,
        text: "Let's get started with a new driver registration! What is your full name?",
      });
      break;
    case "2":
      // Back to driver menu
      state.step = "driver_menu";
      await sendText({
        phone: msg.phone,
        text: "Returning to driver menu..., enter OK or 👍🏼 to continue",
      });

      break;
    case "3":
      // Back to main menu
      state = { step: "main_menu" };
      await sendText({
        phone: msg.phone,
        text: "Returning to main menu..., enter OK or 👍🏼 to continue",
      });
      break;
    default:
      await sendText({
        phone: msg.phone,
        text: "Please reply with:\n1️⃣ Register new application\n2️⃣ Back to driver menu\n3️⃣ Back to main menu",
      });
      break;
  }
  return state;
}
