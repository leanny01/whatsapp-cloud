import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import webhookGet from "./webhook/get.js";
import webhookPost from "./webhook/post.js";
import { sendMessage } from "./messages/send.js";
import logsRouter from "./messages/view.js";
import rateLimit from "express-rate-limit";

dotenv.config();
connectDB();

const app = express();
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 10, // limit to 10 requests per min
  message: "Too many webhook requests",
});
app.use(express.json());

// Webhook routes
app.get("/webhook", webhookLimiter, webhookGet);
app.post("/webhook", webhookLimiter, webhookPost);

// Message logs routes
app.use("/api/logs", webhookLimiter, logsRouter);

// Test route
app.get("/test", webhookLimiter, async (req, res) => {
  const phone = req.query.phone;
  if (!phone) {
    return res.status(400).send("Missing ?phone= parameter");
  }

  await sendMessage({ phone, text: "Test message" });
  res.send(`Message sent to ${phone}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
