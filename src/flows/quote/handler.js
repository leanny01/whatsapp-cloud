import { sendMessage } from "../../messages/send.js";
import { getUserData, updateUserData } from "../../leads/state.js";

/**
 * Quote flow handler
 * Handles quote request steps
 */
export class QuoteHandler {
  /**
   * Handle quote flow steps
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
      confirm: this.handleConfirm,
    };

    const handler = handlers[step];
    if (!handler) {
      return this.handleInvalidStep(phone);
    }

    return handler.call(this, phone, input, leadData);
  }

  /**
   * Handle step 1 - Name collection
   * @param {string} phone - User's phone number
   * @param {string} input - User input (name)
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handleStep1(phone, input, leadData) {
    const updatedData = { ...leadData, name: input };

    const message = `✅ Name recorded: ${input}\n\n🚗 *Step 2: Vehicle Type*\n\nPlease specify your vehicle type:\n\n1. Car\n2. Truck\n3. Motorcycle\n4. Other`;

    await sendMessage({ phone, text: message });

    return {
      nextStep: "2",
      data: updatedData,
    };
  }

  /**
   * Handle step 2 - Vehicle type
   * @param {string} phone - User's phone number
   * @param {string} input - User input (vehicle type)
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handleStep2(phone, input, leadData) {
    const vehicleTypes = {
      1: "Car",
      2: "Truck",
      3: "Motorcycle",
      4: "Other",
    };

    const vehicleType = vehicleTypes[input] || input;
    const updatedData = { ...leadData, vehicleType };

    const message = `✅ Vehicle type: ${vehicleType}\n\n🔧 *Step 3: Service Needed*\n\nWhat service do you need?\n\n1. Insurance\n2. Maintenance\n3. Repair\n4. Inspection\n5. Other`;

    await sendMessage({ phone, text: message });

    return {
      nextStep: "3",
      data: updatedData,
    };
  }

  /**
   * Handle step 3 - Service type
   * @param {string} phone - User's phone number
   * @param {string} input - User input (service type)
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handleStep3(phone, input, leadData) {
    const serviceTypes = {
      1: "Insurance",
      2: "Maintenance",
      3: "Repair",
      4: "Inspection",
      5: "Other",
    };

    const serviceType = serviceTypes[input] || input;
    const updatedData = { ...leadData, serviceType };

    // Calculate quote (simplified)
    const quoteAmount = this.calculateQuote(updatedData);
    const finalData = { ...updatedData, quoteAmount };

    const message = `✅ Service: ${serviceType}\n\n💰 *Quote Summary*\n\nName: ${finalData.name}\nVehicle: ${finalData.vehicleType}\nService: ${serviceType}\n\n*Estimated Quote: $${quoteAmount}*\n\nTo confirm this quote, reply with:\n\n✅ *CONFIRM* - Accept the quote\n❌ *CANCEL* - Cancel the request`;

    await sendMessage({ phone, text: message });

    return {
      nextStep: "confirm",
      data: finalData,
    };
  }

  /**
   * Handle confirmation
   * @param {string} phone - User's phone number
   * @param {string} input - User input (confirm/cancel)
   * @param {Object} leadData - Current lead data
   * @returns {Promise<Object>} Response and updated data
   */
  static async handleConfirm(phone, input, leadData) {
    const isConfirmed = input.toLowerCase().includes("confirm");

    if (isConfirmed) {
      const message = `🎉 *Quote Confirmed!*\n\nThank you ${leadData.name}! Your quote for ${leadData.serviceType} on your ${leadData.vehicleType} has been confirmed.\n\nOur team will contact you within 24 hours.\n\nTo start over, reply with any message.`;

      await sendMessage({ phone, text: message });

      return {
        nextState: "entry",
        nextStep: "1",
        data: leadData,
      };
    } else {
      const message = `❌ *Quote Cancelled*\n\nYour quote request has been cancelled.\n\nTo start over, reply with any message.`;

      await sendMessage({ phone, text: message });

      return {
        nextState: "entry",
        nextStep: "1",
        data: leadData,
      };
    }
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

  /**
   * Calculate quote amount (simplified)
   * @param {Object} data - Lead data
   * @returns {number} Quote amount
   */
  static calculateQuote(data) {
    let baseAmount = 100;

    // Vehicle type adjustments
    const vehicleMultipliers = {
      Car: 1,
      Truck: 1.5,
      Motorcycle: 0.8,
      Other: 1.2,
    };

    baseAmount *= vehicleMultipliers[data.vehicleType] || 1;

    // Service type adjustments
    const serviceMultipliers = {
      Insurance: 1.2,
      Maintenance: 1,
      Repair: 1.5,
      Inspection: 0.8,
      Other: 1.1,
    };

    baseAmount *= serviceMultipliers[data.serviceType] || 1;

    return Math.round(baseAmount);
  }
}

// Define the quote flow steps
export const QUOTE_STEPS = [
  {
    key: "from",
    question: "📍 Where are you moving *from*?",
    validate: (value) => value && value.length > 2,
  },
  {
    key: "to",
    question: "📍 Where are you moving *to*?",
    validate: (value) => value && value.length > 2,
  },
  {
    key: "date",
    question: "📅 What is your moving date? (e.g., 2024-07-01)",
    validate: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
  },
  {
    key: "type",
    question: "🏠 What type of move? (1. Apartment, 2. House, 3. Office)",
    validate: (value) => ["1", "2", "3"].includes(value),
  },
  {
    key: "size",
    question:
      "📦 How big is the move? (1. Few items, 2. 1-bedroom, 3. 2–3 bedroom, 4. Other)",
    validate: (value) => ["1", "2", "3", "4"].includes(value),
  },
  {
    key: "special",
    question: "📝 Any special requirements? (Type 'none' if not)",
    validate: (value) => typeof value === "string",
  },
];

const MOVE_TYPE_MAP = {
  1: "Apartment",
  2: "House",
  3: "Office",
};

function formatSummary(data) {
  return (
    `📝 *Quote Summary:*
` +
    `From: ${data.from}\n` +
    `To: ${data.to}\n` +
    `Date: ${data.date}\n` +
    `Type: ${MOVE_TYPE_MAP[data.type] || data.type}\n` +
    `Size: ${data.size}\n` +
    `Special: ${data.special}`
  );
}

function getQuoteMenu() {
  return (
    `*Quote Menu*\n` +
    `1️⃣ Submit\n` +
    `2️⃣ Edit order\n` +
    `3️⃣ Cancel\n` +
    `4️⃣ Back to main menu\n\n` +
    `Please reply with 1, 2, 3, or 4.`
  );
}

export async function handleQuote(phone, text, messageId) {
  // Log the incoming message ID and text
  console.log({ id: messageId, message: text });

  // Load user state from Redis
  let state = await getUserData(phone);
  console.log("Loaded user state:", phone, state);

  // Deduplication: if this messageId was already processed, ignore
  if (state && state.lastMessageId === messageId) {
    console.log("Duplicate message detected, ignoring:", messageId);
    return;
  }

  if (!state || state.flow !== "quote") {
    // Start new quote flow
    state = {
      flow: "quote",
      currentStep: 0,
      data: {},
      lastMessageId: messageId,
    };
    await updateUserData(phone, state);
    console.log("Updating user state (start flow):", phone, state);
    await sendMessage({ phone, text: QUOTE_STEPS[0].question });
    return;
  }

  const stepIndex = state.currentStep;
  const step = QUOTE_STEPS[stepIndex];
  if (!step) {
    // Should not happen, reset
    await updateUserData(phone, { lastMessageId: messageId });
    await sendMessage({
      phone,
      text: "Something went wrong. Let's start over.",
    });
    return;
  }

  // Validate input for current step
  if (!step.validate(text)) {
    // Update lastMessageId even for invalid input to avoid repeated error messages
    state.lastMessageId = messageId;
    await updateUserData(phone, state);
    await sendMessage({ phone, text: `❌ Invalid input.\n${step.question}` });
    return;
  }

  // Save answer
  state.data[step.key] =
    step.key === "type" ? MOVE_TYPE_MAP[text] || text : text;

  // Advance to next step
  if (stepIndex + 1 < QUOTE_STEPS.length) {
    state.currentStep = stepIndex + 1;
    state.lastMessageId = messageId;
    await updateUserData(phone, state);
    console.log("Updating user state (advance step):", phone, state);
    await sendMessage({ phone, text: QUOTE_STEPS[stepIndex + 1].question });
    return;
  }

  // All steps complete: send summary and then the quote menu
  await sendMessage({ phone, text: formatSummary(state.data) });
  await sendMessage({ phone, text: getQuoteMenu() });
  // Set state to quote_menu for next step
  await updateUserData(phone, {
    flow: "quote",
    state: "quote_menu",
    data: state.data,
    lastMessageId: messageId,
  });
  console.log("Set state to quote_menu after summary:", phone);
}
