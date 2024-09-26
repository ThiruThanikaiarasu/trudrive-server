const { init } = require('@paralleldrive/cuid2')

const directoryModel = require('../models/directoryModel')

const createUrlIdForDirectory = (tenantId) => {
    const urlId = init({
        random: Math.random,
        length: 12,
        fingerprint: tenantId
    })

    return urlId()
}

const createRootDirectory = async (userId, tenantId) => {

        const directory = directoryModel(tenantId)

        const rootDirectory = new directory(
            {
                urlId: createUrlIdForDirectory(tenantId),
                owner: userId,
                name: 'root',
            }
        )

        await rootDirectory.save()
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