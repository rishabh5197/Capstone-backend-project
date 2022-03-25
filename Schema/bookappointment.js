const mongoose = require("mongoose");

const bookappointment = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  symptoms: { type: String },
  date: { type: String },
  time: { type: String },
  doctor: { type: String },
});

module.exports = mongoose.model("Bookappointment", bookappointment);
