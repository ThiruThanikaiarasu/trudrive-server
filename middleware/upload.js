const multer = require('multer')
const fs = require('fs')

const modifyFilename = (file) => {
    return Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
}

const createDirectoryIfNotExist = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }
}

const storage = multer.diskStorage({

    filename: function(request, file, callback){

        const modifiedFilename = modifyFilename(file)
        
        callback(null, modifiedFilename)
    },

    destination: function(request, file, callback)
    {
        const tenantId = request.user.tenantId
        const uploadDirectory = `./public/docs/${tenantId}`

        // creates the directory if not exist
        createDirectoryIfNotExist(uploadDirectory)

        callback(null, uploadDirectory)
    },
})

const upload = multer({storage})

module.exports = upload