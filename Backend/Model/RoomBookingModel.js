const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

//  Fix: check if model already exists before creating it
module.exports = mongoose.models.RoomBooking
  || mongoose.model('RoomBooking', roomBookingSchema);