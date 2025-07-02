import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_name(msg, state) {
  const name = (msg.text || "").trim();
  // check that name does not include numbers or special characters
  if (!name || name.length < 3 || name.length > 100 || /[0-9]/.test(name)) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your full name.",
    });
    return state;
  }
  await sendText({
    phone: msg.phone,
    text: "What is your WhatsApp number? (or reply 'same' if this number)",
  });
  return updateState(state, {
    step: "awaiting_phone",
    driver: { ...state.driver, name },
  });
}
