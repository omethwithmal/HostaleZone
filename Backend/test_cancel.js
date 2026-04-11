const mongoose = require('mongoose');
const RoomBooking = require('./Backend/Model/RoomBookingModel');
const Room = require('./Backend/Model/RoomModel');
require('dotenv').config({ path: './Backend/.env' });

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');

    const booking = await RoomBooking.findOne();
    if (!booking) {
      console.log('No booking found to test!');
      process.exit();
    }
    console.log('Found booking:', booking);

    const room = await Room.findById(booking.room);
    if (room) {
      room.occupants = Math.max(0, room.occupants - 1);
      room.isAvailable = room.occupants < room.capacity;
      try {
        await room.save();
        console.log('Room saved successfully');
      } catch (e) {
        console.error('Room save failed:', e.message);
      }
    } else {
      console.log('No room found for booking');
    }

    booking.status = 'cancelled';
    try {
      await booking.save();
      console.log('Booking saved successfully');
    } catch (e) {
      console.error('Booking save failed:', e.message);
    }

  } catch (e) {
    console.error('Main error:', e.message);
  } finally {
    process.exit();
  }
}

test();
