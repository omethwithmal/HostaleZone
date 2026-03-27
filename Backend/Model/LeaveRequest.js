// Backend/Model/LeaveRequest.js
const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    leaveType: { type: String, required: true }, // medical, personal, emergency...
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },

    contactDuringLeave: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminComment: { type: String, default: "" },

    decidedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);