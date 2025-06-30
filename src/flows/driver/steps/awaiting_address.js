import { sendText } from "../../../lib/messages.js";

export default async function awaiting_address(msg, state) {
  const home_address = (msg.text || "").trim();
  if (!home_address) {
    await sendText({
      phone: msg.phone,
      text: "Please enter your home address.",
    });
    return state;
  }
  state.driver = { ...state.driver, home_address };
  state.step = "awaiting_license";
  await sendText({
    phone: msg.phone,
    text: "What is your driver's license number?",
  });
  return state;
}
