import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_license(msg, state) {
  const license = (msg.text || "").trim();
  if (!license) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your driver's license number.",
    });
    return state;
  }
  await sendText({
    phone: msg.phone,
    text: "What type of vehicle do you drive? (e.g., Truck, Van, Pickup, etc.)",
  });
  return updateState(state, {
    step: "awaiting_vehicle",
    driver: { ...state.driver, license },
  });
}
