const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/IsLoggedIn")
const { Post } = require("../Models/Posts")
const { User } = require("../Models/User")
const { isAuthor } = require("../Middlewares/IsAuthor")

router.post("/posts/create", isLoggedIn, async (req, res) => {
    try {
        const { caption, location, media } = req.body
        if (!media) {
            throw new Error("Posts must contain atleast one media file")
        }
        const newPost = await Post.create({ caption, location, media, author: req.user._id })
        req.user.posts.push(newPost._id)
        await req.user.save()
        res.status(201).json({ msg: "done", data: newPost })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



router.get("/posts", isLoggedIn, async (req, res) => {
    try {
        const allPosts = await Post.find({ author: req.user._id })
        res.status(200).json({ data: allPosts })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



router.get("/posts/:id", isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params
        const foundData = await Post.findOne({
            $and: [
                { _id: id },
                { author: req.user._id }
            ]
        }
        )
        if (!foundData) {
            throw new Error("Invalid Operation")
        }
        res.status(200).json({ data: foundData })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


router.delete("/posts/:id", isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params
        await Post.deleteOne({ _id: id })
        res.status(200).json({ msg: "done" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})


router.patch("/posts/:id", isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params
        const { caption, location } = req.body
        const updatedPost = await Post.findByIdAndUpdate(id, { caption, location }, { returnDocument: "after" })
        if (!updatedPost) {
            throw new Error("Post not found")
        }

        res.status(200).json({ msg: "done", data: updatedPost })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

router.patch("/posts/:id/like", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const foundPost = await Post.findById(id).populate("author")
        if (!foundPost) {
            throw new Error("Post not found")
        }

        if (foundPost.likes.some(id => id.equals(req.user._id))) {
            throw new Error("Post already liked");
        }
        if (foundPost.author.isPrivate) {
            if (foundPost.author.followers.some(id => id.equals(req.user._id))) {
                foundPost.likes.push(req.user._id)
                foundPost.save()
            }
            else {
                throw new Error("Invalid Operation")
            }
        }
        else {
            foundPost.likes.push(req.user._id)
            foundPost.save()
        }

        res.status(200).json({ msg: "done", data: foundPost })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.patch("/posts/:id/unlike", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const foundPost = await Post.findById(id).populate("author")
        if (!foundPost) {
            throw new Error("Post not found")
        }

        if (
            foundPost.author.isPrivate &&
            !foundPost.author.followers.some(id => id.toString() === req.user._id.toString())
        ) {
            throw new Error("Invalid Operation");
        }

        if (foundPost.likes.some(id => id.toString() === req.user._id.toString())) {
            const filteredLikes = foundPost.likes.filter(item =>
                item.toString() !== req.user._id.toString()
            );

            foundPost.likes = filteredLikes;
            await foundPost.save();
        } else {
            throw new Error("Invalid Operation");
        }
        res.status(200).json({ msg: "done", data: foundPost })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



module.exports = {
    PostRouter: router
}