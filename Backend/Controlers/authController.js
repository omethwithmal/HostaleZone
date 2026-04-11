const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/User.js");
const { getJwtSecret } = require("../config/env.js");
const {
  hasLengthBetween,
  isValidEmail,
  normalizeText,
} = require("../utils/validation.js");

const buildToken = (userId) =>
  jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  lastActiveAt: user.lastActiveAt,
});

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedName = normalizeText(name);
  const normalizedEmail = normalizeText(email).toLowerCase();

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!hasLengthBetween(normalizedName, 3, 80)) {
    return res.status(400).json({ message: 'Name must be between 3 and 80 characters' });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (!['student', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    lastActiveAt: new Date(),
  });

  return res.status(201).json({
    token: buildToken(user._id),
    user: sanitizeUser(user),
  });
};

exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = normalizeText(email).toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ message: 'Selected role does not match this account' });
  }

  user.lastActiveAt = new Date();
  await user.save();

  return res.json({
    token: buildToken(user._id),
    user: sanitizeUser(user),
  });
};

exports.getCurrentUser = async (req, res) => {
  if (!req.isExternalStudent) {
    req.user.lastActiveAt = new Date();
    await req.user.save();
  }
  return res.json({ user: sanitizeUser(req.user) });
};
