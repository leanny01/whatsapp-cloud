import { sendText } from "../../../lib/messages.js";

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

  state.driver = {
    ...state.driver,
    specialization: specializationMap[input],
  };

  if (input === "2" || input === "3") {
    state.step = "awaiting_other_activities";
    await sendText({
      phone: msg.phone,
      text: "Please describe your other activities or services.",
    });
  } else {
    state.step = "awaiting_id_photo";
    await sendText({
      phone: msg.phone,
      text: "Please send a photo of your ID or passport.",
    });
  }
  return state;
}
