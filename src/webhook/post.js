export default function webhookPost(req, res) {
  console.log('Webhook POST body:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
}
