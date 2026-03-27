const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./Model/StudentModel");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const students = await Student.find({}).limit(5);
    console.log("Found students:", students.map(s => ({ email: s.email, password: s.password, isActive: s.isActive })));
    mongoose.disconnect();
  });
