import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // 'text', 'image', 'video', 'document', 'audio'
    content: String, // for text items
    id: String, // for media items
    caption: String, // for media items
    filename: String, // for document items
  },
  { _id: false }
);

const QuoteSchema = new mongoose.Schema({
  wa_id: { type: String, required: true, index: true },
  from: String,
  to: String,
  date: String,
  items: [ItemSchema], // Array of items (replaces individual media fields)
  status: { type: String, default: "pending" },
  feedback: {
    rating: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
      default: null,
    },
    comment: { type: String, default: null },
    submittedAt: { type: Date, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
