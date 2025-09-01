const express = require("express")
const router = express.Router()
const { FollowRequest } = require("../Models/FollowRequests")
const { User } = require("../Models/User")
const { isLoggedIn } = require("../Middlewares/IsLoggedIn")



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
        if (foundUser.blocked.some(id => id.equals(req.user._id))) {
            throw new Error("Invalid Operation");
        }

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


router.patch("/follow-requests/block/:userId", isLoggedIn, async (req, res) => {
    try {
        const { userId } = req.params
        if (req.user.blocked.some(id => id.toString() === userId)) {
            throw new Error("User already blocked");
        }

        const foundUser = await User.findById(userId)
        if (foundUser.blocked.some(id => id.toString() === req.user._id.toString())) {
            throw new Error("Invalid Operation");
        }

        req.user.blocked.push(foundUser._id)

        //blocked user
        const filteredFollowers = foundUser.followers.filter((item) => {
            return item.toString() != req.user._id.toString()
        })
        foundUser.followers = filteredFollowers

        const filteredFollowing = foundUser.following.filter((item) => {
            return item.toString() != req.user._id.toString()

        })
        foundUser.following = filteredFollowing

        await foundUser.save()

        //blocker
        const filteredFollowers2 = req.user.followers.filter((item) => {
            return item.toString() != userId

        })
        req.user.followers = filteredFollowers2

        const filteredFollowing2 = req.user.following.filter((item) => {
            return item.toString() != userId

        })
        req.user.following = filteredFollowing2
        await req.user.save()

        await FollowRequest.deleteOne({
            $or: [
                {
                    $and: [
                        { fromUserId: userId },
                        { toUserId: req.user._id }
                    ]
                },
                {
                    $and: [
                        { fromUserId: req.user._id },
                        { toUserId: userId }
                    ]
                }
            ]
        })

        res.status(200).json({ msg: `User ${foundUser.username} blocked!` })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})




router.patch("/follow-requests/unblock/:userId", isLoggedIn, async (req, res) => {
    try {
        const { userId } = req.params
        const filteredBlockedUsers = req.user.blocked.filter(
            (item) => item.toString() !== userId
        );
        req.user.blocked = filteredBlockedUsers
        req.user.save()
        res.status(200).json({ msg: "done" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})




router.patch("/follow-requests/unfollow/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const foundUser = await User.findById(id)
        if (!foundUser) {
            throw new Error("User not found")
        }

        if (foundUser.followers.some((item) => {
            return item.toString() == req.user._id.toString()
        })) {
            const filteredFollowers = foundUser.followers.filter((item) => {
                return item.toString() != req.user._id.toString()
            })
            foundUser.followers = filteredFollowers
            foundUser.save()

            const filteredFollowing = req.user.following.filter((item) => {
                return item.toString() != foundUser._id.toString()
            })
            req.user.following = filteredFollowing
            req.user.save()

            await FollowRequest.deleteOne({
                $or: [
                    {
                        $and: [
                            { fromUserId: id },
                            { toUserId: req.user._id }
                        ]
                    },
                    {
                        $and: [
                            { fromUserId: req.user._id },
                            { toUserId: id }
                        ]
                    }
                ]
            })

        }
        else {
            throw new Error("Invalid Operation")
        }

        res.status(200).json({ msg: "done" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})




module.exports = {
    FollowReqRouter: router
}