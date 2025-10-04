const  { connectDB }  = require("./lib/db")
const express = require("express")
const app  = express()
const dotenv = require("dotenv")
const {usersRouter} = require("./routes/users")
const {accountsRouter} = require("./routes/accounts")
const cookieParser = require('cookie-parser')
const cors = require('cors');

console.log("this is user router", usersRouter)
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,            //access-control-allow-credentials:true
}

// load environment variables and middlewares
dotenv.config()
app.use(express.json()) 
app.use(cookieParser())
app.use(cors(corsOptions))


// routes
const baseUrl = 'api/v1'
app.get("/health", (req, res) => {
    res.send("App working fine")
})
app.use(`${baseUrl}`, usersRouter)
app.use(`${baseUrl}`, accountsRouter)



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
