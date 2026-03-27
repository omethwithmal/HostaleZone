const Leave = require('../Model/LeaveModel');

// ─────────────────────────────────────────
// POST /api/leave/apply
// Student submits a new leave request
// ─────────────────────────────────────────
const applyLeave = async (req, res) => {
  try {
    const {
      leaveType,
      fromDate,
      toDate,
      reason,
      contactDuringLeave,
      parentName,
      parentPhone,
    } = req.body;

    // Required field check
    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Leave Type, From Date, To Date, and Reason are required.',
      });
    }

    // Date logic check
    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({
        success: false,
        message: 'To Date cannot be earlier than From Date.',
      });
    }

    const leave = await Leave.create({
      student: req.student._id,
      leaveType,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      contactDuringLeave: contactDuringLeave || '',
      parentName:         parentName         || '',
      parentPhone:        parentPhone         || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully!',
      leave,
    });
  } catch (error) {
    console.error('applyLeave error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting leave request.' });
  }
};

// ─────────────────────────────────────────
// GET /api/leave/my-leaves
// Get all leave requests for logged-in student
// ─────────────────────────────────────────
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ student: req.student._id })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error('getMyLeaves error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leave history.' });
  }
};

// ─────────────────────────────────────────
// GET /api/leave/all   (Admin only — optional)
// Get ALL student leave requests
// ─────────────────────────────────────────
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({})
      .populate('student', 'fullName email department')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    console.error('getAllLeaves error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching all leaves.' });
  }
};

// ─────────────────────────────────────────
// PATCH /api/leave/:id/status  (Admin only — optional)
// Approve or reject a leave request
// Body: { status: 'approved' | 'rejected', adminNote: '...' }
// ─────────────────────────────────────────
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected.' });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || '' },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    res.status(200).json({ success: true, message: `Leave ${status} successfully.`, leave });
  } catch (error) {
    console.error('updateLeaveStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error updating leave status.' });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
