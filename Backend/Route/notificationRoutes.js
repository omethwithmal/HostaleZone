const express = require("express");
const {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} = require("../Controlers/notificationController.js");
const { protect } = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get('/', protect, getNotifications);
router.patch('/read-all', protect, markAllNotificationsAsRead);
router.patch('/:id/read', protect, markNotificationAsRead);

module.exports = router;
