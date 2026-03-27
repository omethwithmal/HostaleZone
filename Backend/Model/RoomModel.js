const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  block: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C'],
  },
  blockName: {
    type: String,
  },
  capacity: {
    type: Number,
    default: 2,
  },
  occupants: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ['single', 'double', 'triple'],
    default: 'double',
  },
  floor: {
    type: Number,
    default: 1,
  },
  amenities: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Auto-set isAvailable based on occupants vs capacity
roomSchema.pre('save', function (next) {
  this.isAvailable = this.occupants < this.capacity;
  next();
});

//  Fix: check if model already exists before creating it
module.exports = mongoose.models.Room
  || mongoose.model('Room', roomSchema);