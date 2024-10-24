const bcrypt = require('bcryptjs')
const { v4 : uuidv4} = require('uuid')
const { createRootDirectory } = require('./directoryController')
const { setResponseBody } = require('../utils/responseFormatter')
const { findUserByEmailWithPassword, findUserByEmail, createUser } = require('../services/userServices')
const { generateToken, setTokenCookie } = require('../services/tokenServices')

const signup = async (request, response) => {
    const { firstName, lastName, phone , email, password } = request.body

    try{
        const existingUser = await findUserByEmail(email)
        if(existingUser) {
            return response.status(409).send(setResponseBody("Email id already exist", "existing_email", null))
        }
        const tenantId = uuidv4()
        const newUser = {
                    firstName, 
                    lastName, 
                    phone, 
                    email, 
                    password, 
                    tenantId 
            }
        
        const userToBeRegistered = await createUser(newUser)

        await createRootDirectory(userToBeRegistered._id, tenantId)
        const token = generateToken(userToBeRegistered)
        setTokenCookie(response, token)

        const {password: userPassword, __v: userVersion, tenantId: userTenantId, _id: userId, ...userData} = userToBeRegistered._doc
        response.status(201).send(setResponseBody("User Created Successfully", null, userData))
    } 
    catch(error) {
        response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

const login = async (request, response) => {
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
        const {password: _, _id, role, __v, tenantId, ...userData} = existingUser._doc

        const token = existingUser.generateAccessJWT()     
        response.cookie('SessionID', token, options)
        response.status(200).send(setResponseBody("Logged in Successfully", null, userData))
    } 
    catch(error) {
        response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

module.exports = {
    signup,
    login
}
