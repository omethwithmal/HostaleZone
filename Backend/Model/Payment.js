const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    feeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    feeName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['bank_slip', 'stripe'],
      required: true,
      default: 'bank_slip',
    },
    referenceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    proofImageUrl: {
      type: String,
      default: '',
    },
    stripeCheckoutSessionId: {
      type: String,
      default: undefined,
    },
    rejectReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index(
  { stripeCheckoutSessionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      stripeCheckoutSessionId: { $exists: true, $type: 'string', $gt: '' },
    },
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
