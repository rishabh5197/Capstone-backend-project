
const mongoose = require('mongoose')


const patients = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phoneno: { type: Number, required: true, length: 15 },
  address: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date().valueOf() },
  // userlists: { type: Array, required: true, default: [] },
});

module.exports = mongoose.model("Patients", patients);
