import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function main_menu_confirm(msg, state) {
  if ((msg.text || "").trim().toLowerCase() === "yes") {
    await sendText({
      phone: msg.phone,
      text: "Returning to main menu..., enter OK or 👍 to proceed",
    });
    return updateState(state, { step: "main_menu" });
  } else {
    return updateState(state, { step: "review_quote" });
  }
}
