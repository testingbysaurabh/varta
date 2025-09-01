const express = require("express")
const router = express.Router()
const {isLoggedIn} =require("../Middlewares/IsLoggedIn")
const{Post} = require("../Models/Posts")
const{Comment} = require("../Models/Comment") 


router.post("/comments/:postId", isLoggedIn, async(req, res) => {
    try {
        const{postId} = req.params
        const{text} = req.body
        const foundPost = await Post.findById(postId).populate("author")
        if(!foundPost)
        {
            throw new Error("Post Not Found")
        }
        if(foundPost.author.isPrivate)
        {
            if(foundPost.author.followers.some((item) => {
                return item.toString() == req.user._id.toString()
            }))
            {
                // console.log(foundPost)
                const newComment = await Comment.create({author : req.user._id, text })
                foundPost.comments.push(newComment)
                foundPost.save()
            }
            else
            {
                throw new Error("Invalid Operation")
            }
        }
        else
        {
            const newComment = await Comment.create({author : req.user._id, text })
            foundPost.comments.push(newComment)
            foundPost.save()
        }

        res.status(201).json({msg : "done", data : foundPost})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})







module.exports = {
    CommentRouter : router
}