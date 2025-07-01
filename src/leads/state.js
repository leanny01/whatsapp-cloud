import Redis from "ioredis";

let client;

client = new Redis(process.env.REDIS_URL);
client.on("error", (err) => console.log("Redis Client Error", err));

const pong = await client.ping();

if (pong !== "PONG") {
  throw new Error("Redis connection failed");
}

export async function updateUserState(phone, state) {
  const prev = await getUserData(phone);
  const updatedData = { ...prev, state };
  await client.set(`user:${phone}`, JSON.stringify(updatedData), "EX", 86400); // 24 hour expiry
}

export async function updateUserData(phone, data) {
  const prev = await getUserData(phone);
  const updatedData = { ...prev, ...data };
  await client.set(`user:${phone}`, JSON.stringify(updatedData), "EX", 86400); // 24 hour expiry
}

export async function getUserData(phone) {
  try {
    const data = await client.get(`user:${phone}`);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error getting user data from Redis:", error);
    return {};
  }
}

export async function clearUserState(phone) {
  try {
    await client.del(`user:${phone}`);
  } catch (error) {
    console.error("Error clearing user data from Redis:", error);
  }
}

/**
 * Loads the user's state from Redis.
 * @param {string} wa_id - WhatsApp user ID
 * @returns {Promise<Object>} - User state object or empty object
 */
export async function getUserState(wa_id) {
  try {
    const data = await client.get(`user:${wa_id}`);
    return data ? JSON.parse(data) : { step: "main_menu" };
  } catch (error) {
    console.error("Error getting user state from Redis:", error);
    return { step: "main_menu" };
  }
}

/**
 * Saves the user's state to Redis (24 hour expiry).
 * @param {string} wa_id - WhatsApp user ID
 * @param {Object} state - State object to save
 */
export async function saveUserState(wa_id, state) {
  await client.set(`user:${wa_id}`, JSON.stringify(state), "EX", 86400);
}

/**
 * Checks if the incoming messageId has already been processed for this user.
 * If it is a duplicate, returns true. Otherwise, updates last_message_id and returns false.
 * @param {string} wa_id - WhatsApp user ID
 * @param {string} messageId - WhatsApp message ID
 * @returns {Promise<boolean>} - true if duplicate, false otherwise
 */
export async function isDuplicateMessage(wa_id, messageId) {
  const state = await getUserState(wa_id);
  if (state && state.last_message_id === messageId) return true;
  // Update last_message_id for deduplication
  await saveUserState(wa_id, { ...state, last_message_id: messageId });
  return false;
}
