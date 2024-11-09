const oAuth2Client = require('../config/googleOAuthConfig')

const generateAuthUrl = () => {
    const scopes = ['openid', 'profile', 'email']
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent',
        scope: scopes
    })
}

const setGoogleAuthCookies = async (code, response) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }
        response.cookie('access_token', tokens.access_token, options)
        response.cookie('refresh_token', tokens.refresh_token, options)
        response.cookie('id_token', tokens.id_token, options)
    } catch (error) {
        throw new Error('Failed to get user data')
    }
}

const extractGoogleAuthTokenFromCookies = (authHeader) => {
    try{
        const tokens = {}
  
        const tokenKeys = {
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
          id_token: 'idToken'
        }
        
        const cookies = authHeader.cookie.split(' ')
      
        cookies.forEach(cookie => {
          const [key, value] = cookie.split('=')
          const mappedKey = tokenKeys[key]
          if (mappedKey) {
            tokens[mappedKey] = decodeURIComponent(value).replace(/;$/, '')
          }
        })

        return tokens
    } catch (error) {
        throw new Error("Failed to get token")
    }
}

const fetchUserData = async (accessToken) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
        )

        if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        data.accessToken = accessToken
        return formatUserDataFromGoogleData(data)
    } catch (error) {
        throw new Error("Failed to fetch user data")
    }
}

const formatUserDataFromGoogleData = (data) => {
    return {
        firstName: data.given_name,
        lastName: data.family_name,
        profileImage: data.picture,
        email: data.email
    }
}


module.exports = {
    generateAuthUrl,
    setGoogleAuthCookies,
    extractGoogleAuthTokenFromCookies,
    fetchUserData
}