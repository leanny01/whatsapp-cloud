/**
 * Extract message details from WhatsApp webhook payload
 * @param {Object} body - Request body from WhatsApp webhook
 * @returns {Object|null} Extracted message details or null if no message
 */
export function extractMessages(body) {
  const results = [];

  try {
    const entries = body?.entry || [];

    for (const entry of entries) {
      const changes = entry?.changes || [];

      for (const change of changes) {
        const msgs = change?.value?.messages || [];

        for (const msg of msgs) {
          const phone = msg.from?.replace("@c.us", "") || null;
          // Use the sender's phone number as the wa_id for user identification
          const wa_id = phone;

          let content = null;
          let text = null;

          switch (msg.type) {
            case "text":
              content = {
                type: "text",
                text: msg.text?.body,
              };
              text = msg.text?.body;
              break;

            case "image":
              content = {
                type: "image",
                id: msg.image?.id,
                caption: msg.image?.caption || null,
                mime_type: msg.image?.mime_type || null,
              };
              break;

            case "document":
              content = {
                type: "document",
                id: msg.document?.id,
                filename: msg.document?.filename,
                mime_type: msg.document?.mime_type || null,
              };
              break;

            case "video":
              content = {
                type: "video",
                id: msg.video?.id,
                caption: msg.video?.caption || null,
                mime_type: msg.video?.mime_type || null,
              };
              break;

            case "audio":
              content = {
                type: "audio",
                id: msg.audio?.id,
                mime_type: msg.audio?.mime_type || null,
              };
              break;

            case "button":
              content = {
                type: "button",
                payload: msg.button?.payload,
                text: msg.button?.text,
              };
              break;

            default:
              content = {
                type: msg.type,
                raw: msg[msg.type],
              };
              break;
          }

          results.push({
            wa_id,
            phone,
            timestamp: msg.timestamp,
            messageId: msg.id,
            content,
            text,
            raw: msg,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error extracting messages:", error);
    return null;
  }

  return results;
}
