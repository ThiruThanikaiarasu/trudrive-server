const userModel = require('../models/userModel')

const bcrypt = require('bcryptjs')
const { v4 : uuidv4} = require('uuid')
const { createRootDirectory } = require('./directoryController')

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

    const {email} = request.body 
    try{
        const existingUser = await userModel.findOne({ email }).select('+password') 
        if(!existingUser) {
            return response.status(401).send({ message: 'Invalid email address'})
        }

        const validatePassword = await bcrypt.compare(`${request.body.password}`, existingUser.password)
        if(!validatePassword) {
            return response.status(401).send({ message: 'Invalid password'})
        }

        let options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        const token = existingUser.generateAccessJWT()     
        response.cookie('SessionID', token, options)
        response.status(200).send({ message: 'Login Successfully'})
    } 
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    signup,
    login
}
