const express = require('express')
const router = express.Router()

const { verifyUser } = require('../middleware/verify')
const { addNewFilesToCorrespondingDirectory } = require('../controllers/fileController')
const upload = require('../middleware/upload')

const multipleUpload = upload.fields([{ name: 'files'}])

router.post(
    '/upload/:parentDirectory',
    
    verifyUser,
    
    multipleUpload,
    // upload,

    addNewFilesToCorrespondingDirectory  
)

module.exports = router