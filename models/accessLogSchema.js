const mongoose = require('mongoose')

const accessLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true,
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        lastAccessAt: {
            type: Date,
            default: Date.now, 
        },
    },
    {
        collation: "accessLog",
    },
    {
        timestamps: true 
    }
)

const AccessLog =

module.exports =  mongoose.model('accessLog', accessLogSchema)
