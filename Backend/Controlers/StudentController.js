const Student = require("../Model/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Auto-generate Student ID has been removed per user requirement.
// The IT number (studentId) will now be submitted via the registration form.

// ✅ REGISTER
const registerStudent = async (req, res) => {
  try {
    const {
      studentId,
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      department,
      yearSemester,
      address,
    } = req.body;

    // 1) password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2) check email or studentId already exists
    const existingStudent = await Student.findOne({ email: email.trim().toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingIT = await Student.findOne({ studentId: studentId.trim() });
    if (existingIT) {
      return res.status(400).json({ message: "IT number already registered" });
    }

    // 3) hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4) profile photo (store with relative path for frontend)
    // If your multer stores in uploads/, use: uploads/filename
    const profilePhoto = req.file ? `uploads/${req.file.filename}` : "";

    // 5) store the manual IT number (studentId)
    const finalStudentId = studentId.trim();

    // 6) save student
    const newStudent = new Student({
      studentId: finalStudentId, // ✅ new
      fullName,
      email: email.trim().toLowerCase(),
      phone,
      password: hashedPassword,
      department,
      yearSemester,
      address,
      profilePhoto,
      isActive: true, // ✅ new (admin can deactivate later)
    });

    await newStudent.save();

    return res.status(201).json({
      message: "Student Registered Successfully",
      student: {
        _id: newStudent._id,
        studentId: newStudent.studentId, // ✅
        fullName: newStudent.fullName,
        email: newStudent.email,
        phone: newStudent.phone,
        department: newStudent.department,
        yearSemester: newStudent.yearSemester,
        address: newStudent.address,
        profilePhoto: newStudent.profilePhoto,
        isActive: newStudent.isActive, // ✅
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration Failed",
      error: error.message,
    });
  }
};

// ✅ LOGIN
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1) check email
    const student = await Student.findOne({ email: email.trim().toLowerCase() });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ 1.5) BLOCK LOGIN if admin deactivated
    if (student.isActive === false) {
      return res.status(403).json({
        message: "Your account is blocked by admin. Please contact hostel office.",
      });
    }

    // 2) compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3) create token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4) send response
    return res.status(200).json({
      message: "Login successful",
      token,
      student: {
        _id: student._id,
        studentId: student.studentId, // ✅
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        department: student.department,
        yearSemester: student.yearSemester,
        address: student.address,
        profilePhoto: student.profilePhoto,
        isActive: student.isActive, // ✅
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login Failed",
      error: error.message,
    });
  }
};

// ✅ UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const {
      studentId,
      fullName,
      phone,
      department,
      yearSemester,
      address,
    } = req.body;

    const student = await Student.findById(req.student._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (studentId) {
      const existingIT = await Student.findOne({ studentId: studentId.trim(), _id: { $ne: req.student._id } });
      if (existingIT) {
        return res.status(400).json({ message: "IT number already in use" });
      }
      student.studentId = studentId.trim();
    }
    
    if (fullName) student.fullName = fullName;
    if (phone) student.phone = phone;
    if (department) student.department = department;
    if (yearSemester) student.yearSemester = yearSemester;
    if (address) student.address = address;

    if (req.file) {
      student.profilePhoto = `uploads/${req.file.filename}`;
    }

    await student.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      student: {
        _id: student._id,
        studentId: student.studentId,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        department: student.department,
        yearSemester: student.yearSemester,
        address: student.address,
        profilePhoto: student.profilePhoto,
        isActive: student.isActive,
      },
      profilePhoto: student.profilePhoto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Profile Update Failed",
      error: error.message,
    });
  }
};

module.exports = { registerStudent, loginStudent, updateProfile };