import { sendText } from "../../../lib/messages.js";

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
  state.driver = { ...state.driver, call_number };
  state.step = "awaiting_address";
  await sendText({ phone: msg.phone, text: "What is your home address?" });
  return state;
}
