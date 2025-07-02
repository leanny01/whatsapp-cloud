import { sendText } from "../../../lib/messages.js";

export default async function edit_from(msg, state) {
  if (!msg.text || msg.text.length < 3) {
    await sendText({
      phone: msg.phone,
      text: "Please enter a valid location (at least 3 characters).",
    });
    return state;
  }
  state.lead.from = msg.text;
  state.step = "review_quote";
  return state;
}
