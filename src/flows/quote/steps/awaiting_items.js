import { sendText } from "../../../lib/messages.js";

export default async function awaiting_items(msg, state) {
  const { content } = msg;
  let hasValid = false;
  let newItem = null;

  // Create a new state object to prevent mutation
  const newState = { ...state };

  // Initialize lead if it doesn't exist
  if (!newState.lead) {
    newState.lead = {};
  }

  // Initialize items array if it doesn't exist
  if (!newState.lead.items) {
    newState.lead.items = [];
  }

  if (content.type === "text" && content.text && content.text.length >= 2) {
    newItem = { type: "text", content: content.text };
    hasValid = true;
  } else if (content.type === "image") {
    newItem = { type: "image", id: content.id, caption: content.caption };
    hasValid = true;
  } else if (content.type === "audio") {
    newItem = { type: "audio", id: content.id };
    hasValid = true;
  } else if (content.type === "document") {
    newItem = { type: "document", id: content.id, filename: content.filename };
    hasValid = true;
  } else if (content.type === "video") {
    newItem = { type: "video", id: content.id, caption: content.caption };
    hasValid = true;
  }

  if (!hasValid) {
    const itemCount = newState.lead.items.length;
    const progressText =
      itemCount > 0
        ? `\n\n📊 *Progress: ${itemCount} item${itemCount !== 1 ? "s" : ""} collected*`
        : "";

    await sendText({
      phone: msg.phone,
      text: `What are you moving? You can:

📸 Share pictures of your items
📹 Send videos
📄 Upload documents (inventory lists, etc.)
📝 Type a text description

Send any of these to help us understand your moving needs!${progressText}`,
    });
    return newState;
  }

  // Add the new item to the collection
  newState.lead.items.push(newItem);
  const totalItems = newState.lead.items.length;

  // Show confirmation and ask if they want to add more
  let itemTypeText = "";
  switch (newItem.type) {
    case "text":
      itemTypeText = "📝 Text description";
      break;
    case "image":
      itemTypeText = "📸 Photo";
      break;
    case "video":
      itemTypeText = "📹 Video";
      break;
    case "document":
      itemTypeText = "📄 Document";
      break;
    case "audio":
      itemTypeText = "🎵 Audio";
      break;
  }

  const continueMessage = `✅ ${itemTypeText} received!

📊 *Progress: ${totalItems} item${totalItems !== 1 ? "s" : ""} collected*

You can add more items or finish:

1️⃣ Add another item (photo/video/document/text)
2️⃣ I'm done - review my quote

Reply with 1 or 2`;

  await sendText({
    phone: msg.phone,
    text: continueMessage,
  });

  // Set step to handle the continue/done choice
  newState.step = "awaiting_more_items";
  return newState;
}
