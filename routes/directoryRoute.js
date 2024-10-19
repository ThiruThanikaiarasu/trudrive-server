const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { createChildDirectory } = require('../controllers/directoryController')
const { check } = require('express-validator')


// To Create Child Directory 
router.post(
    '/:parentDirectory',

    verifyUser,

    createChildDirectory
)

module.exports = router