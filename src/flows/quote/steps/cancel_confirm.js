import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function cancel_confirm(msg, state) {
  if ((msg.text || "").trim().toLowerCase() === "yes") {
    await sendText({
      phone: msg.phone,
      text: "❌ Your quote has been cancelled. Returning to main menu. Enter OK or 👍 to proceed",
    });
    return updateState(state, { step: "main_menu" });
  } else {
    return updateState(state, { step: "review_quote" });
  }
}
