const { createClient } = require('redis');

// Redis client setup
const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
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
