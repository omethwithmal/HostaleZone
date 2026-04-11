const Payment = require("../Model/Payment.js");
const User = require("../Model/User.js");

const INACTIVE_DAYS = 30;

const isInactiveUser = (user) => {
  const lastActiveAt = user.lastActiveAt || user.createdAt;
  const daysSinceActivity =
    (Date.now() - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60 * 24);

  return user.role === 'student' && daysSinceActivity >= INACTIVE_DAYS;
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  lastActiveAt: user.lastActiveAt,
  createdAt: user.createdAt,
  isInactive: isInactiveUser(user),
});

exports.getUsers = async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users: users.map(serializeUser) });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (String(user._id) === String(req.user._id)) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }

  await Payment.deleteMany({ studentId: user._id });
  await user.deleteOne();

  res.json({ message: 'User account deleted' });
};
