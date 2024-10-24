const { findRootDirectory } = require('../services/directoryServices')
const { processFile, saveFilesToDatabase } = require('../services/fileServices')
const { setResponseBody } = require('../utils/responseFormatter')


const addNewFilesToRootDirectory = async (request, response) => {
    const files = request.files['files']
    const userId = request.user._id
    const tenantId = request.user.tenantId

    try {
        if (!request.files || request.files.length === 0) {
            return response.status(400).send(setResponseBody("No documents were found", "not_found", null));
        }

        const rootDirectory = await findRootDirectory(tenantId)

        const fileDocuments = await processFile(files, tenantId, userId, rootDirectory.urlId)
        
        const savedFiles = await saveFilesToDatabase(tenantId, fileDocuments)

        response.status(201).send(setResponseBody("File uploaded successfully", null, savedFiles))

    }
    catch (error) {
        response.status(500).send({ message: error.message})
    }
}

const addNewFilesToCorrespondingDirectory = async (request, response) => {

    const files = request.files['files']
    const userId = request.user._id
    const tenantId = request.user.tenantId
    const { parentDirectory } = request.params

    try {

        if (!request.files || request.files.length === 0) {
            return response.status(400).send(setResponseBody("No documents were found", "not_found", null));
        }

        const fileDocuments = await processFile(files, tenantId, userId, parentDirectory)
        
        const savedFiles = await saveFilesToDatabase(tenantId, fileDocuments)

        response.status(201).send(setResponseBody("File uploaded successfully", null, savedFiles))
    }
    catch (error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    addNewFilesToRootDirectory,
    addNewFilesToCorrespondingDirectory
}