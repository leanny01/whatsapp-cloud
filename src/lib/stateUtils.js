/**
 * Utility functions for safe state management
 */

/**
 * Creates a new state object with the user ID for validation
 * @param {Object} state - Current state
 * @param {string} userId - User ID to associate with state
 * @returns {Object} New state object
 */
export function createUserState(state, userId) {
  return {
    ...state,
    userId,
    lastUpdated: Date.now(),
  };
}

/**
 * Validates that a state object belongs to the correct user
 * @param {Object} state - State object to validate
 * @param {string} expectedUserId - Expected user ID
 * @returns {boolean} True if valid, false otherwise
 */
export function validateUserState(state, expectedUserId) {
  if (!state || !state.userId) {
    return false;
  }
  return state.userId === expectedUserId;
}

/**
 * Creates a safe default state for a user
 * @param {string} userId - User ID
 * @returns {Object} Default state object
 */
export function createDefaultState(userId) {
  return {
    step: "main_menu",
    userId,
    lastUpdated: Date.now(),
  };
}

/**
 * Safely updates state properties without mutation
 * @param {Object} state - Current state
 * @param {Object} updates - Properties to update
 * @returns {Object} New state object
 */
export function updateState(state, updates) {
  return {
    ...state,
    ...updates,
    lastUpdated: Date.now(),
  };
}
