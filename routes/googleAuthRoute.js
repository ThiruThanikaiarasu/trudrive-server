const express = require('express')
const router = express.Router()

const { getGoogleAuthPageUrl, handleGoogleAuthCallback, fetchGoogleAuthenticatedUserData } = require('../controllers/googleAuthController')


router.get(
    '/page-request', 

    getGoogleAuthPageUrl
)

router.get(
    '/verify-user', 

    handleGoogleAuthCallback
)

router.get(
    '/user-data',

    fetchGoogleAuthenticatedUserData,
)

module.exports = router