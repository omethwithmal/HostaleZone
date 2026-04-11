const express = require("express");
const { downloadReport } = require("../Controlers/reportController.js");
const { adminOnly, protect } = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get('/:type', protect, adminOnly, downloadReport);

module.exports = router;
