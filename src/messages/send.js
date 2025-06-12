import { logOutbound } from "./log.js";
import { callWhatsAppAPI } from "../lib/fetch.js";

export async function sendMessage({ phone, text }) {
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text },
  };

  try {
    const result = await callWhatsAppAPI({
      url: `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      body: payload,
    });

    // Log outbound message
    await logOutbound({ phone, text, result });
    console.log("📤 Outbound message logged:", result);

    return result;
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    throw error;
  }
}
