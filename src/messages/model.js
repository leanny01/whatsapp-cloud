import mongoose from "mongoose";

const MessageLogSchema = new mongoose.Schema({
  from: String,
  to: String,
  type: String,
  text: { body: String },
  direction: String, // "inbound" or "outbound"
  timestamp: Date,
  raw: Object,
});

const MessageLog = mongoose.model("MessageLog", MessageLogSchema);

export default MessageLog;
