const userModel = require("../models/userModel")

const findUserByEmailWithPassword = ( email ) => {
    return userModel.findOne({ email }).select('+password tenantId email firstName lastName role profile')
}

const findUserByEmail = (email) => {
    return userModel.findOne({ email })
}

const createUser = async (userData) => {
    const userToBeRegistered = new userModel(userData)
    return await userToBeRegistered.save()
}

module.exports = {
    findUserByEmailWithPassword,
    findUserByEmail,
    createUser
}