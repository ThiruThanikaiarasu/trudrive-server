const mongoose = require('mongoose')

const userStorageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            unique: true, 
        },
        totalSpace: {
            type: Number, 
            required: true,
        },
        occupiedSpace: {
            type: Number,
            default: 0, 
        },
        totalFiles: {
            type: Number, 
            default: 0, 
        },
        totalDirectories: {
            type: Number, 
            default: 0, 
        },
        fileSizes: {
            image: {
                type: Number, 
                default: 0,
            },
            document: {
                type: Number, 
                default: 0,
            },
            pdf: {
                type: Number,
                default: 0,
            },
            video: {
                type: Number, 
                default: 0,
            },
            others: {
                type: Number, 
                default: 0,
            },
        },
    },
    {
        collection: "userStorage"
    },
    {
        timestamps: true, 
    }
)

module.exports = mongoose.model('userStorage', userStorageSchema)
