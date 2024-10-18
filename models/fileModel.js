const mongoose = require('mongoose')

const createFileSchema = (tenantId) => {
    
    const fileSchema = new mongoose.Schema(
        {
            urlId: {
                type: String,
                required: true,
            },
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: [true, "Owner is a mandatory field"]
            },
            fileUrl: {
                type: String,
                required: [true, "File name is a mandatory field"]
            },
            originalname: {
                type: String,
                required: [true, "Original name is a mandatory field"]
            },
            mimetype: {
                type: String,
                required: [true, 'Mime type is a mandatory field']
            },
            size: {
                type: Number,
                required: [true, 'File size is a mandatory field']
            },
            parentDirectory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: `${tenantId}_directories`
            }
        },
        {
            timestamps: true
        }
        
    )

    return fileSchema

}

const fileModel = (tenantId) => {
    const collectionName = `${tenantId}_files`

    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName]
    }

    const schema = createFileSchema(tenantId)
    return mongoose.model(collectionName, schema) 
}

module.exports = fileModel