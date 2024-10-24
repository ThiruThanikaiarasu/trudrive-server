const directoryModel = require("../models/directoryModel")

const findRootDirectory = async (tenantId) => {
    const directory = directoryModel(tenantId)

    const rootDirectory = await directory.findOne({ name: "root" })

    return rootDirectory
}

const createDirectory = async (tenantId, directoryData) => {
    const directory = directoryModel(tenantId)

    const newDirectory = new directory(directoryData)

    return await newDirectory.save()
}

const createANewDirectory = async (tenantId, directoryData) => {
    const directory = directoryModel(tenantId)

    const newDirectory = new directory(directoryData)

    return newDirectory.save()
}

const checkForExistingDirectory = async (tenantId, urlId) => {
    const directory = directoryModel(tenantId)

    return directory.findOne({ urlId })
}

const getFilesAndDirectoriesWithUrlId = async (tenantId, urlId) => {
    const directory = directoryModel(tenantId)

    return directory.find({ parentDirectory: urlId })

}

module.exports = {
    findRootDirectory,
    createDirectory,
    createANewDirectory,
    checkForExistingDirectory,
    getFilesAndDirectoriesWithUrlId
}