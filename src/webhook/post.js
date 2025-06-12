import { logInbound } from "../messages/log.js";

export default async function webhookPost(req, res) {
  const entry = req.body.entry?.[0];
  const change = entry?.changes?.[0];
  const msg = change?.value?.messages?.[0];

  if (!msg || !msg.type) {
    console.warn("⚠️ Received malformed message:", req.body);
  }

  await logInbound(msg);

  res.sendStatus(200);
}
