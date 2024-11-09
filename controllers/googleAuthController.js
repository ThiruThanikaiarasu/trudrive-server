const { v4 : uuidv4} = require('uuid')

const { generateAuthUrl, setGoogleAuthCookies, extractGoogleAuthTokenFromCookies, fetchUserData, formatUserDataFromGoogleData } = require("../services/googleAuthServices")
const { findUserByEmail, createUser } = require("../services/userServices")
const { setResponseBody } = require("../utils/responseFormatter")

const getGoogleAuthPageUrl = (request, response) => {
    response.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN_URL)
    response.header('Referrer-Policy', 'no-referer-when-downgrade')

    try {
        const url = generateAuthUrl()
        response.status(200).send(setResponseBody("Url Generated successfully", null, url))
    } 
    catch(error) {
        response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
} 

const handleGoogleAuthCallback = async (request, response) => {
    const code = request.query.code

    try {
        await setGoogleAuthCookies(code, response)

        response.redirect(`${process.env.CORS_ORIGIN_URL}/auth/callback`)
    } 
    catch(error) {
        response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

const fetchGoogleAuthenticatedUserData = async (request, response) => {
    try {
        const tokens = extractGoogleAuthTokenFromCookies(request.headers)
        const userData = await fetchUserData(tokens.accessToken)

        const existingUser = await findUserByEmail(userData.email)

        if(!existingUser) {
            const tenantId = uuidv4()
            const newUser = {
                accountType: 'google',
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                email: userData.email,
                tenantId
            }
            await createUser(newUser)
        }

        response.status(200).send(setResponseBody("Data Fetched", null, userData))
    }
    catch(error) {
        response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

module.exports = {
    getGoogleAuthPageUrl,
    handleGoogleAuthCallback,
    fetchGoogleAuthenticatedUserData
}