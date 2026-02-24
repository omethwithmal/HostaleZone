// routes/roomDetailsRoutes.js
const express = require("express");
const router = express.Router();
const RoomDetails = require("../models/roomdetail");


// =============================
// Add New Room
// =============================
router.post("/add", async (req, res) => {
    try {
        const newRoom = new RoomDetails(req.body);
        await newRoom.save();

        res.json({
            message: "Room added successfully",
            roomId: newRoom.roomId
        });

    } catch (err) {
        res.status(500).json({
            error: "Failed to add room",
            details: err.message
        });
    }
});


// =============================
// Get All Rooms
// =============================
router.get("/display", async (req, res) => {
    try {
        const rooms = await RoomDetails.find().sort({ createdAt: -1 });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch rooms",
            details: err.message
        });
    }
});


// =============================
// Get Single Room by Mongo ID
// =============================
router.get("/view/:id", async (req, res) => {
    try {
        const room = await RoomDetails.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        res.json(room);
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch room",
            details: err.message
        });
    }
});


// =============================
// Get Room by roomId (RM-XXXXXX)
// =============================
router.get("/view/room/:roomId", async (req, res) => {
    try {
        const room = await RoomDetails.findOne({
            roomId: req.params.roomId
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json(room);

    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch room",
            details: err.message
        });
    }
});


// =============================
// Update Room (Full Update)
// =============================
router.put("/update/:id", async (req, res) => {
    try {

        const updatedRoom = await RoomDetails.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json({
            message: "Room updated successfully",
            room: updatedRoom
        });

    } catch (err) {
        res.status(500).json({
            error: "Failed to update room",
            details: err.message
        });
    }
});


// =============================
// Update Room Status Only
// =============================
router.put("/update/status/:id", async (req, res) => {
    const { status } = req.body;

    const validStatuses = ['available', 'occupied', 'maintenance', 'unavailable'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const room = await RoomDetails.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        room.status = status;
        await room.save();

        res.json({
            message: "Room status updated successfully",
            room
        });

    } catch (err) {
        res.status(500).json({
            error: "Failed to update status",
            details: err.message
        });
    }
});


// =============================
// Delete Room
// =============================
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedRoom = await RoomDetails.findByIdAndDelete(req.params.id);

        if (!deletedRoom) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json({ message: "Room deleted successfully" });

    } catch (err) {
        res.status(500).json({
            error: "Failed to delete room",
            details: err.message
        });
    }
});


// =============================
// Get Room Statistics
// =============================
router.get("/stats", async (req, res) => {
    try {

        const total = await RoomDetails.countDocuments();
        const available = await RoomDetails.countDocuments({ status: 'available' });
        const occupied = await RoomDetails.countDocuments({ status: 'occupied' });
        const maintenance = await RoomDetails.countDocuments({ status: 'maintenance' });
        const unavailable = await RoomDetails.countDocuments({ status: 'unavailable' });

        res.json({
            total,
            available,
            occupied,
            maintenance,
            unavailable
        });

    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch statistics",
            details: err.message
        });
    }
});


// =============================
// Search Rooms
// =============================
router.get("/search", async (req, res) => {

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {

        const rooms = await RoomDetails.find({
            $or: [
                { roomNumber: { $regex: query, $options: 'i' } },
                { roomType: { $regex: query, $options: 'i' } },
                { status: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.json(rooms);

    } catch (err) {
        res.status(500).json({
            error: "Failed to search rooms",
            details: err.message
        });
    }
});


module.exports = router;