import { sendText } from "../../../lib/messages.js";
import driver_menu from "./driver_menu.js";

export default async function driver_submitted(msg, state) {
  let unknownInput = false;
  switch ((msg.text || "").trim()) {
    case "1":
      state = { step: "awaiting_name", driver: {} };
      await sendText({
        phone: msg.phone,
        text: "Let's start a new driver registration! What is your full name?",
      });
      break;
    case "2":
      state = { step: "main_menu" };
      await sendText({
        phone: msg.phone,
        text: "Returning to main menu..., enter OK or 👍🏼 to continue",
      });
      // Immediately render the main menu
      await driver_menu({ ...msg, text: "" }, state);
      break;
    case "status":
    case "check":
    case "application status":
      state = { step: "driver_status_menu" };
      await sendText({
        phone: msg.phone,
        text: "Here's your driver application status menu!",
      });
      break;
    default:
      unknownInput = true;
      break;
  }
  if (unknownInput) {
    const { getDriverStepHandler } = await import("../handler.js");
    return await getDriverStepHandler("404")(msg, state);
  }
  return state;
}
