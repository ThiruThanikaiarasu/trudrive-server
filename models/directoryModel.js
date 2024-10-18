const mongoose = require('mongoose')

const createDirectorySchema = (tenantId) => {
    
    const directorySchema = new mongoose.Schema(
        {
            urlId: {
                type: String,
                required: true,
            },
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: [true, 'Directory owner is a mandatory field']
            },
            name: {
                type: String, 
                required: [true, 'Directory name is a mandatory field']
            },
            parentDirectory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: `${tenantId}_directories`
            },
        },
        {
            timestamps: true
        }
    )

    return directorySchema
}

const directoryModel = (tenantId) => {
    const collectionName = `${tenantId}_directories`

    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName]
    }

    const schema = createDirectorySchema(tenantId)
    return mongoose.model(collectionName, schema)
}

module.exports = directoryModel