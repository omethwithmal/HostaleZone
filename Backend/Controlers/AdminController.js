const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required." });
    }

    // UNIQUE admin name check (only allow the one in .env)
    const ADMIN_NAME = process.env.ADMIN_NAME || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (name !== ADMIN_NAME) {
      return res.status(401).json({ message: "Invalid admin name." });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Create token
    const token = jwt.sign(
      { role: "admin", name: ADMIN_NAME },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Admin login success",
      token,
      admin: { name: ADMIN_NAME, role: "admin" },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};