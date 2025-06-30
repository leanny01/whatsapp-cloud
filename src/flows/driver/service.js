import Driver from "./model.js";

/**
 * Save a new driver application.
 * @param {string} wa_id - WhatsApp user ID
 * @param {object} driverData - Driver application data
 */
export async function saveDriverApplication(wa_id, driverData) {
  console.log("💾 Saving driver application:", {
    wa_id,
    name: driverData.name,
    phone: driverData.phone,
    has_vehicles: !!driverData.vehicles?.length,
    has_documents: !!driverData.documents,
  });

  try {
    const result = await Driver.create({ wa_id, ...driverData });
    console.log("✅ Driver application saved successfully:", result._id);
    return result;
  } catch (error) {
    console.error("❌ Error saving driver application:", error);
    throw error;
  }
}

/**
 * Get driver application for a user.
 * @param {string} wa_id - WhatsApp user ID
 * @returns {Promise<Object|null>} Driver application or null
 */
export async function getDriverApplication(wa_id) {
  return await Driver.findOne({ wa_id }).sort({ createdAt: -1 }).lean();
}

/**
 * Get all driver applications for a user.
 * @param {string} wa_id - WhatsApp user ID
 * @returns {Promise<Array>} Array of driver applications
 */
export async function getDriverApplications(wa_id) {
  return await Driver.find({ wa_id }).sort({ createdAt: -1 }).lean();
}

/**
 * Get driver application by phone number for status checking.
 * @param {string} phone - Phone number
 * @returns {Promise<Object|null>} Driver application or null
 */
export async function getDriverApplicationByPhone(phone) {
  return await Driver.findOne({ phone }).sort({ createdAt: -1 }).lean();
}
