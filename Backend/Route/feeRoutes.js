const express = require("express");
const {
  createFee,
  deleteFee,
  getFees,
  updateFee,
} = require("../Controlers/feeController.js");
const { adminOnly, protect } = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get('/', protect, getFees);
router.post('/', protect, adminOnly, createFee);
router.put('/:id', protect, adminOnly, updateFee);
router.delete('/:id', protect, adminOnly, deleteFee);

module.exports = router;
