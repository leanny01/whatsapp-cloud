import { sendText } from "../../../lib/messages.js";

export default async function awaiting_to(msg, state) {
  if (!msg.text || msg.text.length < 3) {
    await sendText({
      phone: msg.phone,
      text: "Please enter a valid destination (at least 3 characters).",
    });
    return state;
  }
  state.lead = { ...state.lead, to: msg.text };
  state.step = "awaiting_date";
  await sendText({
    phone: msg.phone,
    text: "When do you want to move?\n\n📅 Enter a specific date (YYYY-MM-DD)\n\nOR choose an option:\n\n• Not sure / Flexible\n• Soon / ASAP\n• Next month\n• In a few months\n\nJust type your preference!",
  });
  return state;
}
