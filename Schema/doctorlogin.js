const mongoose = require("mongoose");

const doctorlogin = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  specialist: { type: String },
});

module.exports = mongoose.model("Doctorlogin", doctorlogin);
