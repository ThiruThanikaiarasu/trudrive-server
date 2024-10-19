
const directoryModel = require('../models/directoryModel')
const { createDirectory } = require('../services/directoryServices')
const { createUrlIdForDirectory } = require('../services/utilityServices')

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
    const user = request.user 
    let { parentDirectory } = request.params
    const { directoryName } = request.body
    try{

        const directory = directoryModel(user.tenantId)

        if(parentDirectory == 'home') {
            const rootDirectory = await directory.findOne({ name: 'root'})
            parentDirectory = rootDirectory._id
        } else {
            const rootDirectory = await directory.findOne({ urlId: parentDirectory })
            parentDirectory = rootDirectory._id
        }

        const childDirectory = new directory(
            {
                urlId: createUrlIdForDirectory(user.tenantId),
                owner: user._id,
                name: directoryName,
                parentDirectory: parentDirectory
            }
        )

        childDirectory.save()

        response.status(201).send({ message: "Directory created successfully"})
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    createRootDirectory,
    createChildDirectory,

}