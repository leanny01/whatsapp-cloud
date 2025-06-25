import { sendMessage } from "../../messages/send.js";

/**
 * Quote confirmation handler
 * Handles quote confirmation logic
 */
export class QuoteConfirmHandler {
  /**
   * Handle quote confirmation
   * @param {string} phone - User's phone number
   * @param {string} input - User input
   * @param {Object} leadData - Lead data
   * @returns {Promise<Object>} Response and next state
   */
  static async handle(phone, input, leadData) {
    const isConfirmed = this.isConfirmation(input);

    if (isConfirmed) {
      return this.handleConfirmation(phone, leadData);
    } else {
      return this.handleCancellation(phone, leadData);
    }
  }

  /**
   * Check if input is a confirmation
   * @param {string} input - User input
   * @returns {boolean} Whether input confirms
   */
  static isConfirmation(input) {
    const confirmKeywords = ["confirm", "yes", "ok", "accept", "proceed"];
    return confirmKeywords.some((keyword) =>
      input.toLowerCase().includes(keyword)
    );
  }

  /**
   * Handle confirmation
   * @param {string} phone - User's phone number
   * @param {Object} leadData - Lead data
   * @returns {Promise<Object>} Response and next state
   */
  static async handleConfirmation(phone, leadData) {
    const message = `🎉 *Quote Confirmed!*\n\nThank you ${leadData.name}!\n\n📋 *Order Summary*\n• Vehicle: ${leadData.vehicleType}\n• Service: ${leadData.serviceType}\n• Amount: $${leadData.quoteAmount}\n\n📞 Our team will contact you within 24 hours.\n\nTo start over, reply with any message.`;

    await sendMessage({ phone, text: message });

    return {
      nextState: "entry",
      nextStep: "1",
      confirmed: true,
    };
  }

  /**
   * Handle cancellation
   * @param {string} phone - User's phone number
   * @param {Object} leadData - Lead data
   * @returns {Promise<Object>} Response and next state
   */
  static async handleCancellation(phone, leadData) {
    const message = `❌ *Quote Cancelled*\n\nYour quote request for ${leadData.serviceType || "service"} has been cancelled.\n\nIf you change your mind, you can always request a new quote.\n\nTo start over, reply with any message.`;

    await sendMessage({ phone, text: message });

    return {
      nextState: "entry",
      nextStep: "1",
      confirmed: false,
    };
  }
}
