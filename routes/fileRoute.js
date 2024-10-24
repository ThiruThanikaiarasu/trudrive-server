const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { addNewFilesToCorrespondingDirectory, addNewFilesToRootDirectory } = require('../controllers/fileController')
const upload = require('../middleware/upload')

const multipleUpload = upload.fields([{ name: 'files'}])

router.post(
    '/upload/root',

    verifyUser,

    multipleUpload,

    addNewFilesToRootDirectory
)

router.post(
    '/upload/:parentDirectory',
    
    verifyUser,
    
    multipleUpload,

    addNewFilesToCorrespondingDirectory  
)

module.exports = router