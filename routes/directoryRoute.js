const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { createChildDirectory, getFilesAndDirectoriesByParentId } = require('../controllers/directoryController')
const { check } = require('express-validator')


// To Create Child Directory 
router.post(
    '/:parentDirectory',

    verifyUser,

    createChildDirectory
)

router.get(
    '/:parentDirectory',

    verifyUser,

    getFilesAndDirectoriesByParentId
)

module.exports = router