import { sendText } from "../../../lib/messages.js";

export default async function edit_items(msg, state) {
  if (!msg.text || msg.text.length < 2) {
    await sendText({
      phone: msg.phone,
      text: "Please describe what you are moving.",
    });
    return state;
  }

  // Convert the text input to the new items array structure
  state.lead.items = [{ type: "text", content: msg.text }];
  state.step = "review_quote";
  return state;
}
