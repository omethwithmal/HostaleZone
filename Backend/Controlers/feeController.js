const Fee = require("../Model/Fee.js");
const { notifyRoleUsers } = require("../services/notificationService.js");
const {
  hasLengthBetween,
  isNonNegativeNumber,
  isPositiveNumber,
  isValidDateInput,
  normalizeText,
} = require("../utils/validation.js");

const validCategories = ['hostel_fee', 'room_flow', 'utilities', 'late_payment'];
const validBillingCycles = ['monthly', 'annual', 'one_time'];

const serializeFee = (fee) => ({
  id: fee._id,
  title: fee.title,
  category: fee.category,
  billingCycle: fee.billingCycle,
  roomFlowBasis: fee.roomFlowBasis,
  utilityType: fee.utilityType,
  description: fee.description,
  amount: fee.amount,
  lateFeeAmount: fee.lateFeeAmount,
  dueDate: fee.dueDate,
  status: fee.status,
  createdAt: fee.createdAt,
  updatedAt: fee.updatedAt,
});

exports.getFees = async (_req, res) => {
  const fees = await Fee.find().sort({ createdAt: -1 });
  res.json({ fees: fees.map(serializeFee) });
};

exports.createFee = async (req, res) => {
  const {
    title,
    category,
    billingCycle,
    roomFlowBasis,
    utilityType,
    description,
    amount,
    lateFeeAmount,
    dueDate,
  } = req.body;

  if (!title || !category || amount === undefined || !dueDate) {
    return res.status(400).json({ message: 'Title, category, amount, and due date are required' });
  }

  const normalizedTitle = normalizeText(title);
  const normalizedRoomFlowBasis = normalizeText(roomFlowBasis);
  const normalizedUtilityType = normalizeText(utilityType);
  const normalizedDescription = normalizeText(description);

  if (!hasLengthBetween(normalizedTitle, 3, 120)) {
    return res.status(400).json({ message: 'Fee title must be between 3 and 120 characters' });
  }

  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid fee category' });
  }

  if ((billingCycle || 'one_time') && !validBillingCycles.includes(billingCycle || 'one_time')) {
    return res.status(400).json({ message: 'Invalid billing cycle' });
  }

  if (!isPositiveNumber(amount)) {
    return res.status(400).json({ message: 'Amount must be greater than 0' });
  }

  if (!isNonNegativeNumber(lateFeeAmount || 0)) {
    return res.status(400).json({ message: 'Late fee amount cannot be negative' });
  }

  if (!isValidDateInput(dueDate)) {
    return res.status(400).json({ message: 'Please provide a valid due date' });
  }

  if (category === 'room_flow' && !hasLengthBetween(normalizedRoomFlowBasis, 3, 120)) {
    return res.status(400).json({ message: 'Room-flow basis must be between 3 and 120 characters' });
  }

  if (category === 'utilities' && !hasLengthBetween(normalizedUtilityType, 3, 80)) {
    return res.status(400).json({ message: 'Utility type must be between 3 and 80 characters' });
  }

  if (normalizedDescription && !hasLengthBetween(normalizedDescription, 5, 500)) {
    return res.status(400).json({ message: 'Description must be between 5 and 500 characters' });
  }

  const fee = await Fee.create({
    title: normalizedTitle,
    category,
    billingCycle: billingCycle || 'one_time',
    roomFlowBasis: normalizedRoomFlowBasis,
    utilityType: normalizedUtilityType,
    description: normalizedDescription,
    amount: Number(amount),
    lateFeeAmount: lateFeeAmount || 0,
    dueDate,
    status: 'overdue',
    createdBy: req.user._id,
  });

  await notifyRoleUsers('student', {
    title: 'New fee published',
    message: `${fee.title} has been added with a due date of ${new Date(
      fee.dueDate
    ).toLocaleDateString()}.`,
    type: 'fee',
    link: '/student/dashboard',
  });

  res.status(201).json({ fee: serializeFee(fee) });
};

exports.updateFee = async (req, res) => {
  const {
    title,
    category,
    billingCycle,
    roomFlowBasis,
    utilityType,
    description,
    amount,
    lateFeeAmount,
    dueDate,
    status,
  } = req.body;

  const fee = await Fee.findById(req.params.id);
  if (!fee) {
    return res.status(404).json({ message: 'Fee not found' });
  }

  if (title !== undefined) {
    const normalizedTitle = normalizeText(title);
    if (!hasLengthBetween(normalizedTitle, 3, 120)) {
      return res.status(400).json({ message: 'Fee title must be between 3 and 120 characters' });
    }
    fee.title = normalizedTitle;
  }

  if (category !== undefined) {
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid fee category' });
    }
    fee.category = category;
  }

  if (billingCycle !== undefined) {
    if (!validBillingCycles.includes(billingCycle)) {
      return res.status(400).json({ message: 'Invalid billing cycle' });
    }
    fee.billingCycle = billingCycle;
  }

  if (roomFlowBasis !== undefined) {
    const normalizedRoomFlowBasis = normalizeText(roomFlowBasis);
    if (normalizedRoomFlowBasis && !hasLengthBetween(normalizedRoomFlowBasis, 3, 120)) {
      return res.status(400).json({ message: 'Room-flow basis must be between 3 and 120 characters' });
    }
    fee.roomFlowBasis = normalizedRoomFlowBasis;
  }

  if (utilityType !== undefined) {
    const normalizedUtilityType = normalizeText(utilityType);
    if (normalizedUtilityType && !hasLengthBetween(normalizedUtilityType, 3, 80)) {
      return res.status(400).json({ message: 'Utility type must be between 3 and 80 characters' });
    }
    fee.utilityType = normalizedUtilityType;
  }

  if (description !== undefined) {
    const normalizedDescription = normalizeText(description);
    if (normalizedDescription && !hasLengthBetween(normalizedDescription, 5, 500)) {
      return res.status(400).json({ message: 'Description must be between 5 and 500 characters' });
    }
    fee.description = normalizedDescription;
  }

  if (amount !== undefined) {
    if (!isPositiveNumber(amount)) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    fee.amount = Number(amount);
  }

  if (lateFeeAmount !== undefined) {
    if (!isNonNegativeNumber(lateFeeAmount)) {
      return res.status(400).json({ message: 'Late fee amount cannot be negative' });
    }
    fee.lateFeeAmount = Number(lateFeeAmount);
  }

  if (dueDate !== undefined) {
    if (!isValidDateInput(dueDate)) {
      return res.status(400).json({ message: 'Please provide a valid due date' });
    }
    fee.dueDate = dueDate;
  }

  if (status !== undefined) {
    fee.status = status;
  }

  await fee.save();

  res.json({ fee: serializeFee(fee) });
};

exports.deleteFee = async (req, res) => {
  const fee = await Fee.findById(req.params.id);
  if (!fee) {
    return res.status(404).json({ message: 'Fee not found' });
  }

  await fee.deleteOne();
  res.json({ message: 'Fee deleted' });
};
