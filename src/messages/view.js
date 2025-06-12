import express from "express";
import { getMessagesByPhone, getMessageCountByPhone } from "../lib/messages.js";

const router = express.Router();

/**
 * GET /api/logs/:phone
 * Get all messages for a specific phone number
 */
router.get("/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const { limit, skip, sortBy, sortOrder } = req.query;

    const messages = await getMessagesByPhone(phone, {
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      sortBy,
      sortOrder: sortOrder ? parseInt(sortOrder) : undefined,
    });

    const total = await getMessageCountByPhone(phone);

    res.json({
      success: true,
      data: {
        messages,
        total,
        phone,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch message logs",
      details: error.message,
    });
  }
});

/**
 * GET /api/logs
 * Get messages with optional phone number filter
 */
router.get("/", async (req, res) => {
  try {
    const { phone, limit, skip, sortBy, sortOrder } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required",
      });
    }

    const messages = await getMessagesByPhone(phone, {
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      sortBy,
      sortOrder: sortOrder ? parseInt(sortOrder) : undefined,
    });

    const total = await getMessageCountByPhone(phone);

    res.json({
      success: true,
      data: {
        messages,
        total,
        phone,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch message logs",
      details: error.message,
    });
  }
});

export default router;
