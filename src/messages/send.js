import { logOutbound } from "./log.js";
import { callWhatsAppAPI } from "../lib/fetch.js";

export async function sendMessage({ phone, text }) {
  if (!/^[0-9]{10,15}$/.test(phone)) {
    throw new Error("Invalid phone number format");
  }

  if (text.length > 4096) {
    throw new Error("Message too long");
  }

  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text },
  };

  const result = await callWhatsAppAPI({
    url: `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    body: payload,
  });

  // Log outbound message
  await logOutbound({ phone, text, result });

  return result;
}
