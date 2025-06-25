import Lead from "./model.js";

export async function createLead(data) {
  return Lead.create({ ...data, status: "new" });
}

/**
 * Lead service for moving customers
 */
export class LeadService {
  /**
   * Find or create a lead
   * @param {string} phone - Phone number
   * @returns {Promise<Object>} Lead object
   */
  static async findOrCreate(phone) {
    let lead = await Lead.findOne({ phone });

    if (!lead) {
      lead = new Lead({ phone });
      await lead.save();
    }

    return lead;
  }

  /**
   * Update moving details
   * @param {string} phone - Phone number
   * @param {Object} movingData - Moving details
   * @returns {Promise<Object>} Updated lead
   */
  static async updateMovingDetails(phone, movingData) {
    const { name, moving_from, moving_to, move_date, category } = movingData;

    return Lead.findOneAndUpdate(
      { phone },
      {
        name,
        moving_from,
        moving_to,
        move_date,
        category,
        status: "pending",
      },
      { new: true }
    );
  }

  /**
   * Update lead status
   * @param {string} phone - Phone number
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated lead
   */
  static async updateStatus(phone, status) {
    return Lead.findOneAndUpdate({ phone }, { status }, { new: true });
  }

  /**
   * Get lead by phone number
   * @param {string} phone - Phone number
   * @returns {Promise<Object>} Lead object
   */
  static async getByPhone(phone) {
    return Lead.findOne({ phone });
  }

  /**
   * Get all leads
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of leads
   */
  static async getAll(options = {}) {
    const {
      limit = 50,
      skip = 0,
      sortBy = "created_at",
      sortOrder = -1,
      status,
      category,
    } = options;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    return Lead.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
  }

  /**
   * Get leads by status
   * @param {string} status - Lead status
   * @returns {Promise<Array>} Array of leads
   */
  static async getByStatus(status) {
    return Lead.find({ status }).sort({ created_at: -1 });
  }

  /**
   * Get leads by category
   * @param {string} category - Lead category
   * @returns {Promise<Array>} Array of leads
   */
  static async getByCategory(category) {
    return Lead.find({ category }).sort({ created_at: -1 });
  }

  /**
   * Get new leads
   * @returns {Promise<Array>} Array of new leads
   */
  static async getNewLeads() {
    return Lead.find({ status: "new" }).sort({ created_at: -1 });
  }

  /**
   * Get pending leads
   * @returns {Promise<Array>} Array of pending leads
   */
  static async getPendingLeads() {
    return Lead.find({ status: "pending" }).sort({ created_at: -1 });
  }

  /**
   * Get completed leads
   * @returns {Promise<Array>} Array of completed leads
   */
  static async getCompletedLeads() {
    return Lead.find({ status: "completed" }).sort({ created_at: -1 });
  }
}
