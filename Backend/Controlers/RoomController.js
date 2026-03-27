const Room = require('../Model/RoomModel');
const RoomBooking = require('../Model/RoomBookingModel');

// ─────────────────────────────────────────
// GET /api/rooms?block=A
// Get all rooms, optionally filter by block
// ─────────────────────────────────────────
const getRooms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.block) {
      filter.block = req.query.block.toUpperCase();
    }

    const rooms = await Room.find(filter).sort({ roomNumber: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error('getRooms error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching rooms' });
  }
};

// ─────────────────────────────────────────
// GET /api/rooms/my-booking
// Get the logged-in student's current booking
// ─────────────────────────────────────────
const getMyBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findOne({
      student: req.student._id,
      status: { $ne: 'cancelled' },
    }).populate('room', 'roomNumber block capacity type');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'No booking found' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('getMyBooking error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching booking' });
  }
};

// ─────────────────────────────────────────
// POST /api/rooms/book
// Book a room for the logged-in student
// Body: { roomId }
// ─────────────────────────────────────────
const bookRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ success: false, message: 'roomId is required' });
    }

    // Check if student already has an active booking
    const existingBooking = await RoomBooking.findOne({
      student: req.student._id,
      status: { $ne: 'cancelled' },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `You already have a booking for Room ${existingBooking.roomNumber} in Block ${existingBooking.block}`,
      });
    }

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Check availability
    if (!room.isAvailable || room.occupants >= room.capacity) {
      return res.status(400).json({ success: false, message: 'This room is fully occupied. Please choose another room.' });
    }

    // Create booking
    const booking = await RoomBooking.create({
      student: req.student._id,
      room: room._id,
      roomNumber: room.roomNumber,
      block: room.block,
      status: 'confirmed',
    });

    // Update room occupancy
    room.occupants += 1;
    room.isAvailable = room.occupants < room.capacity;
    await room.save();

    res.status(201).json({
      success: true,
      message: `Room ${room.roomNumber} in Block ${room.block} booked successfully!`,
      booking: {
        _id: booking._id,
        roomNumber: room.roomNumber,
        block: room.block,
        status: booking.status,
        bookedAt: booking.bookedAt,
      },
    });
  } catch (error) {
    console.error('bookRoom error:', error);
    res.status(500).json({ success: false, message: 'Server error booking room' });
  }
};

// ─────────────────────────────────────────
// DELETE /api/rooms/cancel
// Cancel the logged-in student's booking
// ─────────────────────────────────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findOne({
      student: req.student._id,
      status: { $ne: 'cancelled' },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'No active booking found' });
    }

    // Restore room occupancy
    const room = await Room.findById(booking.room);
    if (room) {
      room.occupants = Math.max(0, room.occupants - 1);
      room.isAvailable = room.occupants < room.capacity;
      await room.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('cancelBooking error:', error);
    res.status(500).json({ success: false, message: 'Server error cancelling booking' });
  }
};

// ─────────────────────────────────────────
// POST /api/rooms/seed
// Seed default rooms for all 3 blocks (run once)
// ─────────────────────────────────────────
const seedRooms = async (req, res) => {
  try {
    const existing = await Room.countDocuments();
    if (existing > 0) {
      return res.status(200).json({ success: true, message: `Rooms already exist (${existing} rooms). Skipping seed.` });
    }

    const blocks = [
      { id: 'A', name: 'Boys Hostel',              count: 20 },
      { id: 'B', name: 'Girls Hostel',             count: 20 },
      { id: 'C', name: 'Lecturers / Instructors',  count: 10 },
    ];

    const rooms = [];
    for (const block of blocks) {
      for (let i = 1; i <= block.count; i++) {
        const num = String(i).padStart(2, '0');
        rooms.push({
          roomNumber: `${block.id}${num}`,
          block: block.id,
          blockName: block.name,
          capacity: block.id === 'C' ? 1 : 2,
          occupants: 0,
          isAvailable: true,
          type: block.id === 'C' ? 'single' : 'double',
          floor: Math.ceil(i / 5),
        });
      }
    }

    await Room.insertMany(rooms);
    res.status(201).json({ success: true, message: `${rooms.length} rooms seeded successfully!`, rooms });
  } catch (error) {
    console.error('seedRooms error:', error);
    res.status(500).json({ success: false, message: 'Server error seeding rooms' });
  }
};

module.exports = { getRooms, getMyBooking, bookRoom, cancelBooking, seedRooms };






