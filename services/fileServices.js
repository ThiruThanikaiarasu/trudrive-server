const crypto = require('crypto')
const sizeOf = require('image-size')
const { PutObjectCommand } = require('@aws-sdk/client-s3')

const s3  = require('../config/s3Config')
const fileModel = require('../models/fileModel')
const { createUrlIdForFile } = require('./utilityServices')


const randomImageName = () => {
    return crypto.randomBytes(32).toString('hex')
}

const uploadFileToS3 = async (file) => {
    const imageName = randomImageName()

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
    }
    
    const command = new PutObjectCommand(params)
    await s3.send(command)
    
    return imageName
}

const createFileDocument = (file, tenantId, userId, parentDirectory) => {
    let width = null
    let height = null
    if (file.mimetype.startsWith('image/')) {
        const dimensions = sizeOf(file.buffer)
        width = dimensions.width
        height = dimensions.height
    }

    return {
        urlId: createUrlIdForFile(tenantId),
        owner: userId,
        fileUrl: file.fileUrl,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        parentDirectory: parentDirectory,
        width,
        height,
    }
}

const processFile = async (files, tenantId, userId, parentDirectory) => {
    const fileDocuments = []

    for(const file of files) {
        const fileUrl = await uploadFileToS3(file)
        const fileDocument = createFileDocument({ ...file, fileUrl }, tenantId, userId, parentDirectory)
        fileDocuments.push(fileDocument)
    }

    return fileDocuments
}

const saveFilesToDatabase = async (tenantId, fileDocuments) => {
    const file = fileModel(tenantId)

    return await file.insertMany(fileDocuments)
}

module.exports = {
    processFile,
    saveFilesToDatabase
}