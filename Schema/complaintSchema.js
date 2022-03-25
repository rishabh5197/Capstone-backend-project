
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    query: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date().valueOf() },
})

module.exports = mongoose.model('complaintlist', userSchema)
