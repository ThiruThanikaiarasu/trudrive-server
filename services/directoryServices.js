const directoryModel = require("../models/directoryModel")

const createDirectory = async (tenantId, directoryData) => {
    const directory = directoryModel(tenantId)

    const newDirectory = new directory(directoryData)

    return await newDirectory.save()
}

module.exports = {
    createDirectory
}