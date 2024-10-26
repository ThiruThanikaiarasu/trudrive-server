const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { createChildDirectory, getFilesAndDirectoriesByParentId, createDirectoryUnderRoot, getFilesAndDirectoriesFromRoot } = require('../controllers/directoryController')


router.post(
    '/root',

    verifyUser,

    createDirectoryUnderRoot
)

// To Create Child Directory 
router.post(
    '/:parentDirectory',

    verifyUser,

    createChildDirectory
)

router.get(
    '/root',

    verifyUser,

    getFilesAndDirectoriesFromRoot
)

router.get(
    '/:parentDirectory',

    verifyUser,

    getFilesAndDirectoriesByParentId
)

module.exports = router