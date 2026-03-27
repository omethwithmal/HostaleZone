const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    // Which student this notification belongs to
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },

    // Notification type
    type: {
      type: String,
      enum: ['leave', 'room', 'alert', 'general'],
      default: 'general',
    },

    // Priority level
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Has the student read this notification?
    isRead: {
      type: Boolean,
      default: false,
    },

    // Optional: link this notification to a leave or room booking
    refModel: {
      type: String,
      enum: ['Leave', 'RoomBooking', null],
      default: null,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Index for fast lookup of unread notifications per student
NotificationSchema.index({ student: 1, isRead: 1 });
NotificationSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
