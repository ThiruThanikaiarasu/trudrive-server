const { createDirectory, createANewDirectory, checkForExistingDirectory, getFilesAndDirectoriesWithUrlId, findRootDirectory } = require('../services/directoryServices')
const { createUrlIdForDirectory } = require('../services/utilityServices')
const { setResponseBody } = require('../utils/responseFormatter')

const createRootDirectory = async (userId, tenantId) => {

    const directoryData = {
            urlId: createUrlIdForDirectory(tenantId),
            owner: userId,
            name: 'root',
            parentDirectory: null
    }

    const rootDirectory = await createDirectory(tenantId, directoryData)

    return rootDirectory
}

const createDirectoryUnderRoot = async (request, response) => {
    const userId = request.user._id
    const tenantId = request.user.tenantId
    const { directoryName } = request.body
    try {
        const rootDirectory = await findRootDirectory(tenantId)

        const directoryData = {
            urlId: createUrlIdForDirectory(tenantId),
            owner: userId,
            name: directoryName,
            parentDirectory: rootDirectory.urlId,
        }
        const newDirectory = await createDirectory(tenantId, directoryData)

        response.status(201).send(setResponseBody("Folder created Successfully", null, newDirectory))
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
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
        response.status(500).send({ message: error.message})
    }
}

const getFilesAndDirectoriesByParentId = async (request, response) => {
    const urlId = request.params.parentDirectory
    const tenantId = request.user.tenantId
    try {
        const existingParentDirectory = await checkForExistingDirectory(tenantId, urlId)

        if(!existingParentDirectory) {
            return response.status(404).send(setResponseBody("Parent directory not found", "not_found", null))
        }

        const filesAndDirectories = await getFilesAndDirectoriesWithUrlId(tenantId, urlId)

        response.status(200).send(setResponseBody("Resource retrieved successfully", null, filesAndDirectories))
    }
    catch(error) {
        response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

module.exports = {
    createDirectoryUnderRoot,
    createRootDirectory,
    createChildDirectory,
    getFilesAndDirectoriesByParentId

}