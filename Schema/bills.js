const mongoose = require("mongoose");

const bills = new mongoose.Schema({
  in: { type: String },
  name: { type: String },
  email: { type: String },
  amount: { type: Number },
});

module.exports = mongoose.model("Bills", bills);
