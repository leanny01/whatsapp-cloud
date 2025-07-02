import { sendText } from "../../../lib/messages.js";
import { getUserQuotes } from "../service.js";
import { updateState } from "../../../lib/stateUtils.js";

const mainMenu =
  "👋 *Welcome to Bubakii!* 🚚\n\n" +
  "I'm here to help you with all your moving needs! What would you like to do today?\n\n" +
  "📋 *1️⃣ Get a Moving Quote* - Let's find you the best price!\n" +
  "📊 *2️⃣ Check My Quotes* - See your previous requests\n" +
  "🚛 *3️⃣ Join Our Team* - Become a driver with us\n\n" +
  "Just reply with 1, 2, or 3 to get started! 😊";

export default async function main_menu(msg, state) {
  // If this is the first time entering main_menu or no valid option selected, show menu
  if (
    !msg.text ||
    !["1", "2", "3", "yes", "👍"].includes(
      (msg.text || "").trim().toLowerCase()
    )
  ) {
    await sendText({ phone: msg.phone, text: mainMenu });
    return state;
  }

  switch ((msg.text || "").trim().toLowerCase()) {
    case "1":
    case "yes":
    case "👍":
      await sendText({
        phone: msg.phone,
        text: "🎉 Great choice! Let's get you the best moving quote possible!\n\nWhere are you moving *from*? (Just tell me the area or address)",
      });
      return updateState(state, { step: "awaiting_from", lead: {} });
    case "2": {
      const quotes = await getUserQuotes(msg.wa_id);
      if (!quotes.length) {
        await sendText({
          phone: msg.phone,
          text: "📝 Looks like you haven't submitted any quotes yet! No worries - let's get you started with your first one!\n\nReply *YES* or 👍 to begin your moving quote! 🚚",
        });
        return updateState(state, { step: "main_menu", quotes });
      } else {
        const quotesList = quotes
          .map(
            (q, i) =>
              `${i + 1}. *From:* ${q.from}\n   *To:* ${q.to}\n   *Status:* ${q.status}`
          )
          .join("\n\n");

        await sendText({
          phone: msg.phone,
          text: `📊 *Here are your quotes:*\n\n${quotesList}\n\n*Reply with the number to view details*\n\n0️⃣ Back to main menu`,
        });
        return updateState(state, { step: "my_quotes_list", quotes });
      }
    }
    case "3":
      await sendText({
        phone: msg.phone,
        text: "🚛 *Awesome! Interested in joining our team?*\n\nWe're always looking for great drivers to help us move South Africa! 🇿🇦\n\n1️⃣ *Apply as Driver* - Start your application\n2️⃣ *Check My Status* - See your application progress\n3️⃣ *Back to Main Menu* - Return to main options\n\nReply with 1, 2, or 3! 👨‍💼",
      });
      return updateState(state, { step: "driver_menu" });
    default:
      await sendText({ phone: msg.phone, text: mainMenu });
      return state;
  }
}
