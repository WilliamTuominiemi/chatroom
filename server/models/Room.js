const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Room', roomSchema)
