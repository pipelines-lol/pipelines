const express = require("express")

const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require('cors')
const bodyParser = require('body-parser')

// route imports
const authRoutes = require("./routes/auth")
const profileRoutes = require('./routes/profiles')
const pipelineRoutes = require('./routes/pipelines')
const mongodbIdRoutes = require('./routes/mongodbId')
const pfpRoutes = require('./routes/pfps')
const imageModerationRoutes = require('./routes/imageModeration')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// cors
const corsOptions = {
    origin: ["http://localhost:3000", "https://pipelines-backend.onrender.com", "https://pipelinesfyi.netlify.app", "https://pipelines.lol", "https://www.pipelines.lol", "https://linkedin.com"],
    methods: ["POST", "PATCH", "DELETE", "GET"],
    credentials: true
}
app.use(cors(corsOptions))

// body parser
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

// database
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log("Successfully connected to database."))
    .catch((err) => console.log(err))

app.use(express.json())

// testing
app.get("/", (req, res) => {
    res.json("Hello!")
})

// routes
app.use('/api/user', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/pipeline', pipelineRoutes)
app.use('/api/mongodbId', mongodbIdRoutes)
app.use('/api/pfp', pfpRoutes)
app.use('/api/imageModeration', imageModerationRoutes)

const server = app.listen(PORT, () => console.log("Server is running."))

module.exports = {app, server}
