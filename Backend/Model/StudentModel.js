const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // ✅ Student ID (for admin search)
    studentId: {
      type: String,
      unique: true,
      default: "",
      trim: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    yearSemester: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    profilePhoto: {
      type: String,
      default: ""
    },

    // ✅ VERY IMPORTANT (Admin Block / Unblock)
    isActive: {
      type: Boolean,
      default: true
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);