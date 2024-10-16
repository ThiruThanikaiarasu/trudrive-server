const userModel = require('../models/userModel')

const bcrypt = require('bcryptjs')
const { v4 : uuidv4} = require('uuid')
const { createRootDirectory } = require('./directoryController')
const { setResponseBody } = require('../utils/responseFormatter')
const { findUserByEmailWithPassword } = require('../services/userServices')

const signup = async (request, response) => {
    const { firstName, lastName, phone , email, password } = request.body

    try{
        const existingUser = await userModel.findOne({ email })
        if(existingUser) {
            return response.status(409).send({ message: 'Email id already exist' })
        }
        const tenantId = uuidv4()
        const userToBeRegistered = new userModel(
            {
                firstName, 
                lastName, 
                phone, 
                email, 
                password, 
                tenantId 
            }
        )

        await userToBeRegistered.save()

        await createRootDirectory(userToBeRegistered._id, tenantId)

        let options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        const token = userToBeRegistered.generateAccessJWT()
        response.cookie('SessionID', token, options)
        response.status(201).send({ message: 'User created successfully'})
    } 
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const login = async (request, response) => {
    console.log("first")
    const { email, password } = request.body 
    try{
        const existingUser = await findUserByEmailWithPassword(email)
        if(!existingUser) {
            return response.status(401).send(setResponseBody("Invalid email address", "invalid_email", null))
        }

        const validatePassword = await bcrypt.compare(password, existingUser.password)
        if(!validatePassword) {
            return response.status(401).send(setResponseBody("Invalid password", "invalid_password", null))
        }

        let options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        const {password: _, _id, role, __v, ...userData} = existingUser._doc
        console.log(userData)

        const token = existingUser.generateAccessJWT()     
        response.cookie('SessionID', token, options)
        response.status(200).send(setResponseBody("Logged in Successfully", null, [userData]))
    } 
    catch(error) {
        response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

module.exports = {
    signup,
    login
}
