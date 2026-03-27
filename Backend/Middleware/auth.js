const jwt = require('jsonwebtoken');
const Student = require('../Model/StudentModel');


// ================= STUDENT PROTECT =================

const protect = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    token = req.headers.authorization.split(' ')[1];

  }

  if (!token) {

    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });

  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.student = await Student.findById(decoded.id).select('-password');

    if (!req.student) {

      return res.status(401).json({
        success: false,
        message: 'Student not found'
      });

    }

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token invalid or expired.'
    });

  }

};


// ================= ADMIN PROTECT =================

const protectAdmin = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    token = req.headers.authorization.split(' ')[1];

  }

  if (!token) {

    return res.status(401).json({
      success: false,
      message: 'Admin not authorized. No token provided.'
    });

  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin login uses { role, name } from .env (no DB) — accept that as admin
    if (decoded.role === 'admin' && decoded.name) {
      req.admin = { name: decoded.name, role: 'admin' };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Admin not found'
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: 'Admin token invalid or expired.'
    });

  }

};


module.exports = {
  protect,
  protectAdmin,
  requireAuth: protect,
  requireAdmin: protectAdmin
};