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
      text: `✅ Your quote request has been submitted! ${getContactMessage()}`,
    });
    return updateState(state, { step: "quote_submitted_menu" });
  }
  // Show summary and menu
  const summary = `*Quote Summary*\nFrom: ${lead.from}\nTo: ${lead.to}\nDate: ${lead.date}\nType: ${lead.type}\nSize: ${lead.size}\nSpecial: ${lead.special || "None"}\n\nReply 'submit' to submit, 'edit' to change, or 'cancel' to abort.`;
  await sendText({ phone: msg.phone, text: summary });
  return state;
}
