const userModel = require("../models/userModel")

const findUserByEmailWithPassword = async ( email ) => {
    return await userModel.findOne({ email }).select('+password')
}

module.exports = {
    findUserByEmailWithPassword
}