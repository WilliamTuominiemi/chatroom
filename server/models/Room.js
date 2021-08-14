const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
},  {
    timestamps: true,
})

module.exports = mongoose.model('Room', roomSchema)