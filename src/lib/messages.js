import MessageLog from "../messages/model.js";
import { normalizeOutbound } from "../messages/normalize.js";
import { callWhatsAppAPI } from "./fetch.js";

/**
 * Get messages for a specific phone number
 * @param {string} phone - The phone number to get messages for
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of messages to return
 * @param {number} options.skip - Number of messages to skip
 * @param {string} options.sortBy - Field to sort by (default: 'createdAt')
 * @param {number} options.sortOrder - Sort order (1 for ascending, -1 for descending)
 * @returns {Promise<Array>} Array of messages
 */
export async function getMessagesByPhone(phone, options = {}) {
  const { limit, skip = 0, sortBy = "createdAt", sortOrder = 1 } = options;

  // Normalize the input phone number
  const normalizedPhone = normalizePhoneNumber(phone);

  const query = {
    $or: [
      { from: normalizedPhone },
      { to: normalizedPhone },
      // Also search for variations with '+' and leading '0'
      { from: `+${normalizedPhone}` },
      { to: `+${normalizedPhone}` },
      { from: `0${normalizedPhone}` },
      { to: `0${normalizedPhone}` },
    ],
  };

  const sort = { [sortBy]: sortOrder };

  const messages = await MessageLog.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return messages;
}

/**
 * Normalize phone number by removing '+' and leading '0'
 * @param {string} phone - Phone number to normalize
 * @returns {string} Normalized phone number
 */
function normalizePhoneNumber(phone) {
  return phone.replace(/^\+|^0+/, "");
}

/**
 * Get message count for a specific phone number
 * @param {string} phone - The phone number to get message count for
 * @returns {Promise<number>} Number of messages
 */
export async function getMessageCountByPhone(phone) {
  return MessageLog.countDocuments({
    $or: [{ from: phone }, { to: phone }],
  });
}

/**
 * Get messages between two phone numbers
 * @param {string} phone1 - First phone number
 * @param {string} phone2 - Second phone number
 * @param {Object} options - Query options (same as getMessagesByPhone)
 * @returns {Promise<Array>} Array of messages
 */
export async function getMessagesBetweenPhones(phone1, phone2, options = {}) {
  const { limit, skip = 0, sortBy = "createdAt", sortOrder = 1 } = options;

  const query = {
    $or: [
      { from: phone1, to: phone2 },
      { from: phone2, to: phone1 },
    ],
  };

  const sort = { [sortBy]: sortOrder };

  const messages = await MessageLog.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return messages;
}

/**
 * Validate and normalize South African phone numbers to E.164 format
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, normalized: string, country: string, message?: string }
 */
export function validateSouthAfricanPhone(phone) {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // South African mobile prefixes
  const saMobilePrefixes = [
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
  ];

  // Check if it's already in E.164 format with country code
  if (cleaned.startsWith("27")) {
    const mobileNumber = cleaned.substring(2);

    if (
      mobileNumber.length === 9 &&
      saMobilePrefixes.includes(mobileNumber.substring(0, 2))
    ) {
      return {
        isValid: true,
        normalized: cleaned, // Already in correct format for WhatsApp API
        country: "ZA",
      };
    }
  }
  // Check if it's domestic format (starts with 0)
  else if (cleaned.startsWith("0") && cleaned.length === 10) {
    const mobileNumber = cleaned.substring(1); // Remove leading 0

    if (saMobilePrefixes.includes(mobileNumber.substring(0, 2))) {
      return {
        isValid: true,
        normalized: "27" + mobileNumber, // Convert to E.164 format
        country: "ZA",
      };
    }
  }
  // Check if it's 9 digits (mobile number without country code or leading 0)
  else if (cleaned.length === 9) {
    if (saMobilePrefixes.includes(cleaned.substring(0, 2))) {
      return {
        isValid: true,
        normalized: "27" + cleaned, // Add country code
        country: "ZA",
      };
    }
  }

  // Not a valid South African number
  return {
    isValid: false,
    normalized: cleaned,
    country: "UNKNOWN",
    message:
      "Sorry, we haven't expanded to your region yet. We currently only serve South Africa. 🇿🇦",
  };
}

/**
 * Send a text message to a phone number
 * @param {string} phone - The phone number to send the message to
 * @param {string} text - The text message to send
 * @returns {Promise<Object>} API response from WhatsApp
 */
export async function sendText({ phone, text }) {
  // Validate South African phone number
  console.log("phone--------*>", phone);
  const validation = validateSouthAfricanPhone(phone);

  if (!validation.isValid) {
    throw new Error(validation.message);
  }

  // Format for WhatsApp API: remove leading 0 and add +27
  const formatted = validation.normalized.replace(/^0/, ""); // Remove leading 0 if present
  const e164 = "+27" + formatted.substring(2); // Add +27 prefix (skip the 27 that's already there)
  console.log("normalizedPhone-------->", validation.normalized);
  console.log("E.164 formatted-------->", e164);

  // Validate message length
  if (text.length > 4096) {
    throw new Error("Message too long");
  }

  const payload = {
    messaging_product: "whatsapp",
    to: e164.replace("+", ""),
    type: "text",
    text: { body: text },
  };

  const result = await callWhatsAppAPI({
    url: `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    body: payload,
  });

  // Log outbound message
  const normalized = normalizeOutbound({ phone: e164, text }, result);
  await MessageLog.create(normalized);

  return result;
}
