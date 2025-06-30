import { sendText } from "../../../lib/messages.js";

export default async function main_menu_confirm(msg, state) {
  if ((msg.text || "").trim().toLowerCase() === "yes") {
    state = { step: "main_menu" };
    await sendText({
      phone: msg.phone,
      text: "Returning to main menu..., enter OK or 👍 to proceed",
    });
    return state;
  } else {
    state.step = "review_quote";
  }
  return state;
}
