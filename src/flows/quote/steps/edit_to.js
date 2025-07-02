import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function edit_to(msg, state) {
  if (!msg.text || msg.text.length < 3) {
    await sendText({
      phone: msg.phone,
      text: "Please enter a valid destination (at least 3 characters).",
    });
    return state;
  }
  return updateState(state, {
    step: "review_quote",
    lead: { ...state.lead, to: msg.text },
  });
}
