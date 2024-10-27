const express = require('express')
const router = express.Router()

const { signup, login, sendSignupVerificationCode, verifyOtp } = require('../controllers/authController')
const { verifyUser } = require('../middleware/verify')
const { authenticateUser } = require('../controllers/userController')


router.post(
    '/signup', 
    
    signup
)

router.post(
    '/signup/request-verification',

    sendSignupVerificationCode
)

router.post(
    '/signup/otp-verify',

    verifyOtp
)

router.post(
    '/login', 
    
    login
)


router.get(
    '/authenticate',

    verifyUser,

    authenticateUser
)

module.exports = router