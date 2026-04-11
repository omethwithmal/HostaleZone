const jwt = require("jsonwebtoken");
const User = require("../Model/User.js");
const { getJwtSecret } = require("../config/env.js");

exports.protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    let user = await User.findById(decoded.id).select('-password');
    let isExternalStudent = false;

    if (!user) {
      const Student = require("../Model/StudentModel.js");
      const student = await Student.findById(decoded.id).select('-password');
      if (student) {
        user = {
          _id: student._id,
          name: student.fullName,
          email: student.email,
          role: 'student',
          lastActiveAt: student.updatedAt
        };
        isExternalStudent = true;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.isExternalStudent = isExternalStudent;
    next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};
