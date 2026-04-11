const express = require("express");
const {
  markAttendance,
  getTodayAttendance,
  getMyAttendance,
} = require("../Controlers/attendanceController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.post("/scan", protect, adminOnly, markAttendance);
router.get("/today", protect, adminOnly, getTodayAttendance);

// Student routes
router.get("/my-attendance", protect, getMyAttendance);

module.exports = router;
