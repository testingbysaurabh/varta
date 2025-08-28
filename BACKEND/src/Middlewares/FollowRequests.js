const mongoose = require("mongoose")


const followReqSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["accepted", "rejected", "pending"],
            message: "{VALUE} is not a valid status for follow requests"
        }
    }
})

const FollowRequest = mongoose.model("FollowRequest", followReqSchema)

module.exports = {
    FollowRequest
}