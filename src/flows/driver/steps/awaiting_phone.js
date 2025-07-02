import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_phone(msg, state) {
  let phone = (msg.text || "").trim();
  if (!phone) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your WhatsApp number or reply 'same'.",
    });
    return state;
  }
  if (phone.toLowerCase() === "same") phone = msg.phone;
  await sendText({
    phone: msg.phone,
    text: "What is your call number? (if different, else reply 'same')",
  });
  return updateState(state, {
    step: "awaiting_call_number",
    driver: { ...state.driver, phone },
  });
}
