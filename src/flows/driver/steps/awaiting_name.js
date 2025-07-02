import { sendText } from "../../../lib/messages.js";

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
  state.driver = { ...state.driver, name };
  state.step = "awaiting_phone";
  await sendText({
    phone: msg.phone,
    text: "What is your WhatsApp number? (or reply 'same' if this number)",
  });
  return state;
}
