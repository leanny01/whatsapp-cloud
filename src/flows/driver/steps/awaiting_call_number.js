import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_call_number(msg, state) {
  let call_number = (msg.text || "").trim();
  if (!call_number) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your call number or reply 'same'.",
    });
    return state;
  }
  if (call_number.toLowerCase() === "same") call_number = state.driver.phone;
  await sendText({ phone: msg.phone, text: "What is your home address?" });
  return updateState(state, {
    step: "awaiting_address",
    driver: { ...state.driver, call_number },
  });
}
