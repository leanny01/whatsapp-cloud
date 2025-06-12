import { normalizeInbound } from "../messages/normalize.js";
import MessageLog from "../messages/model.js";

export default async function webhookPost(req, res) {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (msg) {
      const normalized = normalizeInbound(msg);
      await MessageLog.create(normalized);
      console.log(`📥 Received ${msg.type} message from ${msg.from}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
