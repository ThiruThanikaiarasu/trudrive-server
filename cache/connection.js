const { createClient } = require('redis');

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = require('../configuration/config')

// Redis client setup
const redisClient = createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

const connectToRedis = async () => {
    try {
        await redisClient.connect(); // Connect to Redis
        console.log("Connected successfully to Redis Cloud");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        throw error;
    }
};

module.exports = {
    redisClient,
    connectToRedis
};
