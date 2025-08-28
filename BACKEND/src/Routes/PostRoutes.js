const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/isLoggedin")
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


router.patch("/posts/:id", isLoggedIn, isAuthor, async(req , res) => {
    try {
        const{id} = req.params
        const{caption, location} = req.body
        const updatedPost = await Post.findByIdAndUpdate(id, {caption, location}, {returnDocument:"after"})
        if(!updatedPost)
        {
            throw new Error("Post not found")
        }

        res.status(200).json({msg : "done", data : updatedPost})
    } catch (error) {
        res.status(400).json({msg : error.message})
    }
})
 




module.exports = {
    PostRouter: router
}