const express = require("express");
const {
  confirmStripeCheckout,
  createPayment,
  createStripeCheckoutSession,
  deletePayment,
  getPayments,
  processMockFeePayment,
  processMockRoomPayment,
  verifyPayment,
} = require("../Controlers/paymentController.js");
const { adminOnly, protect } = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get('/', protect, getPayments);
router.post('/', protect, createPayment);
router.post('/mock-room-payment', protect, processMockRoomPayment);
router.post('/mock-fee-payment', protect, processMockFeePayment);
router.post('/checkout-session', protect, createStripeCheckoutSession);
router.post('/checkout-session/:sessionId/confirm', protect, confirmStripeCheckout);
router.patch('/:id/status', protect, adminOnly, verifyPayment);
router.delete('/:id', protect, adminOnly, deletePayment);

module.exports = router;
