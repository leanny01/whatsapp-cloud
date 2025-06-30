import Quote from "./model.js";

/**
 * Save a new quote for a user.
 * @param {string} wa_id - WhatsApp user ID
 * @param {object} lead - Quote data (from, to, date, items, images, etc.)
 */
export async function saveUserQuote(wa_id, lead) {
  // Defensive check: convert string items to array format if needed
  if (typeof lead.items === "string") {
    let content = lead.items;

    // Handle complex stringified object format
    if (lead.items.includes("'0':")) {
      try {
        // Parse the stringified object
        const parsed = JSON.parse(lead.items.replace(/'/g, '"'));
        // Extract the actual text by combining all character values
        content = Object.values(parsed).join("");
      } catch (parseError) {
        content = lead.items;
      }
    }

    lead.items = [{ type: "text", content: content }];
  }

  const quote = await Quote.create({ wa_id, ...lead });
  return quote._id; // Return the quote ID for feedback tracking
}

/**
 * Get all quotes for a user, most recent first.
 * @param {string} wa_id - WhatsApp user ID
 * @returns {Promise<Array>} Array of quote objects
 */
export async function getUserQuotes(wa_id) {
  return await Quote.find({ wa_id }).sort({ createdAt: -1 }).lean();
}

/**
 * Get a user's quote by index (0-based, most recent first).
 * @param {string} wa_id - WhatsApp user ID
 * @param {number} index - Index in the user's quote list
 * @returns {Promise<Object|null>} Quote object or null
 */
export async function getUserQuoteByIndex(wa_id, index) {
  const quotes = await getUserQuotes(wa_id);
  return quotes[index] || null;
}
