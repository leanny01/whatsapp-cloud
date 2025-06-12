import MessageLog from "../messages/model.js";

/**
 * Normalize phone number by removing '+' and leading '0'
 * @param {string} phone - Phone number to normalize
 * @returns {string} Normalized phone number
 */
function normalizePhoneNumber(phone) {
  return phone.replace(/^\+|^0+/, "");
}

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
