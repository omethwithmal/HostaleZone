const express = require("express");
const router = express.Router();
// NOTE: folder is named "Controlers", so require that path
const { adminLogin } = require("../Controlers/AdminController");

router.post("/login", adminLogin);

module.exports = router;