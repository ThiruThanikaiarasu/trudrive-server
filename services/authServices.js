const moment = require('moment')
const otpModel = require("../models/otpModel")

const MAX_ATTEMPTS = 3

const generateOtp = async (email) => {
    let otpDoc = await otpModel.findOne({ email })

    if (otpDoc) {
        if (otpDoc.attempts < MAX_ATTEMPTS) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const expiresAt = moment().add(1, 'minutes').toDate()

            otpDoc.otp = otp
            otpDoc.expiresAt = expiresAt
            otpDoc.attempts += 1

            await otpDoc.save()

            return otp
        } else {
            throw new Error("Maximum attempts reached. Please try again later.")
        }
    } else {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = moment().add(5, 'minutes').toDate()

        const otpData = {
            email,
            otp,
            expiresAt,
            attempts: 1
        }

        await generateOtpDocument(otpData)

        return otp
    }
}

const generateOtpDocument = async (otpData) => {
    const newOtp = new otpModel(otpData)
    console.log(otpData)
    return await newOtp.save()
}

const getOtpDataByEmail = async (email) => {
    const otpData = await otpModel.findOne({ email })
    if(!otpData) {
        throw new Error("No Verification code was found.")
    }

    return otpData
}

module.exports = {
    generateOtp,
    getOtpDataByEmail
}
