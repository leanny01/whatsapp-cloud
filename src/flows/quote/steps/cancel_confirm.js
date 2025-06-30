import { sendText } from "../../../lib/messages.js";

export default async function cancel_confirm(msg, state) {
  if ((msg.text || "").trim().toLowerCase() === "yes") {
    state = { step: "main_menu" };
    await sendText({
      phone: msg.phone,
      text: "❌ Your quote has been cancelled. Returning to main menu. Enter OK or 👍 to proceed",
    });
  } else {
    state.step = "review_quote";
  }
  return state;
}
