const fs = require("fs");
const express = require("express");
const path = require("path");
const multer = require("multer");
const Complaint = require("../Model/Complaint");

const router = express.Router();

const VALID_CATEGORIES = ["Water", "Electricity", "WiFi", "Other"];
const VALID_STATUSES = ["Pending", "In Progress", "Resolved"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

const ENGLISH_LETTERS_AND_SPACES_REGEX = /^[A-Za-z\s]+$/;
const ROOM_NUMBER_REGEX = /^[0-9]+$/;
const STUDENT_ID_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/;

const uploadDir = path.join(__dirname, "../uploads/complaints");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only png, jpg, jpeg and webp files are allowed"));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
});

function buildImageUrl(req) {
  if (!req.file) return "";
  return `/uploads/complaints/${req.file.filename}`;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function validateImage(file) {
  if (!file) return null;

  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return "Only JPG, JPEG, PNG, and WEBP images are allowed";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must be less than 3MB";
  }

  return null;
}

function generateComplaintId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CMP-${random}`;
}

function basePriorityFromCategory(category) {
  if (category === "Water" || category === "Electricity") return "High";
  if (category === "WiFi") return "Medium";
  return "Low";
}

function increasePriorityOneLevel(priority) {
  if (priority === "Low") return "Medium";
  if (priority === "Medium") return "High";
  return "High";
}

async function calculatePriority(category, hostelOrRoomNo) {
  let priority = basePriorityFromCategory(category);

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const duplicates = await Complaint.countDocuments({
    category,
    hostelOrRoomNo,
    createdAt: { $gte: twentyFourHoursAgo },
  });

  if (duplicates >= 1) {
    priority = increasePriorityOneLevel(priority);
  }

  return priority;
}

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const studentName = normalizeText(req.body.studentName);
    const studentId = normalizeText(req.body.studentId);
    const category = normalizeText(req.body.category);
    const block = normalizeText(req.body.block);
    const roomNo = normalizeText(req.body.roomNo);
    const description = normalizeText(req.body.description);
    const hostelOrRoomNo = normalizeText(req.body.hostelOrRoomNo) || `${block} - Room ${roomNo}`;

    const imageError = validateImage(req.file);
    if (imageError) return res.status(400).json({ message: imageError });

    if (!studentName) return res.status(400).json({ message: "Student name is required." });
    if (studentName.length < 5 || studentName.length > 20) {
      return res.status(400).json({ message: "Student name must be between 5 and 20 characters." });
    }
    if (!ENGLISH_LETTERS_AND_SPACES_REGEX.test(studentName)) {
      return res.status(400).json({ message: "Student name must contain English letters and spaces only." });
    }

    if (!studentId) return res.status(400).json({ message: "Student ID is required." });
    if (studentId.length < 3 || studentId.length > 20) {
      return res.status(400).json({ message: "Student ID must be between 3 and 20 characters." });
    }
    if (!STUDENT_ID_REGEX.test(studentId)) {
      return res.status(400).json({ message: "Student ID must include both English letters and numbers." });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Please select a valid complaint category." });
    }

    if (!block) return res.status(400).json({ message: "Block or hostel name is required." });
    if (block.length < 2 || block.length > 50) {
      return res.status(400).json({ message: "Block or hostel name must be between 2 and 50 characters." });
    }
    if (!ENGLISH_LETTERS_AND_SPACES_REGEX.test(block)) {
      return res.status(400).json({ message: "Block or hostel name must contain English letters and spaces only." });
    }

    if (!roomNo) return res.status(400).json({ message: "Room number is required." });
    if (roomNo.length < 1 || roomNo.length > 20) {
      return res.status(400).json({ message: "Room number must be between 1 and 20 digits." });
    }
    if (!ROOM_NUMBER_REGEX.test(roomNo)) {
      return res.status(400).json({ message: "Room number must contain numbers only." });
    }

    if (!description) {
      return res.status(400).json({ message: "Please enter a complaint description." });
    }
    if (description.length < 15) {
      return res.status(400).json({ message: "Description must be at least 15 characters long." });
    }
    if (description.length > 500) {
      return res.status(400).json({ message: "Description must not exceed 500 characters." });
    }

    let complaintId = generateComplaintId();
    while (await Complaint.exists({ complaintId })) {
      complaintId = generateComplaintId();
    }

    const priority = await calculatePriority(category, hostelOrRoomNo);

    const complaint = await Complaint.create({
      complaintId,
      studentName,
      studentId,
      category,
      block,
      roomNo,
      description,
      hostelOrRoomNo,
      imageUrl: buildImageUrl(req),
      status: "Pending",
      priority,
      assignedTo: "",
      internalNotes: "",
      statusHistory: [{ status: "Pending", time: new Date() }],
    });

    res.status(201).json({
      success: true,
      message: `Complaint submitted successfully. Your complaint ID is ${complaint.complaintId}.`,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/mine", async (req, res, next) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const imageError = validateImage(req.file);
    if (imageError) return res.status(400).json({ message: imageError });

    const nextStatus = req.body.status ? normalizeText(req.body.status) : complaint.status;
    const internalNotes = req.body.internalNotes !== undefined ? normalizeText(req.body.internalNotes) : complaint.internalNotes;
    const assignedTo = req.body.assignedTo !== undefined ? normalizeText(req.body.assignedTo) : complaint.assignedTo;

    if (!VALID_STATUSES.includes(nextStatus)) {
      return res.status(400).json({ message: "Status must be Pending, In Progress or Resolved." });
    }
    if (internalNotes && internalNotes.length > 1500) {
      return res.status(400).json({ message: "Internal notes cannot exceed 1500 characters." });
    }

    if (nextStatus !== complaint.status) {
      complaint.statusHistory.push({ status: nextStatus, time: new Date() });
    }

    complaint.status = nextStatus;
    complaint.internalNotes = internalNotes;
    complaint.assignedTo = assignedTo || "";
    complaint.resolvedAt = nextStatus === "Resolved" ? (complaint.resolvedAt || new Date()) : null;

    if (req.file) complaint.imageUrl = buildImageUrl(req);

    await complaint.save();

    res.json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/cancel", async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (complaint.status !== "Pending") {
      return res.status(400).json({ message: "Only pending complaints can be cancelled." });
    }

    await complaint.deleteOne();
    res.json({ success: true, message: "Complaint cancelled successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    await complaint.deleteOne();
    res.json({ success: true, message: "Complaint deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
