const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { signup, login } = require('../controllers/authController')
const { verifyUser } = require('../middleware/verify')
const { authenticateUser } = require('../controllers/userController')

// Signup route
router.post(
    '/signup', 
    
    check('firstName')
        .not()
        .isEmpty()
        .isLength({min: 2})
        .withMessage('Enter a valid First name'),
    check('lastName')
        .not()
        .isEmpty()
        .isLength({min: 1})
        .withMessage('Enter a valid Last name'),
    check('email')
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty()
        .isLength({min: 8})
        .withMessage('Password length is at least 8 character'),
    
    signup
)

// Login route
router.post(
    '/login', 
    
    check('email')
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty()
        .isLength({min: 8})
        .withMessage('Password length is at least 8 character'),
    
    login
)


router.get(
    '/authenticate',

    verifyUser,

    authenticateUser
)

module.exports = router