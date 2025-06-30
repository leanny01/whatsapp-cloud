import { sendText } from "../../../lib/messages.js";

export default async function edit_to(msg, state) {
  if (!msg.text || msg.text.length < 3) {
    await sendText({
      phone: msg.phone,
      text: "Please enter a valid destination (at least 3 characters).",
    });
    return state;
  }
  state.lead.to = msg.text;
  state.step = "review_quote";
  return state;
}
