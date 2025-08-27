const mongoose = require("mongoose")
const validator = require("validator")


const VerifiedMailSchema =new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        trim: true,
        validate: function (val) {
            const isMailValid = validator.isEmail(val)
            if (!isMailValid) {
                throw new Error("Please enter a valid email");
            }
        }

    }
})

const VerifiedMail = mongoose.model("verified-mail", VerifiedMailSchema)
module.exports = {
    VerifiedMail
}
