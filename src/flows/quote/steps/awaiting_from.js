import { sendText } from "../../../lib/messages.js";

export default async function awaiting_from(msg, state) {
  if (!msg.text || msg.text.length < 3) {
    await sendText({
      phone: msg.phone,
      text: "Please enter a valid location (at least 3 characters).",
    });
    return state;
  }
  state.lead = { ...state.lead, from: msg.text };
  state.step = "awaiting_to";
  await sendText({ phone: msg.phone, text: "Where are you moving to?" });
  return state;
}
