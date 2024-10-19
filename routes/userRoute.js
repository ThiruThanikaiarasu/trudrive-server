const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { signup, login } = require('../controllers/authController')
const { verifyUser } = require('../middleware/verify')
const { authenticateUser } = require('../controllers/userController')

// Signup route
router.post(
    '/signup', 
    
    signup
)

// Login route
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