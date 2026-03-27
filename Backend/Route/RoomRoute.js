const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/auth');
const {
  getRooms,
  getMyBooking,
  bookRoom,
  cancelBooking,
  seedRooms,
} = require('../Controlers/RoomController');

// Public seed route (run once to create rooms in DB)
router.post('/seed', seedRooms);

// Protected routes (student must be logged in)
router.get('/',           protect, getRooms);       // GET  /api/rooms?block=A
router.get('/my-booking', protect, getMyBooking);   // GET  /api/rooms/my-booking
router.post('/book',      protect, bookRoom);       // POST /api/rooms/book
router.delete('/cancel',  protect, cancelBooking);  // DELETE /api/rooms/cancel

module.exports = router;