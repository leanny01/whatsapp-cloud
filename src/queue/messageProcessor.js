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

      console.log("🔍 Processing message:", {
        wa_id: msg.wa_id,
        messageId: msg.messageId,
        text: msg.text,
        content_type: msg.content?.type,
      });

      console.log("Incoming WA ID:", msg.phone);

      // Log inbound message in background
      await logInbound(msg);

      if (await isDuplicateMessage(msg.wa_id, msg.messageId)) {
        console.log("🚫 Duplicate message, skipping");
        return;
      }

      let state = (await getUserState(msg.wa_id)) || { step: "main_menu" };
      console.log("📊 Current state:", {
        step: state.step,
        has_driver: !!state.driver,
        has_lead: !!state.lead,
      });

      const handler = getStepHandler(state.step);
      console.log(
        "🎯 Handler for step:",
        state.step,
        "Handler function:",
        handler.name
      );

      const updatedState = await handler(msg, state);
      console.log("🔄 Updated state:", {
        step: updatedState.step,
        has_driver: !!updatedState.driver,
        has_lead: !!updatedState.lead,
      });

      updatedState.last_message_id = msg.messageId;
      await saveUserState(msg.wa_id, updatedState);
      console.log("💾 State saved successfully");
    } catch (error) {
      console.error("❌ Error processing message:", error);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Processed message job ${job.id}`);
});
worker.on("failed", (job, err) => {
  console.error(`❌ Failed job ${job.id}:`, err);
});
