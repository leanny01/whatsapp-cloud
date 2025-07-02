import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function driver_status_menu(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      // Start new registration
      await sendText({
        phone: msg.phone,
        text: "Let's get started with a new driver registration! What is your full name?",
      });
      return updateState(state, { step: "awaiting_name", driver: {} });
    case "2":
      // Back to driver menu
      await sendText({
        phone: msg.phone,
        text: "Returning to driver menu..., enter OK or 👍🏼 to continue",
      });
      return updateState(state, { step: "driver_menu" });
    case "3":
      // Back to main menu
      await sendText({
        phone: msg.phone,
        text: "Returning to main menu..., enter OK or 👍🏼 to continue",
      });
      return updateState(state, { step: "main_menu" });
    default:
      await sendText({
        phone: msg.phone,
        text: "Please reply with:\n1️⃣ Register new application\n2️⃣ Back to driver menu\n3️⃣ Back to main menu",
      });
      return state;
  }
}
