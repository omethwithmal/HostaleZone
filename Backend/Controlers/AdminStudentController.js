const Student = require("../Model/StudentModel");

// ✅ GET: /api/admin/students?search=...
exports.getAllStudents = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    let filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter = {
        $or: [{ fullName: regex }, { email: regex }, { studentId: regex }],
      };
    }

    const students = await Student.find(filter)
      .select("-password") // hide password
      .sort({ createdAt: -1 });

    return res.status(200).json({ students });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ✅ GET: /api/admin/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    return res.status(200).json({ student });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// ✅ PUT: /api/admin/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const { studentId, fullName, email, phone, department, yearSemester, address } = req.body;

    // Prevent duplicate email
    if (email) {
      const exist = await Student.findOne({ email, _id: { $ne: req.params.id } });
      if (exist) return res.status(400).json({ message: "Email already exists" });
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { studentId, fullName, email, phone, department, yearSemester, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({
      message: "Student updated successfully",
      student: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// ✅ DELETE: /api/admin/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

// ✅ PATCH: /api/admin/students/:id/status
exports.updateStudentStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: !!isActive },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({
      message: updated.isActive ? "Student Activated" : "Student Deactivated",
      student: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};