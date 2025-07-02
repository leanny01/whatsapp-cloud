import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";
import driver_menu from "./driver_menu.js";

export default async function driver_submitted(msg, state) {
  let unknownInput = false;
  switch ((msg.text || "").trim()) {
    case "1":
      await sendText({
        phone: msg.phone,
        text: "Let's start a new driver registration! What is your full name?",
      });
      return updateState(state, { step: "awaiting_name", driver: {} });
    case "2":
      await sendText({
        phone: msg.phone,
        text: "Returning to main menu..., enter OK or 👍🏼 to continue",
      });
      // Immediately render the main menu
      await driver_menu({ ...msg, text: "" }, state);
      return updateState(state, { step: "main_menu" });
    case "status":
    case "check":
    case "application status":
      await sendText({
        phone: msg.phone,
        text: "Here's your driver application status menu!",
      });
      return updateState(state, { step: "driver_status_menu" });
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
