const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require('path'); // Load environment variables

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Explicitly allow the frontend origin
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(bodyParser.json());

// Environment variables
const PORT = process.env.PORT || 8070;
const MONGODB_URL = process.env.MONGODB_URL;

// MongoDB connection (FIXED HERE ✅)
mongoose.connect(MONGODB_URL)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err.message));

// Import routes
const roomdetailsRouter = require("./RoomDetailsForm/routes/roomdetails");
app.use("/roomdetails", roomdetailsRouter);

const roomchangeRouter = require("./Roomchangerequest/routes/roomchange");
app.use("/roomchange", roomchangeRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});