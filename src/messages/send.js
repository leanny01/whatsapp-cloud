import { logOutbound } from "./log.js";
import { callWhatsAppAPI } from "../lib/fetch.js";

export async function sendMessage({ phone, text }) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text },
  };

  const response = await callWhatsAppAPI({
    url: `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    body: payload,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Send failed: ${response.status} - ${JSON.stringify(result)}`
    );
  }

  // Log outbound message
  await logOutbound({ phone, text, result });
  console.log("📤 Outbound message logged:", result);
}
