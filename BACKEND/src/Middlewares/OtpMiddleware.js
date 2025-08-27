const { rateLimit } = require("express-rate-limit");


const otpLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, /////2 min me ek 
    limit: 1,
    message: { "error": "Too many requests, please try again 2 minutes." }
})


module.exports = {
    otpLimiter
}