const router = require("express").Router();

const {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateStudentStatus,
} = require("../Controlers/AdminStudentController");

// Endpoints for AdminDashboard.jsx
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);
router.patch("/students/:id/status", updateStudentStatus);

module.exports = router;