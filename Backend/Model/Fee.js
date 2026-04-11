const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['hostel_fee', 'room_flow', 'utilities', 'late_payment'],
      required: true,
      default: 'hostel_fee',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual', 'one_time'],
      default: 'one_time',
    },
    roomFlowBasis: {
      type: String,
      default: '',
      trim: true,
    },
    utilityType: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    lateFeeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'overdue',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
