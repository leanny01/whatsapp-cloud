import { sendMessage } from "../../messages/send.js";
import { updateUserState, updateUserData } from "../../leads/state.js";

/**
 * Inquiry flow handler
 * Handles general inquiries
 */
export class InquiryHandler {
  /**
   * Handle inquiry flow
   * @param {string} phone - User's phone number
   * @param {string} input - User input
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handle(phone, input, leadData = {}) {
    const updatedData = { ...leadData, inquiry: input };

    const message = `✅ Inquiry received: ${input}\n\n📞 Our team will get back to you within 24 hours.\n\nTo start over, reply with any message.`;

    await sendMessage({ phone, text: message });

    return {
      nextState: "entry",
      nextStep: "1",
      data: updatedData,
    };
  }
}

/**
 * Handle inquiry step
 * @param {string} phone - User's phone number
 * @param {string} text - User input
 * @returns {Promise<void>}
 */
export async function handleInquiry(phone, text) {
  await updateUserData(phone, { inquiry: text });
  await sendMessage({
    phone,
    text: `✅ Inquiry received!\n\n📞 Our team will get back to you within 24 hours.\n\nTo start over, reply with any message.`,
  });
  return updateUserState(phone, "entry");
}
