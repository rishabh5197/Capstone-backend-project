const mongoose = require("mongoose");


const booktest = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  test: { type: String},
});

module.exports = mongoose.model("Booktest", booktest);
