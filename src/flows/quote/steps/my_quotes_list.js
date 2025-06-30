import { sendText } from "../../../lib/messages.js";
import { getContactMessage } from "../../../lib/contact.js";

export default async function my_quotes_list(msg, state) {
  const quotes = state.quotes || [];
  const input = (msg.text || "").trim();

  // Handle return to main menu
  if (input === "0") {
    state = { step: "main_menu" };
    await sendText({
      phone: msg.phone,
      text: "Returning to main menu..., enter OK or 👍 to proceed",
    });
    return state;
  }

  const idx = parseInt(input, 10) - 1;

  if (Number.isInteger(idx) && idx >= 0 && idx < quotes.length) {
    const q = quotes[idx];

    // Build items display
    let itemsDisplay = "";
    if (q.items && q.items.length > 0) {
      itemsDisplay = q.items
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
    } else if (typeof q.items === "string") {
      // Handle legacy string format
      itemsDisplay = `📝 ${q.items}`;
    } else {
      itemsDisplay = "No items specified";
    }

    const details = `*Quote Details*\n\n*From:* ${q.from}\n*To:* ${q.to}\n*Date:* ${q.date}\n*Items:*\n${itemsDisplay}\n*Status:* ${q.status}\n`;
    await sendText({
      phone: msg.phone,
      text:
        details + (q.status === "pending" ? `\n${getContactMessage()}` : ""),
    });

    // Clear the quotes from state and set step to main_menu
    state = { step: "main_menu" };
    await sendText({
      phone: msg.phone,
      text: "Returning to main menu..., enter OK or 👍 to proceed",
    });
  } else {
    console.log("my_quotes_list - invalid selection, showing list again");

    if (quotes.length === 0) {
      await sendText({
        phone: msg.phone,
        text: "*Your Quotes*\n\nYou haven't submitted any quotes yet.\n\nReply with '0' to return to main menu.",
      });
    } else {
      const quotesList = quotes
        .map(
          (q, i) =>
            `${i + 1}. *From:* ${q.from}\n   *To:* ${q.to}\n   *Status:* ${q.status}`
        )
        .join("\n\n");

      await sendText({
        phone: msg.phone,
        text: `*Your Quotes*\n\n${quotesList}\n\n*Reply with the number to view details*\n\n0️⃣ Return to main menu`,
      });
    }
  }
  return state;
}
