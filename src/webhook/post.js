import { extractMessages } from "../lib/extractMessages.js";
import { messageQueue } from "../queue/queue.js";

/**
 * Main webhook handler for incoming WhatsApp messages.
 * Deduplicates messages using messageId to ensure each message is only processed once.
 * Routes messages to the appropriate flow handler based on user state.
 */
export default async function handleIncoming(req, res) {
  try {
    const messageData = extractMessages(req.body);

    for (const message of messageData) {
      // Add to processing queue
      await messageQueue.add("incoming-message", message);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
