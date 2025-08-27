require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const { otpRoutes } = require("./Routes/OtpRoutes")
const { AuthRouter } = require("./Routes/AuthRoutes")
const cookieParser = require("cookie-parser")


app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/api", otpRoutes)
app.use("/api", AuthRouter)


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DATA BASE CONNECT SUCCCESFUL")
    app.listen(process.env.PORT, () => console.log("SERVER CONNECTED " + process.env.PORT))

}).catch((error) => {
    console.log("DB connection fail " + error.message)
})


