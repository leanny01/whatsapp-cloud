import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_from(msg, state) {
  if (!msg.text || msg.text.length < 3) {
    await sendText({
      phone: msg.phone,
      text: "Please enter a valid location (at least 3 characters).",
    });
    return state;
  }
  await sendText({ phone: msg.phone, text: "Where are you moving to?" });
  return updateState(state, {
    step: "awaiting_to",
    lead: { ...state.lead, from: msg.text },
  });
}
