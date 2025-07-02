import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function edit_items(msg, state) {
  if (!msg.text || msg.text.length < 2) {
    await sendText({
      phone: msg.phone,
      text: "Please describe what you are moving.",
    });
    return state;
  }

  // Convert the text input to the new items array structure
  return updateState(state, {
    step: "review_quote",
    lead: { ...state.lead, items: [{ type: "text", content: msg.text }] },
  });
}
