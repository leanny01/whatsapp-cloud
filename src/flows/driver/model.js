import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    id: String,
    mime_type: String,
    caption: String,
    filename: String,
  },
  { _id: false }
);

const VehicleSchema = new mongoose.Schema(
  {
    type: String,
    owns: Boolean,
    photos: [MediaSchema],
    license_plate: String,
    year: String,
    registered_under_company: Boolean,
    company_name: String,
  },
  { _id: false }
);

const DriverSchema = new mongoose.Schema({
  wa_id: { type: String, required: true, index: true },
  name: String,
  phone: String,
  call_number: String,
  home_address: String,
  license_number: String,
  vehicles: [VehicleSchema],
  experience_years: Number,
  works_alone: Boolean, // true = alone, false = has team
  common_routes: [String], // array of routes/areas
  specialization: String,
  other_activities: String,
  status: { type: String, default: "pending" }, // pending, approved, rejected
  documents: {
    id_passport: [MediaSchema],
    license: [MediaSchema],
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Driver || mongoose.model("Driver", DriverSchema);
