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
            lastAccessAt: {
                type: Date,
            },
            lastAccessBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                validate: {
                    validator: function() {
                        return this.lastAccessAt ? !!value : true;
                    },
                    message: 'Last access by is required when last access is given'
                }
            },
            accessList: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'users'
                    },
                    accessType: {
                        type: String,
                        enum: ['viewer', 'owner'],
                        default: 'viewer'
                    }
                }
            ],
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