// Backend/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const adminStudentRoute = require("./Route/AdminStudentRoute");
const adminRoute = require("./Route/AdminRoute");
const adminLeaveRoute = require("./Route/AdminLeaveRoute");

require("dotenv").config();

const app = express();

// ── Middleware ──
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5175",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/admin", adminRoute);
app.use("/api/admin", adminLeaveRoute);

// ── Static uploads folder (IMPORTANT) ──
// This will serve ALL files inside: Backend/uploads/...
// Example: http://localhost:5000/uploads/Gallery/Block%20A%201.png
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Import Routes ──
const studentRoute = require("./Route/StudentRoute");
const roomRoute = require("./Route/RoomRoute");
const leaveRoute = require("./Route/LeaveRoute");
const notificationRoute = require("./Route/NotificationRoute");
const galleryRoute = require("./Route/GalleryRoute");
const attendanceRoute = require("./Route/attendanceRoutes");

// ── Import Payment Routes (Bagaya Payment) ──
const authPaymentRoutes = require("./Route/authRoutes");
const feeRoutes = require("./Route/feeRoutes");
const paymentRoutes = require("./Route/paymentRoutes");
const reportRoutes = require("./Route/reportRoutes");
const userPaymentRoutes = require("./Route/userRoutes");
const notificationPaymentRoutes = require("./Route/notificationRoutes");

// ── Use Routes ──
app.use("/api/student", studentRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/leave", leaveRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/admin", adminStudentRoute);

// ── Use Payment Routes ──
app.use("/api/auth", authPaymentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userPaymentRoutes);
app.use("/api/payment-notifications", notificationPaymentRoutes);

// ── Use Complaint Routes (Hasinika) ──
const complaintRoutes = require("./Route/complaint");
app.use("/api/complaints", complaintRoutes);
// ── Ometh's Routes ──
const roomdetailsRouter = require("./RoomDetailsForm/routes/roomdetails");
const roomchangeRouter = require("./Roomchangerequest/routes/roomchange");
app.use("/roomdetails", roomdetailsRouter);
app.use("/roomchange", roomchangeRouter);

// ── Health check ──
app.get("/", (req, res) => {
  res.json({ message: "3Y2S Hostel Management Server is running ✅" });
});

// ── Connect MongoDB & Start ──
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log("✅ Server running on port", PORT));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
