const express = require('express');
const router  = express.Router();
const Notification = require('../Model/NotificationModel');
const jwt          = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────
//  AUTH MIDDLEWARE  (reuses same JWT logic as your other routes)
// ─────────────────────────────────────────────────────────────────
const authStudent = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.studentId = decoded.id || decoded._id || decoded.studentId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ─────────────────────────────────────────────────────────────────
//  GET  /api/notifications/my
//  Returns all notifications for the logged-in student (newest first)
// ─────────────────────────────────────────────────────────────────
router.get('/my', authStudent, async (req, res) => {
  try {
    const notifications = await Notification.find({ student: req.studentId })
      .sort({ createdAt: -1 })
      .lean();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('GET /notifications/my error:', err);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  GET  /api/notifications/unread-count
//  Returns just the unread count (useful for sidebar badge)
// ─────────────────────────────────────────────────────────────────
router.get('/unread-count', authStudent, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      student: req.studentId,
      isRead: false,
    });
    res.json({ unreadCount: count });
  } catch (err) {
    console.error('GET /notifications/unread-count error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  PUT  /api/notifications/mark-all-read
//  Marks ALL notifications for the student as read
// ─────────────────────────────────────────────────────────────────
router.put('/mark-all-read', authStudent, async (req, res) => {
  try {
    await Notification.updateMany(
      { student: req.studentId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('PUT /notifications/mark-all-read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  PUT  /api/notifications/:id/read
//  Marks a single notification as read
// ─────────────────────────────────────────────────────────────────
router.put('/:id/read', authStudent, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, student: req.studentId },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error('PUT /notifications/:id/read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  DELETE  /api/notifications/:id
//  Deletes a single notification (only if it belongs to the student)
// ─────────────────────────────────────────────────────────────────
router.delete('/:id', authStudent, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      student: req.studentId,
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('DELETE /notifications/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  POST  /api/notifications/send
//  (ADMIN / INTERNAL USE) — Create a notification for a student
//  Body: { studentId, type, priority, title, message, refModel?, refId? }
// ─────────────────────────────────────────────────────────────────
router.post('/send', async (req, res) => {
  try {
    const { studentId, type, priority, title, message, refModel, refId } = req.body;

    if (!studentId || !title || !message) {
      return res.status(400).json({ message: 'studentId, title and message are required' });
    }

    const notification = await Notification.create({
      student:  studentId,
      type:     type     || 'general',
      priority: priority || 'normal',
      title,
      message,
      refModel: refModel || null,
      refId:    refId    || null,
    });

    res.status(201).json({ message: 'Notification sent', notification });
  } catch (err) {
    console.error('POST /notifications/send error:', err);
    res.status(500).json({ message: 'Server error sending notification' });
  }
});

// ─────────────────────────────────────────────────────────────────
//  POST  /api/notifications/send-all
//  (ADMIN / INTERNAL USE) — Broadcast notification to ALL students
//  Body: { studentIds: [...], type, priority, title, message }
// ─────────────────────────────────────────────────────────────────
router.post('/send-all', async (req, res) => {
  try {
    const { studentIds, type, priority, title, message } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'studentIds array is required' });
    }
    if (!title || !message) {
      return res.status(400).json({ message: 'title and message are required' });
    }

    const docs = studentIds.map(studentId => ({
      student:  studentId,
      type:     type     || 'general',
      priority: priority || 'normal',
      title,
      message,
    }));

    await Notification.insertMany(docs);
    res.status(201).json({ message: `Notification sent to ${studentIds.length} students` });
  } catch (err) {
    console.error('POST /notifications/send-all error:', err);
    res.status(500).json({ message: 'Server error broadcasting notification' });
  }
});

module.exports = router;
