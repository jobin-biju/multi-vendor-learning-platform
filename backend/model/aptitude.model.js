const mongoose = require("mongoose")

const aptitudeSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userRegister",
            required: true
        },
        score:{
            type: Number,
            required: true
        },
        attempted: {
            type: Number,
            default: false
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }

    }
)
const aptitudeModel = mongoose.model("Aptitude", aptitudeSchema)
module.exports = {aptitudeModel}