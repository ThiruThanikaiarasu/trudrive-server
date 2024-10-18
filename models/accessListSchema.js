const mongoose = require("mongoose")

const accessListSchema = new mongoose.Schema(
    {
        userId: {              
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        accessTypeId: {       
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AccessType',
            required: true,
        },
        entityId: {            
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        haveAccess: {       
            type: Boolean,
            default: true,
        },
        accessGrantedAt: {     
            type: Date,
            default: Date.now,
        },
        accessRevokedAt: {    
            type: Date,
            default: null,
        },
    },
    {
        collection: 'accessList'
    },
    {
        timestamps: true,      
    }
)

module.exports = mongoose.model('accessList', accessListSchema)
