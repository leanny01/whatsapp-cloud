import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function awaiting_specialization(msg, state) {
  const input = (msg.text || "").trim();
  if (!["1", "2", "3"].includes(input)) {
    await sendText({
      phone: msg.phone,
      text: "What do you specialize in?\n\n1. Furniture moving\n2. Other activities\n3. Both\n\nReply with 1, 2, or 3.",
    });
    return state;
  }

  const specializationMap = {
    1: "furniture_moving",
    2: "other",
    3: "both",
  };

  const newDriver = {
    ...state.driver,
    specialization: specializationMap[input],
  };

  if (input === "2" || input === "3") {
    await sendText({
      phone: msg.phone,
      text: "Please describe your other activities or services.",
    });
    return updateState(state, {
      step: "awaiting_other_activities",
      driver: newDriver,
    });
  } else {
    await sendText({
      phone: msg.phone,
      text: "Please send a photo of your ID or passport.",
    });
    return updateState(state, { step: "awaiting_id_photo", driver: newDriver });
  }
}
