const  { connectDB }  = require("./lib/db")
const express = require("express")
const app  = express()
const dotenv = require("dotenv")
const {userRouter} = require("./routes/users")
const cookieParser = require('cookie-parser')


// load environment variables and middlewares
dotenv.config()
app.use(express.json()) 
app.use(cookieParser())


// routes
const baseUrl = 'api/v1'
app.get("/health", (req, res) => {
    res.send("App working fine")
})
app.use(`${baseUrl}`, userRouter)



// start server and connect to database
const start = (async () =>{ 
    const url = process.env.ENV = "development" ? `http://localhost:${process.env.PORT}/health` :`${process.env.BACKEND_URL}/health`
    try {
        await connectDB(process.env.MONGO_URI); // study: do we need try catch here or at function level in connect db tradeoffs
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`, url)
        })
    } catch (error) {
        console.log("Error in starting server", error.message)
    }
})()
