const { init } = require('@paralleldrive/cuid2')

const directoryModel = require("../models/directoryModel")
const fileModel = require("../models/fileModel")

const createUrlIdForFile = (tenantId) => {
    const urlId = init({
        random: Math.random,
        length: 20,
        fingerprint: tenantId
    })

    return urlId()
}

const addNewFilesToCorrespondingDirectory = async (request, response) => {

    const uploadedFiles = request.files.files
    const user = request.user
    let { parentDirectory } = request.params
    try {

        const directory = directoryModel(user.tenantId)
        const files = fileModel(user.tenantId)

        if(parentDirectory == 'home') {
            const rootDirectory = await directory.findOne({ name: 'root'})
            parentDirectory = rootDirectory._id
        } else {
            const rootDirectory = await directory.findOne({ urlId: parentDirectory })
            parentDirectory = rootDirectory._id
        }

        const filesToUpload = uploadedFiles.map(file => (
            new files(
                {
                    urlId: createUrlIdForFile(user.tenantId),
                    owner: user._id,
                    filename: file.filename,
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    parentDirectory: parentDirectory
                }
            )
        ))

        await files.insertMany(filesToUpload)

        response.status(201).send({ message: "Files Uploaded Successfully" })
    }
    catch (error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    addNewFilesToCorrespondingDirectory
}