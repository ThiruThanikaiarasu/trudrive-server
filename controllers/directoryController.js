
const directoryModel = require('../models/directoryModel')
const { createDirectory, createANewDirectory, checkForExistingDirectory } = require('../services/directoryServices')
const { createUrlIdForDirectory } = require('../services/utilityServices')
const { setResponseBody } = require('../utils/responseFormatter')

const createRootDirectory = async (userId, tenantId) => {

    const directoryData = {
            urlId: createUrlIdForDirectory(tenantId),
            owner: userId,
            name: 'root',
    }

    const rootDirectory = await createDirectory(tenantId, directoryData)

    return rootDirectory
}

const createChildDirectory = async (request, response) => {
    const userId = request.user._id 
    const tenantId = request.user.tenantId
    const { parentDirectory } = request.params
    const { directoryName } = request.body

    try{

        if (!directoryName) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        const existingParentDirectory = await checkForExistingDirectory(tenantId, parentDirectory)

        if(!existingParentDirectory) {
            return response.status(404).send(setResponseBody("Parent directory not found", "not_found", null))
        }

        const directoryData = {
            urlId: createUrlIdForDirectory(tenantId),
            owner: userId,
            name: directoryName,
            parentDirectory: parentDirectory,
        }

        const newDirectory = await createANewDirectory(tenantId, directoryData)

        const { _id: _, ...newDirectoryData } = newDirectory._doc

        response.status(201).send(setResponseBody("Directory created successfully", null, newDirectoryData))
    }
    catch(error) {
        console.log(error)
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    createRootDirectory,
    createChildDirectory,

}