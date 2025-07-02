import { sendText } from "../../../lib/messages.js";

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
  state.driver = { ...state.driver, phone };
  state.step = "awaiting_call_number";
  await sendText({
    phone: msg.phone,
    text: "What is your call number? (if different, else reply 'same')",
  });
  return state;
}
