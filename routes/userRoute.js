const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { authenticateUser } = require('../controllers/userController')


router.get(
    '/authenticate',

    verifyUser,

    authenticateUser
)

module.exports = router