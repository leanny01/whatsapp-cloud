/**
 * Convert numeric rating to star display
 * @param {string} rating - Numeric rating (1-5)
 * @returns {string} Star display
 */
export function ratingToStars(rating) {
  const starMap = {
    1: "⭐",
    2: "⭐⭐",
    3: "⭐⭐⭐",
    4: "⭐⭐⭐⭐",
    5: "⭐⭐⭐⭐⭐",
  };
  return starMap[rating] || "No rating";
}

/**
 * Convert numeric rating to text description
 * @param {string} rating - Numeric rating (1-5)
 * @returns {string} Text description
 */
export function ratingToText(rating) {
  const textMap = {
    1: "Very Poor",
    2: "Poor",
    3: "Okay",
    4: "Good",
    5: "Excellent",
  };
  return textMap[rating] || "No rating";
}

/**
 * Get rating color for UI display
 * @param {string} rating - Numeric rating (1-5)
 * @returns {string} Color class or emoji
 */
export function ratingToColor(rating) {
  const colorMap = {
    1: "🔴", // Red for very poor
    2: "🟠", // Orange for poor
    3: "🟡", // Yellow for okay
    4: "🟢", // Green for good
    5: "🟢", // Green for excellent
  };
  return colorMap[rating] || "⚪";
}

/**
 * Check if rating requires follow-up feedback
 * @param {string} rating - Numeric rating (1-5)
 * @returns {boolean} True if rating is 3 or below
 */
export function needsFeedback(rating) {
  return ["1", "2", "3"].includes(rating);
}

/**
 * Format date for display
 * @param {string} date - Date string (could be flexible or specific)
 * @returns {string} Formatted date for display
 */
export function formatDateForDisplay(date) {
  if (!date) return "Not specified";

  // Handle flexible dates
  if (["Flexible", "ASAP", "Next Month", "In a few months"].includes(date)) {
    return date;
  }

  // Handle specific dates (YYYY-MM-DD format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return date; // Return as-is if unknown format
}

/**
 * Get date priority for sorting
 * @param {string} date - Date string
 * @returns {number} Priority number (lower = higher priority)
 */
export function getDatePriority(date) {
  if (!date) return 999;

  const priorities = {
    ASAP: 1,
    Flexible: 2,
    "Next Month": 3,
    "In a few months": 4,
  };

  if (priorities[date]) return priorities[date];

  // For specific dates, use the actual date
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date(date).getTime();
  }

  return 999; // Unknown format gets lowest priority
}
