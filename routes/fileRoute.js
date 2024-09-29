const express = require('express')
const router = express.Router()

const { check } = require('express-validator')
const { verifyUser } = require('../middleware/verify')
const { addNewFilesToCorrespondingDirectory } = require('../controllers/fileController')
const upload = require('../middleware/upload')

const multipleUpload = upload.fields([{ name: 'files'}])

router.post(
    '/:parentDirectory',
    
    verifyUser,
    
    multipleUpload,

    addNewFilesToCorrespondingDirectory  
)

module.exports = router