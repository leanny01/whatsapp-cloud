import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_address(msg, state) {
  const home_address = (msg.text || "").trim();
  if (!home_address) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your home address.",
    });
    return state;
  }
  await sendText({
    phone: msg.phone,
    text: "What is your driver's license number?",
  });
  return updateState(state, {
    step: "awaiting_license",
    driver: { ...state.driver, home_address },
  });
}
