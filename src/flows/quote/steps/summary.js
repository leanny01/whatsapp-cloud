import { sendText } from "../../../lib/messages.js";
import { saveUserQuote } from "../service.js";
import { getContactMessage } from "../../../lib/contact.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function summary(msg, state) {
  const { lead } = state;
  if ((msg.text || "").trim().toLowerCase() === "submit") {
    await saveUserQuote(msg.wa_id, lead);
    await sendText({
      phone: msg.phone,
      text: `🎉 *Your quote request has been submitted successfully!* ${getContactMessage()}`,
    });
    return updateState(state, { step: "quote_submitted_menu" });
  }
  // Show summary and menu
  const summary = `📋 *Quote Summary*\n\n📍 *From:* ${lead.from}\n📍 *To:* ${lead.to}\n📅 *Date:* ${lead.date}\n📦 *Type:* ${lead.type}\n📏 *Size:* ${lead.size}\n✨ *Special Requirements:* ${lead.special || "None"}\n\nReady to submit? Reply:\n• *submit* - Submit your quote\n• *edit* - Make changes\n• *cancel* - Cancel request`;
  await sendText({ phone: msg.phone, text: summary });
  return state;
}
