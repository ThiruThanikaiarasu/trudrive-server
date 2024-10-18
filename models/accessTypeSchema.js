const mongoose = require("mongoose")

const accessTypeSchema = new mongoose.Schema(
    {
        name: {               
            type: String,
            required: true,
            unique: true,
        },
        description: {        
            type: String,
            default: '',
        },

    },
    {
        collection: 'accessType'
    },
    {
        timestamps: true,
    },
)


module.exports = mongoose.model('accessType', accessTypeSchema)
