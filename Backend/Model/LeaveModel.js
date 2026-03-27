const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['medical', 'personal', 'emergency', 'family', 'other'],
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  contactDuringLeave: { type: String, default: '' },
  parentName:         { type: String, default: '' },
  parentPhone:        { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: '',
  },
}, { timestamps: true });

//  Prevent OverwriteModelError
module.exports = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
