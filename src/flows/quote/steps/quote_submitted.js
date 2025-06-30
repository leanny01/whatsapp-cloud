import { sendText } from "../../../lib/messages.js";

const menu =
  "*Quote Submitted!*\n1️⃣ Submit another quote\n2️⃣ Main Menu\nReply with 1 or 2.";

export default async function quote_submitted(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      state = { step: "awaiting_from", lead: {} };
      await sendText({
        phone: msg.phone,
        text: "Let's start a new quote! Where are you moving from?",
      });
      break;
    case "2":
      state = { step: "main_menu" };
      await sendText({
        phone: msg.phone,
        text: "Returning to main menu..., enter OK or 👍 to proceed",
      });
      break;
    default:
      await sendText({ phone: msg.phone, text: menu });
      break;
  }
  return state;
}
