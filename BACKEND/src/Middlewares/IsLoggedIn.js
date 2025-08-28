const jwt = require("jsonwebtoken")
const { User } = require("../Models/User")

const isLoggedIn = async (req, res, next) => {
    try {
        const { token } = req.cookies
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const foundUser = await User.findOne({ _id: decodedToken._id })
        if (!foundUser) {
            throw new Error("Please Log In")
        }
        req.user = foundUser
        next()
    } catch (error) {
        res.status(400).json({ error: "Please Log In" })
    }

}


module.exports = {
    isLoggedIn
}