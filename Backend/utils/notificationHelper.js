// ─────────────────────────────────────────────────────────────────
//  notificationHelper.js
//  Utility to create notifications from other routes (Leave, Room)
//  Usage:  const { notify } = require('../utils/notificationHelper');
//          await notify(studentId, 'leave', 'high', 'Title', 'Message body');
// ─────────────────────────────────────────────────────────────────

const Notification = require('../Model/NotificationModel');

/**
 * Create a single notification for a student.
 * @param {string} studentId  - MongoDB ObjectId of the student
 * @param {string} type       - 'leave' | 'room' | 'alert' | 'general'
 * @param {string} priority   - 'normal' | 'high' | 'urgent'
 * @param {string} title      - Short notification title
 * @param {string} message    - Notification body message
 * @param {string} [refModel] - Optional: 'Leave' | 'RoomBooking'
 * @param {string} [refId]    - Optional: related document ObjectId
 */
const notify = async (studentId, type, priority, title, message, refModel = null, refId = null) => {
  try {
    await Notification.create({ student: studentId, type, priority, title, message, refModel, refId });
  } catch (err) {
    // Never crash the main route if notification fails
    console.error('⚠️  Notification creation failed (non-fatal):', err.message);
  }
};

// ── Pre-built notification templates ──────────────────────────────

const notifyLeaveApproved = (studentId, leaveType, fromDate, toDate, leaveId) =>
  notify(
    studentId, 'leave', 'high',
    'Leave Request Approved ✅',
    `Your ${leaveType} leave request from ${fmt(fromDate)} to ${fmt(toDate)} has been approved by the Hostel Warden.`,
    'Leave', leaveId
  );

const notifyLeaveRejected = (studentId, leaveType, fromDate, toDate, leaveId) =>
  notify(
    studentId, 'leave', 'high',
    'Leave Request Rejected ❌',
    `Your ${leaveType} leave request from ${fmt(fromDate)} to ${fmt(toDate)} has been rejected. Please contact the warden for more details.`,
    'Leave', leaveId
  );

const notifyLeavePending = (studentId, leaveType, fromDate, toDate, leaveId) =>
  notify(
    studentId, 'leave', 'normal',
    'Leave Request Submitted ⏳',
    `Your ${leaveType} leave request from ${fmt(fromDate)} to ${fmt(toDate)} has been submitted and is pending approval.`,
    'Leave', leaveId
  );

const notifyRoomBooked = (studentId, block, roomNumber, bookingId) =>
  notify(
    studentId, 'room', 'high',
    'Room Booking Confirmed 🏠',
    `Your room booking for Block ${block} · Room ${roomNumber} has been confirmed. Please collect your key from the hostel office.`,
    'RoomBooking', bookingId
  );

const notifyRoomCancelled = (studentId, block, roomNumber) =>
  notify(
    studentId, 'room', 'normal',
    'Room Booking Cancelled',
    `Your room booking for Block ${block} · Room ${roomNumber} has been cancelled.`
  );

const notifyFeeReminder = (studentId, dueDate) =>
  notify(
    studentId, 'alert', 'urgent',
    'Hostel Fee Reminder 💰',
    `Your hostel fee is due by ${dueDate}. Please settle the payment to avoid late charges.`
  );

const notifyGeneral = (studentId, title, message) =>
  notify(studentId, 'general', 'normal', title, message);

// ── Internal helper ───────────────────────────────────────────────
const fmt = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

module.exports = {
  notify,
  notifyLeaveApproved,
  notifyLeaveRejected,
  notifyLeavePending,
  notifyRoomBooked,
  notifyRoomCancelled,
  notifyFeeReminder,
  notifyGeneral,
};