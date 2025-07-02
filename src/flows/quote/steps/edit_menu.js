import { sendText } from "../../../lib/messages.js";
import { updateState } from "../../../lib/stateUtils.js";

const editMenu =
  "What would you like to edit?\n\n" +
  "1️⃣ From\n" +
  "2️⃣ To\n" +
  "3️⃣ Date\n" +
  "4️⃣ Items\n" +
  "5️⃣ Back to review\n\n" +
  "Reply with 1, 2, 3, 4, or 5.";

export default async function edit_menu(msg, state) {
  switch ((msg.text || "").trim()) {
    case "1":
      await sendText({ phone: msg.phone, text: "Enter new 'from' location:" });
      return updateState(state, { step: "edit_from" });
    case "2":
      await sendText({ phone: msg.phone, text: "Enter new 'to' location:" });
      return updateState(state, { step: "edit_to" });
    case "3":
      await sendText({
        phone: msg.phone,
        text: "Enter new date (YYYY-MM-DD):",
      });
      return updateState(state, { step: "edit_date" });
    case "4":
      await sendText({
        phone: msg.phone,
        text: "Enter new items/description:",
      });
      return updateState(state, { step: "edit_items" });
    case "5":
      return updateState(state, { step: "review_quote" });
    default:
      await sendText({ phone: msg.phone, text: editMenu });
      return state;
  }
}
