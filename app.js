const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const cors = require('cors')

const { PORT } = require('./configuration/config')
const connectToDatabase = require('./database/connection')

const userRoute = require('./routes/userRoute')


app.use(cookieParser())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.get('/', (request, response) => {
    response.status(200).send({ message: "It's working"})
})

app.use('/api/v1/user', userRoute)

connectToDatabase()
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