/**
 * Normalize inbound WhatsApp message
 * @param {Object} msg - Raw WhatsApp message
 * @returns {Object} Normalized message
 */
export function normalizeInbound(msg) {
  const base = {
    from: msg.from,
    timestamp: msg.timestamp,
    type: msg.type,
    direction: "inbound",
    raw: msg,
  };

  switch (msg.type) {
    case "text":
      return { ...base, text: msg.text };
    case "image":
      return { ...base, image_id: msg.image?.id };
    case "location":
      return { ...base, location: msg.location };
    case "audio":
      return { ...base, audio_id: msg.audio?.id };
    case "video":
      return { ...base, video_id: msg.video?.id };
    case "document":
      return { ...base, document_id: msg.document?.id };
    case "sticker":
      return { ...base, sticker_id: msg.sticker?.id };
    default:
      return base; // fallback logging
  }
}

/**
 * Normalize outbound WhatsApp message
 * @param {Object} msg - Message to be sent
 * @param {Object} result - API response
 * @returns {Object} Normalized message
 */
export function normalizeOutbound(msg, result) {
  const base = {
    to: msg.phone,
    type: "text",
    direction: "outbound",
    timestamp: new Date().toISOString(),
    raw: result,
  };

  return {
    ...base,
    text: { body: msg.text },
    message_id: result?.messages?.[0]?.id,
  };
}
