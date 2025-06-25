import { extractMessages } from "../lib/extractMessages.js";
//import { getUserData, isDuplicateMessage } from "../leads/state.js";
//import { handleEntry } from "../flows/entry/handler.js";
//import { handleQuote } from "../flows/quote/handler.js";
//import { handleDriverStep } from "../flows/driver/handler.js";
//import { handleInquiry } from "../flows/inquiry/handler.js";
//import { sendText } from "../lib/messages.js";
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
      await messageQueue.add("incoming-message", message);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
