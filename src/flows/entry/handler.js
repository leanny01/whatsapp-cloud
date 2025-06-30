import { sendMessage } from "../../messages/send.js";
import { updateUserState } from "../../leads/state.js";

/**
 * Entry flow handler
 * Handles initial user interactions and routing.
 */
export class EntryHandler {
  /**
   * Sends the main welcome/menu message.
   * @param {string} phone - User's phone number
   * @param {boolean} isInvalid - Whether the last input was invalid.
   * @returns {Promise<void>}
   */
  static async sendWelcome(phone, isInvalid = false) {
    const header = isInvalid
      ? "❌ Invalid option. Please choose:"
      : "🎉 *Welcome to Our Moving Service!*\n\nHow can we help you today?";

    const welcomeMessage = `${header}\n\n1️⃣ *Quote Request* - Get a moving quote\n2️⃣ *General Inquiry* - Ask questions\n3️⃣ *Driver Registration* - Register as a driver\n\nPlease reply with 1, 2, or 3.`;

    await sendMessage({ phone, text: welcomeMessage });
  }

  /**
   * Handle entry flow by routing to the correct sub-handler.
   * @param {string} phone - User's phone number
   * @param {string} text - User input text
   * @returns {Promise<void>}
   */
  static async handleEntry(phone, text) {
    if (!text) {
      return EntryHandler.sendWelcome(phone);
    }

    const input = text.trim();

    switch (input) {
      case "1":
        await updateUserState(phone, "quote_from");
        return sendMessage({ phone, text: "📍 Where are you moving *from*?" });
      case "2":
        await updateUserState(phone, "inquiry");
        return sendMessage({
          phone,
          text: "❓ *General Inquiry*\n\nWhat would you like to ask?\n\nPlease type your question or concern:",
        });
      case "3":
        await updateUserState(phone, "driver_intro");
        return sendMessage({
          phone,
          text: "🚛 *Driver Registration*\n\nPlease tell us your truck type and area.\n\nWhat type of truck do you drive?",
        });
      default:
        // If input is invalid, send the welcome message again with an error.
        return EntryHandler.sendWelcome(phone, true);
    }
  }

  /**
   * Reset user to entry state
   * @param {string} phone - User's phone number
   * @returns {Promise<void>}
   */
  static async resetToEntry(phone) {
    await updateUserState(phone, "entry");
    await EntryHandler.sendWelcome(phone);
  }
}

// Export the handleEntry function for direct use
export const handleEntry = EntryHandler.handleEntry;
