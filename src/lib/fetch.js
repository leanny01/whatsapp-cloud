import { WhatsAppAPIError } from "./errors.js";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callWhatsAppAPI({
  url,
  method = "POST",
  body,
  retryCount = 0,
}) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await res.json();

    if (!res.ok) {
      // Handle specific error cases
      if (res.status === 401) {
        throw new WhatsAppAPIError("UNAUTHORIZED", result);
      }
      if (res.status === 429) {
        throw new WhatsAppAPIError("RATE_LIMITED", result);
      }
      if (res.status >= 500) {
        throw new WhatsAppAPIError("SERVER_ERROR", result);
      }
      throw new WhatsAppAPIError("BAD_REQUEST", result);
    }

    return result;
  } catch (error) {
    // Handle retry logic
    if (retryCount < MAX_RETRIES && (error.code === 429 || error.code >= 500)) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);

      await sleep(delay);
      return callWhatsAppAPI({ url, method, body, retryCount: retryCount + 1 });
    }

    // Log final error
    console.error("❌ WhatsApp API request failed:", {
      url,
      method,
      error: error.message,
      details: error.details,
      attempt: retryCount + 1,
    });

    throw error;
  }
}
