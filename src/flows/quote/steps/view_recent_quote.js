import { sendText } from "../../../lib/messages.js";
import { getContactMessage } from "../../../lib/contact.js";
import { updateState } from "../../../lib/stateUtils.js";

export default async function view_recent_quote(msg, state) {
  const input = (msg.text || "").trim();

  // Handle return to previous menu
  if (input === "0") {
    await sendText({
      phone: msg.phone,
      text: "🔙 Going back to previous options...",
    });
    return updateState(state, { step: "quote_submitted_actions" });
  }

  // Handle view all quotes
  if (input === "2") {
    return updateState(state, { step: "my_quotes_list" });
  }

  // Handle main menu
  if (input === "3") {
    await sendText({
      phone: msg.phone,
      text: "🏠 Taking you back to the main menu...\n\nReply with *OK* or 👍 to continue! 👋",
    });
    return updateState(state, { step: "main_menu" });
  }

  // Show the most recent quote
  if (state.lastQuoteId) {
    try {
      const Quote = (await import("../model.js")).default;
      const recentQuote = await Quote.findById(state.lastQuoteId);

      if (recentQuote) {
        // Build items display
        let itemsDisplay = "";
        if (recentQuote.items && recentQuote.items.length > 0) {
          itemsDisplay = recentQuote.items
            .map((item, index) => {
              switch (item.type) {
                case "text":
                  return `${index + 1}. 📝 ${item.content}`;
                case "image":
                  return `${index + 1}. 📸 Photo${item.caption ? `: ${item.caption}` : ""}`;
                case "video":
                  return `${index + 1}. 📹 Video${item.caption ? `: ${item.caption}` : ""}`;
                case "document":
                  return `${index + 1}. 📄 Document: ${item.filename || "File"}`;
                case "audio":
                  return `${index + 1}. 🎵 Audio file`;
                default:
                  return typeof item === "string"
                    ? `${index + 1}. 📝 ${item}`
                    : `${index + 1}. Unknown item`;
              }
            })
            .join("\n");
        } else if (typeof recentQuote.items === "string") {
          // Handle legacy string format
          itemsDisplay = `📝 ${recentQuote.items}`;
        } else {
          itemsDisplay = "No items specified";
        }

        const quoteDetails = `📋 *Your Recent Quote*\n\n📍 *From:* ${recentQuote.from}\n📍 *To:* ${recentQuote.to}\n📅 *Date:* ${recentQuote.date}\n📦 *Type:* ${recentQuote.type}\n📏 *Size:* ${recentQuote.size}\n✨ *Special Requirements:* ${recentQuote.special || "None"}\n\n📦 *Items:*\n${itemsDisplay}\n\n📊 *Status:* ${recentQuote.status}\n${recentQuote.status === "pending" ? `\n${getContactMessage()}` : ""}`;

        await sendText({
          phone: msg.phone,
          text: quoteDetails,
        });

        await sendText({
          phone: msg.phone,
          text: "What would you like to do next?\n\n0️⃣ *Go Back* - Previous options\n1️⃣ *Submit Another Quote* - Start new request\n2️⃣ *View All Quotes* - See all your quotes\n3️⃣ *Main Menu* - Back to main options\n\nReply with *0*, *1*, *2*, or *3*",
        });

        return updateState(state, { step: "view_recent_quote_actions" });
      }
    } catch (error) {
      console.error("❌ Error fetching recent quote:", error);
    }
  }

  // Fallback if no recent quote found
  await sendText({
    phone: msg.phone,
    text: "😔 Sorry, I couldn't find your recent quote. Let me take you to view all your quotes instead.",
  });
  return updateState(state, { step: "my_quotes_list" });
}
