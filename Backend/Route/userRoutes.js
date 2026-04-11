const express = require("express");
const { deleteUser, getUsers } = require("../Controlers/userController.js");
const { adminOnly, protect } = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
