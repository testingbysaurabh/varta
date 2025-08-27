const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { VerifiedMail } = require("../Models/verifiedMail");
const { OTP } = require("../Models/OTP");
const { otpLimiter } = require("../Middlewares/OtpMiddleware")





const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.APP_PASSWORD,
    },
});

function generateOTP() {
    const opt = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
    return opt;
}





////sending otp
router.post("/otp/send-otp", otpLimiter, async (req, res) => {
    try {
        const { mail } = req.body;
        if (!mail) {
            return res.status(400).json({ error: "Mail is required" });
        }

        const foundUser = await VerifiedMail.findOne({ mail });
        if (foundUser) {
            return res.status(400).json({ error: "Mail Already Verified" });
        }

        const otp = generateOTP();
        await OTP.create({ mail: mail, otp, createdAt: Date.now() });

        await transporter.sendMail({
            from: '"Varta" <testingbysaurabh@gmail.com>',
            to: mail,
            subject: "Your OTP Code",
            html: `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <meta charset="UTF-8">
                                    <title>Your Varta OTP Code</title>
                                    <style>
                                        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
                                        .container { max-width: 400px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px 24px; text-align: center; }
                                        .logo { font-size: 2rem; color: #1976d2; font-weight: bold; margin-bottom: 16px; letter-spacing: 2px; }
                                        .otp { font-size: 2.2rem; font-weight: bold; color: #1976d2; background: #e3f2fd; border-radius: 6px; padding: 12px 0; margin: 24px 0; letter-spacing: 8px; }
                                        .info { color: #555; font-size: 1rem; margin-bottom: 16px; }
                                        .footer { font-size: 0.9rem; color: #aaa; margin-top: 24px; }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="logo">Varta</div>
                                        <div class="info">Your One-Time Password (OTP) for Varta login/verification:</div>
                                        <div class="otp">${otp}</div>
                                        <div class="info">Please enter this code to continue. This OTP is valid for 2 minutes.</div>
                                        <div class="footer">If you did not request this, please ignore this email.<br>© 2025 Varta</div>
                                    </div>
                                </body>
                                </html>
                        `,
        });
        res.status(201).json({ msg: "Otp send" });

    } catch (error) {
        res.status(500).json({ error: "Failed to generate OTP. " + error.message });
    }
});






router.post("/otp/verify-otp", async (req, res) => {
    try {
        const { mail, otp } = req.body

        const foundUser = await VerifiedMail.findOne({ mail: mail })
        if (foundUser) {
            throw new Error("Mail Already Verified")
        }

        const foundOtp = await OTP.findOne({
            $and: [
                { mail: mail },
                { otp: otp }
            ]
        })
        if (!foundOtp) {
            throw new Error("Verification Failed")
        }

        await VerifiedMail.create({ mail: mail })
        res.status(201).json({ msg: "Verification done" })

    } catch (error) {
        res.status(400).json({ error: "/otp/verify-otp : " + error.message })
    }
})


module.exports = {
    otpRoutes: router,
};
