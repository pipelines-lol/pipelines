const express = require("express");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// route imports
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profiles");
const schoolRoutes = require("./routes/school");
const companyRoutes = require("./routes/companies");
const pipelineRoutes = require("./routes/pipelines");
const mongodbIdRoutes = require("./routes/mongodbId");
const offerRoutes = require("./routes/offers");
const pfpRoutes = require("./routes/pfps");
const imageModerationRoutes = require("./routes/imageModeration");
const emailRoutes = require("./routes/emails");
const earlyAccessRoutes = require("./routes/earlyAccess");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const API_URL = process.env.API_URL;

// cors
const corsOptions = {
  origin: [
    "http://localhost:3000",
    API_URL,
    "https://pipelineslol.netlify.app",
    "https://pipelines.lol",
    "https://www.pipelines.lol",
    "https://linkedin.com",
  ],
  methods: ["POST", "PATCH", "DELETE", "GET"],
  credentials: true,
};
app.use(cors(corsOptions));

// body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

// database
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Successfully connected to database."))
  .catch((err) => console.log(err));

app.use(express.json());

// testing
app.get("/", (req, res) => {
  res.json("Hello!");
});

// routes
app.use("/api/user", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/mongodbId", mongodbIdRoutes);
app.use("/api/pfp", pfpRoutes);
app.use("/api/imageModeration", imageModerationRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/earlyAccess", earlyAccessRoutes);
app.use("/api/admin", adminRoutes);

const server = app.listen(PORT, () => console.log("Server is running."));

module.exports = { app, server };
