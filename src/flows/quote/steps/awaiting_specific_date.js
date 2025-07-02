import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export default async function awaiting_specific_date(msg, state) {
  const input = (msg.text || "").trim();

  // If no input provided, show the date format prompt
  if (!input) {
    await sendText({
      phone: msg.phone,
      text: "📅 *Please enter your move date*\n\nUse this format: YYYY-MM-DD\n\n*Examples:*\n• *2024-12-15* (December 15, 2024)\n• *2025-01-20* (January 20, 2025)\n• *2024-11-30* (November 30, 2024)\n\nJust type the date as YYYY-MM-DD! 📅",
    });
    return state;
  }

  // Check for valid date format
  if (!isValidDate(input)) {
    await sendText({
      phone: msg.phone,
      text: "❌ *Date format incorrect*\n\nPlease use the format: YYYY-MM-DD\n\n*Examples:*\n• *2024-12-15* (December 15, 2024)\n• *2025-01-20* (January 20, 2025)\n• *2024-11-30* (November 30, 2024)\n\nTry again with the correct format! 📅",
    });
    return state;
  }

  // Valid date entered
  await sendText({
    phone: msg.phone,
    text: `🎉 *Perfect!* We've got your move date scheduled for *${input}*. 📅\n\nNow let's talk about what you're moving! You can:\n\n📸 *Share pictures* of your items\n📹 *Send videos* of your space\n📄 *Upload documents* (inventory lists, etc.)\n📝 *Type a description* of your items\n\nSend any of these to help us understand your moving needs! 🚚`,
  });

  return updateState(state, {
    step: "awaiting_items",
    lead: { ...state.lead, date: input },
  });
}
