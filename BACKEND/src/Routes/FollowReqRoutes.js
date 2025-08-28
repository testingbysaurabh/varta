const express = require("express")
const router = express.Router()
const { FollowRequest } = require("../Models/FollowRequests")
const { User } = require("../Models/User")
const { isLoggedIn } = require("../Middlewares/isLoggedin")



router.post("/follow-requests/:toUserId", isLoggedIn, async (req, res) => {
    try {
        const { toUserId } = req.params
        if (toUserId == req.user._id) {
            throw new Error("Invalid Operation")
        }

        const foundreq = await FollowRequest.findOne({ fromUserId: req.user._id, toUserId })

        if (foundreq) {
            if (foundreq.status == "pending") {
                throw new Error("Request already exists")
            }
            else if (foundreq.status == "accepted") {
                throw new Error("Already following the user");
            }
        }

        const foundUser = await User.findOne({ _id: toUserId })
        if (!foundUser) {
            throw new Error("User does not exists")
        }

        if (foundUser.isPrivate) {
            await FollowRequest.create({ toUserId, fromUserId: req.user._id, status: "pending" })
            res.status(201).json({ msg: `Request sent to user ${foundUser.username}` })
        }
        else {
            await FollowRequest.create({ toUserId, fromUserId: req.user._id, status: "accepted" })
            foundUser.followers.push(req.user._id)
            foundUser.save()
            req.user.following.push(toUserId)
            req.user.save()
            res.status(201).json({ msg: `Now Following, ${foundUser.username}` })
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


router.patch("/follow-requests/review/:id/:status", isLoggedIn, async (req, res) => {
    try {
        const { id, status } = req.params

        const foundReq = await FollowRequest.findOne({ _id: id, toUserId: req.user._id })
        if (!foundReq) {
            throw new Error("Request doesn't exist / Invalid Operation")
        }
        if (foundReq.status != "pending") {
            throw new Error("Invalid Operation")
        }
        if (status == "rejected") {
            await FollowRequest.deleteOne({ _id: id })
            res.status(200).json({ msg: "done" })
        }
        if (status != "accepted") {
            throw new Error("Invalid Status")
        }

        foundReq.status = status
        foundReq.save()

        req.user.followers.push(foundReq.fromUserId)
        req.user.save()


        // calling sender's data
        const senderData = await User.findById(foundReq.fromUserId)
        senderData.following.push(req.user._id)
        senderData.save()

        res.status(200).json({ msg: "done" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})











module.exports = {
    FollowReqRouter: router
}