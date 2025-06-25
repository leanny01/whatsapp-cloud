import { Queue } from "bullmq";
import Redis from "ioredis";

// Configure Redis connection (adjust as needed)
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
connection.on("error", (err) => console.log("Redis Client Error", err));

/**
 * BullMQ queue for incoming WhatsApp messages.
 * All webhook messages are enqueued here for decoupled processing.
 */
export const messageQueue = new Queue("incoming-message", { connection });
