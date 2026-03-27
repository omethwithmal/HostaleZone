const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { registerStudent, loginStudent, updateProfile } = require("../Controlers/StudentController");
const { protect } = require("../Middleware/auth");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// REGISTER (with profile photo upload)
router.post("/register", upload.single("profilePhoto"), registerStudent);

// LOGIN (no file upload)
router.post("/login", loginStudent);

// UPDATE PROFILE
router.put("/profile", protect, upload.single("profilePhoto"), updateProfile);

module.exports = router;
