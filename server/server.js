const express = require("express")

const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require('cors')

// route imports
const authRoutes = require("./routes/auth")
const pollRoutes = require('./routes/polls')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

// cors
app.use(cors())

// database
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log("Successfully connected to database."))
    .catch((err) => console.log(err))

app.use(express.json())

// routes
app.use('/api/user', authRoutes)
app.use('/api/poll', pollRoutes)

app.listen(PORT, () => console.log("Server is running."))