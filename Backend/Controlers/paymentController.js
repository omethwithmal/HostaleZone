const Stripe = require("stripe");
const Fee = require("../Model/Fee.js");
const Payment = require("../Model/Payment.js");
const { notifyRoleUsers, notifyUser } = require("../services/notificationService.js");
const {
  hasLengthBetween,
  normalizeText,
} = require("../utils/validation.js");

let stripeClient;

const getStripeClient = () => {
  if (stripeClient) {
    return stripeClient;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
};

const serializePayment = (payment) => ({
  id: payment._id,
  feeId: String(payment.feeId),
  studentId: String(payment.studentId),
  studentName: payment.studentName,
  feeName: payment.feeName,
  amount: payment.amount,
  date: payment.date,
  status: payment.status,
  paymentMethod: payment.paymentMethod,
  referenceNumber: payment.referenceNumber,
  proofImageUrl: payment.proofImageUrl,
  rejectReason: payment.rejectReason || '',
  createdAt: payment.createdAt,
  updatedAt: payment.updatedAt,
});

const createApprovedStripePayment = async ({ session, fee, user }) => {
  const existingPayment = await Payment.findOne({
    stripeCheckoutSessionId: session.id,
  });

  if (existingPayment) {
    return existingPayment;
  }

  const payment = await Payment.create({
    feeId: fee._id,
    studentId: user._id,
    studentName: user.name,
    feeName: fee.title,
    amount: fee.amount,
    status: 'approved',
    paymentMethod: 'stripe',
    referenceNumber: session.payment_intent || session.id,
    proofImageUrl: '',
    stripeCheckoutSessionId: session.id,
  });

  fee.status = 'paid';
  await fee.save();

  await notifyUser({
    recipientId: user._id,
    title: 'Stripe payment successful',
    message: `Your payment for ${fee.title} was completed successfully.`,
    type: 'payment',
    link: '/student/history',
  });

  return payment;
};

exports.getPayments = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { studentId: req.user._id };
  const payments = await Payment.find(filter).sort({ createdAt: -1 });

  res.json({ payments: payments.map(serializePayment) });
};

exports.createPayment = async (req, res) => {
  const { feeId, referenceNumber, proofImageUrl } = req.body;
  const normalizedReferenceNumber = normalizeText(referenceNumber);

  if (!feeId || !referenceNumber || !proofImageUrl) {
    return res.status(400).json({
      message: 'Fee, reference number, and payment proof are required',
    });
  }

  if (!hasLengthBetween(normalizedReferenceNumber, 3, 80)) {
    return res.status(400).json({
      message: 'Reference number must be between 3 and 80 characters',
    });
  }

  if (typeof proofImageUrl !== 'string' || proofImageUrl.length < 50) {
    return res.status(400).json({
      message: 'Payment proof is invalid or too short',
    });
  }

  const fee = await Fee.findById(feeId);
  if (!fee) {
    return res.status(404).json({ message: 'Fee not found' });
  }

  if (fee.status === 'paid') {
    return res.status(400).json({ message: 'This fee is already paid' });
  }

  const payment = await Payment.create({
    feeId: fee._id,
    studentId: req.user._id,
    studentName: req.user.name,
    feeName: fee.title,
    amount: fee.amount,
    paymentMethod: 'bank_slip',
    referenceNumber: normalizedReferenceNumber,
    proofImageUrl,
    stripeCheckoutSessionId: undefined,
  });

  fee.status = 'pending';
  await fee.save();

  await Promise.all([
    notifyUser({
      recipientId: req.user._id,
      title: 'Payment submitted',
      message: `Your bank slip for ${fee.title} is pending admin verification.`,
      type: 'payment',
      link: '/student/history',
    }),
    notifyRoleUsers('admin', {
      title: 'New payment requires review',
      message: `${req.user.name} submitted a bank slip for ${fee.title}.`,
      type: 'payment',
      link: '/admin/verifications',
    }),
  ]);

  res.status(201).json({ payment: serializePayment(payment) });
};

exports.createStripeCheckoutSession = async (req, res) => {
  const stripe = getStripeClient();
  const { feeId } = req.body;

  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can start payments' });
  }

  if (!feeId) {
    return res.status(400).json({ message: 'Fee is required' });
  }

  const fee = await Fee.findById(feeId);
  if (!fee) {
    return res.status(404).json({ message: 'Fee not found' });
  }

  if (fee.status === 'paid') {
    return res.status(400).json({ message: 'This fee is already paid' });
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${clientUrl}/student/history?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/student/submit-payment?checkout=cancel`,
    line_items: [
      {
        price_data: {
          currency: 'lkr',
          product_data: {
            name: fee.title,
          },
          unit_amount: Math.round(fee.amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      feeId: String(fee._id),
      studentId: String(req.user._id),
    },
  });

  res.json({ url: session.url });
};

exports.confirmStripeCheckout = async (req, res) => {
  const stripe = getStripeClient();
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.status(400).json({ message: 'Session id is required' });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    return res.status(400).json({ message: 'Stripe payment is not completed' });
  }

  if (session.metadata?.studentId !== String(req.user._id)) {
    return res.status(403).json({ message: 'This checkout session does not belong to you' });
  }

  const fee = await Fee.findById(session.metadata?.feeId);
  if (!fee) {
    return res.status(404).json({ message: 'Fee not found for this session' });
  }

  const payment = await createApprovedStripePayment({
    session,
    fee,
    user: req.user,
  });

  res.json({ payment: serializePayment(payment) });
};

exports.verifyPayment = async (req, res) => {
  const { status, reason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid payment status' });
  }

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  payment.status = status;
  payment.rejectReason = status === 'rejected' ? reason || '' : '';
  await payment.save();

  const fee = await Fee.findById(payment.feeId);
  if (fee) {
    fee.status = status === 'approved' ? 'paid' : 'overdue';
    await fee.save();
  }

  await notifyUser({
    recipientId: payment.studentId,
    title:
      status === 'approved' ? 'Payment approved' : 'Payment rejected',
    message:
      status === 'approved'
        ? `Your payment for ${payment.feeName} has been approved.`
        : `Your payment for ${payment.feeName} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
    type: 'payment',
    link: '/student/history',
  });

  res.json({ payment: serializePayment(payment) });
};

exports.deletePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  const fee = await Fee.findById(payment.feeId);

  await payment.deleteOne();

  if (fee) {
    const relatedPayments = await Payment.find({ feeId: fee._id });
    const hasApprovedPayment = relatedPayments.some(
      (relatedPayment) => relatedPayment.status === 'approved'
    );
    const hasPendingPayment = relatedPayments.some(
      (relatedPayment) => relatedPayment.status === 'pending'
    );

    fee.status = hasApprovedPayment
      ? 'paid'
      : hasPendingPayment
        ? 'pending'
        : 'overdue';

    await fee.save();
  }

  res.json({
    message: 'Payment entry deleted',
    feeId: fee ? String(fee._id) : null,
    feeStatus: fee ? fee.status : null,
  });
};

exports.processMockFeePayment = async (req, res) => {
  const user = req.user;
  const { feeId } = req.body;

  try {
    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    if (fee.status === 'paid') return res.status(400).json({ message: 'Fee is already paid' });

    fee.status = 'paid';
    await fee.save();

    const payment = await Payment.create({
      feeId: fee._id,
      studentId: user._id,
      studentName: user.name,
      feeName: fee.title,
      amount: fee.amount,
      status: 'approved',
      paymentMethod: 'stripe',
      referenceNumber: `MOCK-${Math.floor(Math.random() * 100000)}`,
      proofImageUrl: '',
      stripeCheckoutSessionId: `mock_session_${Date.now()}`,
    });

    await notifyUser({
      recipientId: user._id,
      title: 'Payment successful',
      message: `Your payment of LKR ${fee.amount} for ${fee.title} was completed successfully via Secure Gateway.`,
      type: 'payment',
      link: '/student/history',
    });

    res.status(200).json({
      message: 'Payment processed successfully',
      payment: serializePayment(payment),
    });
  } catch (error) {
    res.status(500).json({ message: 'Mock payment failed' });
  }
};

exports.processMockRoomPayment = async (req, res) => {
  const user = req.user;
  
  try {
    const fee = await Fee.create({
      title: 'Room Booking Fee',
      amount: 20000,
      dueDate: new Date(),
      status: 'paid',
      studentId: user._id,
      createdBy: user._id,
    });

    const payment = await Payment.create({
      feeId: fee._id,
      studentId: user._id,
      studentName: user.name,
      feeName: fee.title,
      amount: fee.amount,
      status: 'approved',
      paymentMethod: 'stripe',
      referenceNumber: `MOCK-${Math.floor(Math.random() * 100000)}`,
      proofImageUrl: '',
      stripeCheckoutSessionId: `mock_session_${Date.now()}`,
    });

    await notifyUser({
      recipientId: user._id,
      title: 'Room payment successful',
      message: `Your payment of LKR 20,000 for Room Booking was completed successfully via Secure Gateway.`,
      type: 'payment',
      link: '/student/history',
    });

    res.status(200).json({
      message: 'Payment processed successfully',
      payment: serializePayment(payment),
    });
  } catch (error) {
    res.status(500).json({ message: 'Mock payment failed' });
  }
};
