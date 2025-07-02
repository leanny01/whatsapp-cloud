import { sendText } from "../../../lib/messages.js";
import review_quote from "./review_quote.js";

function buildQuoteSummary(lead) {
  let summary = `*Quote Summary:*
`;
  summary += `From: ${lead.from || "-"}
`;
  summary += `To: ${lead.to || "-"}
`;
  summary += `Date: ${lead.date || "-"}
`;

  // Display all collected items
  if (lead.items && lead.items.length > 0) {
    summary += `Items (${lead.items.length}):\n`;
    lead.items.forEach((item, index) => {
      switch (item.type) {
        case "text":
          summary += `${index + 1}. 📝 ${item.content}\n`;
          break;
        case "image":
          summary += `${index + 1}. 📸 Photo${item.caption ? `: ${item.caption}` : ""}\n`;
          break;
        case "video":
          summary += `${index + 1}. 📹 Video${item.caption ? `: ${item.caption}` : ""}\n`;
          break;
        case "document":
          summary += `${index + 1}. 📄 Document: ${item.filename || "File"}\n`;
          break;
        case "audio":
          summary += `${index + 1}. 🎵 Audio file\n`;
          break;
      }
    });
  }

  return summary;
}

export default async function awaiting_more_items(msg, state) {
  const input = (msg.text || "").trim();

  switch (input) {
    case "1": {
      // User wants to add more items
      state.step = "awaiting_items";
      const itemCount = state.lead.items.length;
      const progressText = `\n\n📊 *Progress: ${itemCount} item${itemCount !== 1 ? "s" : ""} collected*`;

      await sendText({
        phone: msg.phone,
        text: `Great! Let's add more items.

What else are you moving? You can:

📸 Share pictures of your items
📹 Send videos
📄 Upload documents (inventory lists, etc.)
📝 Type a text description

Send any of these to continue!${progressText}`,
      });
      break;
    }

    case "2": {
      // User is done, proceed to review
      state.step = "review_quote";
      await sendText({
        phone: msg.phone,
        text: buildQuoteSummary(state.lead),
      });
      await sendText({
        phone: msg.phone,
        text: "Please review your quote and confirm, then enter OK or 👍 to proceed",
      });
      // Immediately show the review summary and menu
      await review_quote({ ...msg, text: "" }, state);
      break;
    }

    default: {
      // Invalid input, show the options again
      const totalItems = state.lead.items.length;
      const continueMessage = `Please choose an option:

📊 *Progress: ${totalItems} item${totalItems !== 1 ? "s" : ""} collected*

1️⃣ Add another item (photo/video/document/text)
2️⃣ I'm done - review my quote

Reply with 1 or 2`;

      await sendText({
        phone: msg.phone,
        text: continueMessage,
      });
      break;
    }
  }

  return state;
}
