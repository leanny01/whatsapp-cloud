import { Worker } from "bullmq";
import Redis from "ioredis";
import {
  getUserState,
  saveUserState,
  isDuplicateMessage,
} from "../leads/state.js";
import { getStepHandler } from "../flows/router.js";
import { connectDB } from "../config/db.js";
import { logInbound } from "../messages/log.js";
import {
  createUserState,
  validateUserState,
  createDefaultState,
} from "../lib/stateUtils.js";

import "dotenv/config";

// Connect to MongoDB
connectDB();

const connection = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  }
);
connection.on("error", (err) => console.log("Redis Client Error", err));

/**
 * BullMQ worker to process incoming WhatsApp messages from the queue.
 * This file now acts as a dispatcher only: it loads state, routes to the correct step handler, and saves state.
 * All step logic is in /flows/quote/steps/ and /flows/driver/steps/ handlers.
 */
const worker = new Worker(
  "incoming-message",
  async (job) => {
    try {
      const msg = job.data;
      if (!msg || !msg.wa_id || !msg.messageId) return;

      // Log inbound message in background
      await logInbound(msg);

      if (await isDuplicateMessage(msg.wa_id, msg.messageId)) {
        return;
      }

      let state =
        (await getUserState(msg.wa_id)) || createDefaultState(msg.wa_id);

      // Ensure state has a valid step
      if (!state.step) {
        state = createDefaultState(msg.wa_id);
      }

      // Add user ID to state for validation
      state = createUserState(state, msg.wa_id);

      const handler = getStepHandler(state.step);

      let updatedState = await handler(msg, state);

      // Validate that the updated state belongs to the correct user
      if (!validateUserState(updatedState, msg.wa_id)) {
        console.error("❌ State user mismatch detected:", {
          expected: msg.wa_id,
          actual: updatedState?.userId,
        });
        // Reset to safe state
        updatedState = createDefaultState(msg.wa_id);
      }

      updatedState.last_message_id = msg.messageId;
      await saveUserState(msg.wa_id, updatedState);
    } catch (error) {
      console.error("❌ Error processing message:", error);
    }
  },
  { connection }
);

worker.on("completed", () => {
  // Job completed successfully
});
worker.on("failed", (job, err) => {
  console.error(`❌ Failed job ${job.id}:`, err);
});
