import { sendText } from "../lib/messages.js";

/**
 * Send a message using the centralized messaging system
 * @param {Object} params - Message parameters
 * @param {string} params.phone - The phone number to send the message to
 * @param {string} params.text - The text message to send
 * @returns {Promise<Object>} API response from WhatsApp
 */
export async function sendMessage({ phone, text }) {
  return sendText(phone, text);
}
