const express = require("express");
const {
  getCurrentUser,
  loginUser,
  registerUser,
} = require("../Controlers/authController.js");
const { protect } = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);

module.exports = router;
