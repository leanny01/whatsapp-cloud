import { sendText } from "../../../lib/messages.js";

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
      state.step = "edit_from";
      await sendText({ phone: msg.phone, text: "Enter new 'from' location:" });
      break;
    case "2":
      state.step = "edit_to";
      await sendText({ phone: msg.phone, text: "Enter new 'to' location:" });
      break;
    case "3":
      state.step = "edit_date";
      await sendText({
        phone: msg.phone,
        text: "Enter new date (YYYY-MM-DD):",
      });
      break;
    case "4":
      state.step = "edit_items";
      await sendText({
        phone: msg.phone,
        text: "Enter new items/description:",
      });
      break;
    case "5":
      state.step = "review_quote";
      break;
    default:
      await sendText({ phone: msg.phone, text: editMenu });
      break;
  }
  return state;
}
