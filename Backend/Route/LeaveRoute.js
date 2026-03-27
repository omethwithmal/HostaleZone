const express = require('express');
const router  = express.Router();
const { protect } = require('../Middleware/auth');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require('../Controlers/LeaveController');

// Student routes (must be logged in)
router.post('/apply',       protect, applyLeave);        // POST   /api/leave/apply
router.get('/my-leaves',    protect, getMyLeaves);       // GET    /api/leave/my-leaves

// Admin routes (optional — add admin middleware if needed)
router.get('/all',          protect, getAllLeaves);       // GET    /api/leave/all
router.patch('/:id/status', protect, updateLeaveStatus); // PATCH  /api/leave/:id/status

module.exports = router;
