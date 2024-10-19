const directoryModel = require("../models/directoryModel")

const createDirectory = async (tenantId, directoryData) => {
    const directory = directoryModel(tenantId)

    const newDirectory = new directory(directoryData)

    return await newDirectory.save()
}

const createANewDirectory = async (tenantId, directoryData) => {
    const directory = directoryModel(tenantId)

    const newDirectory = new directory(directoryData)

    return await newDirectory.save()
}

const checkForExistingDirectory = async (tenantId, urlId) => {
    const directory = directoryModel(tenantId)

    return await directory.findOne({ urlId })
}

module.exports = {
    createDirectory,
    createANewDirectory,
    checkForExistingDirectory
}