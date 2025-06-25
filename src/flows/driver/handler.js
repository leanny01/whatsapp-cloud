import { sendMessage } from "../../messages/send.js";
import {
  updateUserState,
  updateUserData,
  getUserData,
} from "../../leads/state.js";

/**
 * Driver registration flow handler
 * Handles driver registration steps
 */
export class DriverHandler {
  /**
   * Handle driver registration steps
   * @param {string} phone - User's phone number
   * @param {string} step - Current step
   * @param {string} input - User input
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handle(phone, step, input, leadData = {}) {
    const handlers = {
      1: this.handleStep1,
      2: this.handleStep2,
      3: this.handleStep3,
    };

    const handler = handlers[step];
    if (!handler) {
      return this.handleInvalidStep(phone);
    }

    return handler.call(this, phone, input, leadData);
  }

  /**
   * Handle step 1 - Driver name
   * @param {string} phone - User's phone number
   * @param {string} input - User input (driver name)
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handleStep1(phone, input, leadData) {
    const updatedData = {
      ...leadData,
      driverDetails: {
        ...leadData.driverDetails,
        name: input,
      },
    };

    const message = `✅ Driver name recorded: ${input}\n\n📋 *Step 2: License Number*\n\nPlease provide your driver's license number:`;

    await sendMessage({ phone, text: message });

    return {
      nextStep: "2",
      data: updatedData,
    };
  }

  /**
   * Handle step 2 - License number
   * @param {string} phone - User's phone number
   * @param {string} input - User input (license number)
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handleStep2(phone, input, leadData) {
    const updatedData = {
      ...leadData,
      driverDetails: {
        ...leadData.driverDetails,
        license: input,
      },
    };

    const message = `✅ License number recorded: ${input}\n\n⏰ *Step 3: Years of Experience*\n\nHow many years of driving experience do you have?\n\n1. Less than 1 year\n2. 1-3 years\n3. 3-5 years\n4. 5+ years`;

    await sendMessage({ phone, text: message });

    return {
      nextStep: "3",
      data: updatedData,
    };
  }

  /**
   * Handle step 3 - Experience
   * @param {string} phone - User's phone number
   * @param {string} input - User input (experience)
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handleStep3(phone, input, leadData) {
    const experienceLevels = {
      1: "Less than 1 year",
      2: "1-3 years",
      3: "3-5 years",
      4: "5+ years",
    };

    const experience = experienceLevels[input] || input;
    const updatedData = {
      ...leadData,
      driverDetails: {
        ...leadData.driverDetails,
        experience,
      },
    };

    const message = `✅ Experience recorded: ${experience}\n\n🎉 *Registration Complete!*\n\n📋 *Driver Summary*\n• Name: ${updatedData.driverDetails.name}\n• License: ${updatedData.driverDetails.license}\n• Experience: ${experience}\n\n📞 Our team will review your application and contact you within 48 hours.\n\nTo start over, reply with any message.`;

    await sendMessage({ phone, text: message });

    return {
      nextState: "entry",
      nextStep: "1",
      data: updatedData,
    };
  }

  /**
   * Handle invalid step
   * @param {string} phone - User's phone number
   * @returns {Promise<Object>} Error response
   */
  static async handleInvalidStep(phone) {
    const message = `❌ Invalid step. Please contact support.`;
    await sendMessage({ phone, text: message });

    return {
      nextState: "entry",
      nextStep: "1",
    };
  }
}

/**
 * Handle driver step based on current state
 * @param {string} phone - User's phone number
 * @param {string} text - User input
 * @returns {Promise<void>}
 */
export async function handleDriverStep(phone, text) {
  const { state } = await getUserData(phone);

  switch (state) {
    case "driver_intro":
      await updateUserData(phone, { truckType: text });
      await updateUserState(phone, "driver_details");
      return sendMessage({
        phone,
        text: `✅ Truck type: ${text}\n\n📋 Please provide your contact details:\n\nName: [Your full name]\nLicense: [Driver's license number]\nExperience: [Years of experience]`,
      });

    case "driver_details":
      await updateUserData(phone, { driverDetails: text });
      await sendMessage({
        phone,
        text: `✅ Driver registration received!\n\n📞 Our team will review your application and get back to you within 48 hours.\n\nTo start over, reply with any message.`,
      });
      return updateUserState(phone, "entry");

    default:
      await updateUserState(phone, "entry");
      return sendMessage({ phone, text: "Please reply with 1, 2, or 3." });
  }
}
