import { sendText } from "../../../lib/messages.js";
import main_menu from "./main_menu.js";

export default async function quote_submitted_actions(msg, state) {
  if (!msg.text || !["1", "2"].includes((msg.text || "").trim())) {
    await sendText({
      phone: msg.phone,
      text: "What would you like to do next?\n\n1️⃣ Submit another quote\n2️⃣ Back to main menu\n\nReply with 1 or 2.",
    });
    return state;
  }

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
      // Immediately render the main menu
      await main_menu({ ...msg, text: "" }, state);
      break;
    default:
      await sendText({
        phone: msg.phone,
        text: "What would you like to do next?\n\n1️⃣ Submit another quote\n2️⃣ Back to main menu\n\nReply with 1 or 2.",
      });
      break;
  }
  return state;
}
