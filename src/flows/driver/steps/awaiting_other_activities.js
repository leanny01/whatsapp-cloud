import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_other_activities(msg, state) {
  const other_activities = (msg.text || "").trim();
  if (!other_activities) {
    await sendText({
      phone: msg.phone,
      text: "Please describe your other activities or services.",
    });
    return state;
  }

  await sendText({
    phone: msg.phone,
    text: "Please send a photo of your ID or passport.",
  });
  return updateState(state, {
    step: "awaiting_id_photo",
    driver: { ...state.driver, other_activities },
  });
}
