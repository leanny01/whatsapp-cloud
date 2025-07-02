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

/**
 * Checks if user input is a quit command
 * @param {string} input - User input text
 * @returns {boolean} True if input is a quit command
 */
export function isQuitCommand(input) {
  if (!input) return false;

  const quitCommands = [
    "quit",
    "cancel",
    "stop",
    "exit",
    "back",
    "menu",
    "main",
    "q",
    "c",
    "0",
    "00",
    "home",
    "start over",
    "restart",
  ];

  return quitCommands.some(
    (cmd) => input.toLowerCase().trim() === cmd.toLowerCase()
  );
}

/**
 * Handles quit command with appropriate message
 * @param {Object} msg - Message object
 * @param {Object} state - Current state
 * @param {string} customMessage - Optional custom quit message
 * @returns {Object} New state object
 */
export async function handleQuitCommand(msg, state, customMessage = null) {
  const { sendText } = await import("../lib/messages.js");

  const defaultMessage =
    "🏠 Taking you back to the main menu...\n\nReply with *OK* or 👍 to continue! 👋";
  const message = customMessage || defaultMessage;

  await sendText({
    phone: msg.phone,
    text: message,
  });

  return updateState(state, {
    step: "main_menu",
    // Clear flow-specific data
    lead: undefined,
    lastQuoteId: undefined,
    driverData: undefined,
  });
}

/**
 * Wraps a step handler with quit command functionality
 * @param {Function} stepHandler - Original step handler function
 * @returns {Function} Wrapped step handler with quit support
 */
export function withQuitSupport(stepHandler) {
  return async function (msg, state) {
    // Check for quit command first
    if (isQuitCommand(msg.text)) {
      return await handleQuitCommand(msg, state);
    }

    // If not a quit command, proceed with original handler
    return await stepHandler(msg, state);
  };
}
