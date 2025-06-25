import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  name: String,
  moving_from: String,
  moving_to: String,
  move_date: String,
  category: String,
  status: {
    type: String,
    default: "new",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
leadSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Lead", leadSchema);
