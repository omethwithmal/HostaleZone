// Backend/Route/AdminLeaveRoute.js
const router = require("express").Router();
const Leave = require("../Model/LeaveModel");
const Notification = require("../Model/NotificationModel");
const { requireAuth, requireAdmin } = require("../Middleware/auth");

// ✅ GET all leaves (admin) with filter/search
// /api/admin/leaves?status=pending&search=kumara
router.get("/leaves", requireAdmin, async (req, res) => {
  try {
    const { status = "all", search = "" } = req.query;

    const q = {};
    if (status !== "all") q.status = status;

    const leaves = await Leave.find(q)
      .populate("student", "fullName email phone department yearSemester")
      .sort({ createdAt: -1 });

    // simple search in student fields
    const s = search.trim().toLowerCase();
    const filtered =
      s.length === 0
        ? leaves
        : leaves.filter((l) => {
            const st = l.student || {};
            return (
              (st.fullName || "").toLowerCase().includes(s) ||
              (st.email || "").toLowerCase().includes(s) ||
              (st.phone || "").toLowerCase().includes(s) ||
              (l.leaveType || "").toLowerCase().includes(s)
            );
          });

    // Keep response shape consistent with frontend (it expects adminComment).
    const normalized = filtered.map((l) => {
      const obj = l.toObject ? l.toObject() : l;
      if (obj.adminComment === undefined) obj.adminComment = obj.adminNote || "";
      return obj;
    });

    res.json({ leaves: normalized });
  } catch (err) {
    res.status(500).json({ message: "Failed to load leaves", error: String(err) });
  }
});

// ✅ GET one leave (admin)
router.get("/leaves/:id", requireAdmin, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate(
      "student",
      "fullName email phone department yearSemester"
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const obj = leave.toObject ? leave.toObject() : leave;
    if (obj.adminComment === undefined) obj.adminComment = obj.adminNote || "";
    res.json({ leave: obj });
  } catch (err) {
    res.status(500).json({ message: "Failed", error: String(err) });
  }
});

// ✅ UPDATE status (approve/reject)
router.put("/leaves/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, adminComment = "" } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.id).populate("student", "fullName");
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    // Underlying model uses adminNote; frontend expects adminComment in API responses.
    leave.adminNote = adminComment;
    await leave.save();

    // ✅ Optional: Create notification for student
    try {
      const title =
        status === "approved"
          ? "Leave Request Approved"
          : status === "rejected"
          ? "Leave Request Rejected"
          : "Leave Request Updated";

      const from = new Date(leave.fromDate).toLocaleDateString("en-GB");
      const to = new Date(leave.toDate).toLocaleDateString("en-GB");

      await Notification.create({
        student: leave.student._id,
        type: "leave",
        title,
        message:
          status === "approved"
            ? `Your leave request (${from} → ${to}) has been approved.`
            : status === "rejected"
            ? `Your leave request (${from} → ${to}) has been rejected. ${adminComment ? "Reason: " + adminComment : ""}`
            : `Your leave request (${from} → ${to}) status changed to ${status}.`,
        priority: status === "rejected" ? "high" : "normal",
      });
    } catch (_) {}

    const obj = leave.toObject ? leave.toObject() : leave;
    if (obj.adminComment === undefined) obj.adminComment = obj.adminNote || "";
    res.json({ message: "Updated", leave: obj });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: String(err) });
  }
});

module.exports = router;