require('dotenv').config()
const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const cors = require('cors')

const PORT = process.env.PORT
const connectToDatabase = require('./database/connection')

const userRoute = require('./routes/userRoute')
const directoryRoute = require('./routes/directoryRoute')
const fileRoute = require('./routes/fileRoute')
const googleAuthRoute = require('./routes/googleAuthRoute')
const { connectToRedis } = require('./cache/connection')

app.use(cors({
    origin: process.env.CORS_ORIGIN_URL, 
    credentials: true
}))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.get('/', (request, response) => {
    response.status(200).send({ message: "It's working"})
})

app.use((req, res, next) => {
    const start = Date.now(); // Capture the start time
    
    // Hook into the response finishing event
    res.on('finish', () => {
        const end = Date.now(); // Capture the end time
        const duration = end - start; // Calculate the duration
        console.log(`${req.method} ${req.originalUrl} took ${duration} ms`);
    });

    next(); // Proceed to the next middleware/route handler
});

app.use('/api/v1/user', userRoute)
app.use('/api/v1/folders', directoryRoute)
app.use('/api/v1/file', fileRoute)
app.use('/api/v1/google-auth', googleAuthRoute)

connectToDatabase()
    .then(() => {
        try{
            connectToRedis()
        } 
        catch(error) {
            console.log(`Can't Connect to Redis : ${error}`)
        }
    })
    .then(() => {
        try{
            app.listen(PORT, console.log(`Server is running at http://localhost:${PORT}`))
        }
        catch(error) {
            console.log(`Can't connect to DB : ${error}`)
        }
    })
    .catch((error) => {
        console.log(`Error while connecting to database : ${error}`)
    })