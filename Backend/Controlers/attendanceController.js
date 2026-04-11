const Attendance = require("../Model/AttendanceModel");
const Student = require("../Model/StudentModel");

// Admin: Scan QR & Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { qrPayload } = req.body;
    if (!qrPayload) return res.status(400).json({ message: "No QR payload provided" });

    // Try to parse the QR payload
    let data;
    try {
      data = JSON.parse(qrPayload);
    } catch (e) {
      return res.status(400).json({ message: "Invalid QR Format" });
    }

    if (!data.studentRef || !data.studentId) {
      return res.status(400).json({ message: "Invalid Attendance QR Code" });
    }

    // Check if the student actually exists
    const student = await Student.findById(data.studentRef);
    if (!student) {
      return res.status(404).json({ message: "Student not found in database" });
    }

    // Determine today's start and end logic
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check if attendance is already marked for today
    const existingEntry = await Attendance.findOne({
      studentRef: student._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingEntry) {
      return res.status(400).json({ message: "Attendance already marked for today!" });
    }

    // Create the attendance record
    const attendance = await Attendance.create({
      studentRef: student._id,
      studentId: student.studentId,
      studentName: student.fullName,
      status: "Present",
    });

    res.status(201).json({
      message: "Attendance marked successfully!",
      attendance,
    });
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ message: "Server error marking attendance" });
  }
};

// Admin: Get Today's Attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching attendance" });
  }
};

// Student: Get their own attendance history
exports.getMyAttendance = async (req, res) => {
  try {
    // req.user logic depends on your auth format. Assuming standard payload setup:
    const userId = req.user ? req.user._id : req.studentId; // using possible injected token values
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const records = await Attendance.find({ studentRef: userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching history" });
  }
};
