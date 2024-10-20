const { init } = require('@paralleldrive/cuid2')
const s3  = require('../configuration/s3Config')
const crypto = require('crypto')
const sizeOf = require('image-size')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const fileModel = require('../models/fileModel')

const createUrlIdForFile = (tenantId) => {
    const urlId = init({
        random: Math.random,
        length: 20,
        fingerprint: tenantId
    })

    return urlId()
}

const addNewFilesToCorrespondingDirectory = async (request, response) => {

    const files = request.files['files']
    const userId = request.user._id
    const tenantId = request.user.tenantId
    const { parentDirectory } = request.params
    try {

        if (!request.files || request.files.length === 0) {
            return response.status(400).json({ message: 'No files uploaded' });
        }

        const file = fileModel(tenantId)

        const fileDocuments = []

        const randomImageName = () => {
            return crypto.randomBytes(32).toString('hex')
        }

        for(const file of files) {
            
            const imageName = randomImageName()
    
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: imageName, 
                Body: file.buffer,
                ContentType: file.mimetype
            }
            const command = new PutObjectCommand(params)
    
            await s3.send(command)

            let width = null
            let height = null
            if (file.mimetype.startsWith('image/')) {
                const dimensions = sizeOf(file.buffer)
                width = dimensions.width
                height = dimensions.height
            }

            fileDocuments.push({
                urlId:  createUrlIdForFile(tenantId),
                owner: userId,
                fileUrl: imageName,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                parentDirectory: parentDirectory,
                width,
                height
            })
        }
        
        const savedFiles = await file.insertMany(fileDocuments)

        response.status(201).send({ message: "Files Uploaded Successfully" })
    }
    catch (error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    addNewFilesToCorrespondingDirectory
}