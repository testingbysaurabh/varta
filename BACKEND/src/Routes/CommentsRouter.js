const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/IsLoggedIn")
const { Post } = require("../Models/Posts")
const { Comment } = require("../Models/Comment")


router.post("/comments/:postId", isLoggedIn, async (req, res) => {
    try {
        const { postId } = req.params
        const { text } = req.body
        const foundPost = await Post.findById(postId).populate("author")
        if (!foundPost) {
            throw new Error("Post Not Found")
        }
        if (foundPost.author.isPrivate) {
            if (foundPost.author.followers.some((item) => {
                return item.toString() == req.user._id.toString()
            })) {
                // console.log(foundPost)
                const newComment = await Comment.create({ author: req.user._id, text })
                foundPost.comments.push(newComment._id)
                foundPost.save()
            }
            else {
                throw new Error("Invalid Operation")
            }
        }
        else {
            const newComment = await Comment.create({ author: req.user._id, text })
            foundPost.comments.push(newComment._id)
            foundPost.save()
        }

        res.status(201).json({ msg: "done", data: foundPost })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})




router.post("/comments/:postId/:commentId/like", isLoggedIn, async (req, res) => {
    try {
        const { postId, commentId } = req.params
        const foundPost = await Post.findById(postId)
        const foundComment = await Comment.findById(commentId)

        if (!foundPost || !foundComment) {
            throw new Error("Invalid Operation")
        }

        if (foundComment.likes.some(item => item.toString() == req.user._id.toString())) {
            throw new Error("Cannot like a comment more than once")
        }

        if (foundPost.comments.some((item) => { return item.toString() === commentId.toString() })) {
            if (foundPost.author.isPrivate) {
                if (foundPost.followers.some(item => item.toString() == req.user._id)) {
                    foundComment.likes.push(req.user._id)
                    await foundComment.save()
                }
                else {
                    throw new Error("Invalid Operation / Not following the user")
                }
            }
            else {
                foundComment.likes.push(req.user._id)
                await foundComment.save()
            }
        }
        else {
            throw new Error("Invalid Operation")
        }
        res.status(201).json({ msg: "done" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})






module.exports = {
    CommentRouter: router
}