const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["Pending", "In Progress", "Resolved"], required: true },
    time: { type: Date, required: true },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true, required: true },
    studentName: { type: String, trim: true, maxlength: 50 },
    studentId: { type: String, trim: true, maxlength: 20 },
    category: {
      type: String,
      enum: ["Water", "Electricity", "WiFi", "Other"],
      required: true,
    },
    block: { type: String, trim: true, maxlength: 50 },
    roomNo: { type: String, trim: true, maxlength: 20 },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 15,
      maxlength: 500,
    },
    hostelOrRoomNo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    imageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    assignedTo: { type: String, default: "" },
    internalNotes: { type: String, default: "", maxlength: 1500 },
    statusHistory: { type: [statusHistorySchema], default: [] },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

complaintSchema.index({ category: 1, hostelOrRoomNo: 1, createdAt: -1 });

module.exports = mongoose.model("Complaint", complaintSchema);
