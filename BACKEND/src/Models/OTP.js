const mongoose = require("mongoose")
const validator = require("validator")

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    mail: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: function (val) {
                return validator.isEmail(val)
            },
            message: "Please enter a valid email"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120
    }
})

const OTP = mongoose.model("otp", otpSchema)

module.exports = {
    OTP
}