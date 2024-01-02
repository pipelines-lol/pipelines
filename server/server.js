const express = require("express")

const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require('cors')

// route imports
const authRoutes = require("./routes/auth")
const profileRoutes = require('./routes/profiles')
const pipelineRoutes = require('./routes/pipelines')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

// cors
app.use(cors(
    {
        origin: ["https://pipelines-api.vercel.app/"],
        methods: ["POST", "PATCH", "DELETE", "GET"],
        credentials: true
    }
))

// database
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log("Successfully connected to database."))
    .catch((err) => console.log(err))

app.use(express.json())

// routes
app.use('/api/user', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/pipeline', pipelineRoutes)

app.listen(PORT, () => console.log("Server is running."))