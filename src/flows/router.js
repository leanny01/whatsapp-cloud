import { getStepHandler as getQuoteStepHandler } from "./quote/handler.js";
import { getDriverStepHandler } from "./driver/handler.js";
import { sendText } from "../lib/messages.js";
import { logOutbound } from "../messages/log.js";

const SUPPORT_PHONE = process.env.SUPPORT_PHONE || "27811234567"; // Replace with real support number
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@bubakii.co.za"; // Replace with real support email

async function router_404(msg, state) {
  const errorMsg = `😱 Oops! We seem to have lost our way in the digital jungle. This is not supposed to happen!\n\nPlease *let our team know* about this issue so we can fix it faster than you can say '404'.\n\nYou can also reach us directly at:\n📞 *${SUPPORT_PHONE}*\n✉️ *${SUPPORT_EMAIL}*\n\nMeanwhile, our team has been notified. Sorry for the hiccup! 🤦‍♂️`;
  await sendText({ phone: msg.phone, text: errorMsg });
  // Notify the team
  await sendText({
    phone: msg.phone,
    text: `🚨 404 Error for user ${msg.phone} at step: ${state.step}\nMessage: ${msg.text}`,
  });
  // Log the error
  await logOutbound({
    phone: msg.phone,
    text: `[404-router] ${state.step} - ${msg.text}`,
    result: { error: true },
  });
  return { ...state, step: "main_menu" };
}

/**
 * Main router that handles both quote and driver flows
 * @param {string} step - Current step name
 * @returns {Function} The appropriate step handler
 */
export function getStepHandler(step) {
  // Check if this is a driver step by looking for driver-specific prefixes
  if (step.startsWith("driver_") || step === "review_driver") {
    return getDriverStepHandler(step);
  }

  // Check for driver awaiting steps (more specific)
  const driverAwaitingSteps = [
    "awaiting_name",
    "awaiting_phone",
    "awaiting_call_number",
    "awaiting_address",
    "awaiting_license",
    "awaiting_vehicle",
    "awaiting_ownership",
    "awaiting_company_registration",
    "awaiting_company_name",
    "awaiting_vehicle_photos",
    "awaiting_more_vehicles",
    "awaiting_experience",
    "awaiting_team",
    "awaiting_routes",
    "awaiting_specialization",
    "awaiting_other_activities",
    "awaiting_id_photo",
    "awaiting_license_photo",
  ];

  if (driverAwaitingSteps.includes(step)) {
    return getDriverStepHandler(step);
  }

  // Check if this is a quote step
  if (typeof getQuoteStepHandler(step) === "function") {
    return getQuoteStepHandler(step);
  }

  // Default to 404 fallback
  return router_404;
}
