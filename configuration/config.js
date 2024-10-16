const dotenv = require('dotenv')
dotenv.config()

const { PORT, DB_URI, ACCESS_TOKEN, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, CORS_ORIGIN_URL } = process.env

module.exports = { PORT, DB_URI, ACCESS_TOKEN, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, CORS_ORIGIN_URL }