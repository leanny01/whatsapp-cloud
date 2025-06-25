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
      const wa_id = entry?.id;

      for (const change of changes) {
        const msgs = change?.value?.messages || [];

        for (const msg of msgs) {
          const phone = msg.from?.replace("@c.us", "") || null;
          const text = msg.type === "text" ? msg.text?.body : null;

          results.push({
            wa_id,
            phone,
            text,
            type: msg.type,
            timestamp: msg.timestamp,
            messageId: msg.id,
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
