const express = require("express");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// middleware
const { verifyToken } = require("./middleware/token");
const { verifyProfile } = require("./middleware/profile");
const { verifyAdmin } = require("./middleware/admin");
const { verifyUser } = require("./middleware/user");

// route imports
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profiles");
const schoolRoutes = require("./routes/school");
const companyRoutes = require("./routes/companies");
const mongodbIdRoutes = require("./routes/mongodbId");
const offerRoutes = require("./routes/offers");
const pfpRoutes = require("./routes/pfps");
const imageModerationRoutes = require("./routes/imageModeration");
const adminRoutes = require("./routes/admin");
const emailRoutes = require("./routes/emails");
const earlyAccessRoutes = require("./routes/earlyAccess");
const tokenRoutes = require("./routes/token");

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
  res.json("Hello! This is the Pipelines API!");
});

// routes
const routes = [
  { path: "/api/user", middleware: [verifyToken], handler: authRoutes },
  {
    path: "/api/profile",
    middleware: [verifyToken],
    handler: profileRoutes.read,
  },
  {
    path: "/api/profile",
    middleware: [verifyToken, verifyProfile],
    handler: profileRoutes.write,
  },
  {
    path: "/api/school/create",
    middleware: [verifyToken, verifyAdmin],
    handler: schoolRoutes.write,
  },
  {
    path: "/api/school/delete/:id",
    middleware: [verifyToken, verifyAdmin],
    handler: schoolRoutes.write,
  },
  {
    path: "/api/school",
    middleware: [verifyToken],
    handler: schoolRoutes.read,
  },
  {
    path: "/api/company",
    middleware: [verifyToken],
    handler: companyRoutes.read,
  },
  {
    path: "/api/company",
    middleware: [verifyToken, verifyAdmin],
    handler: companyRoutes.write,
  },
  {
    path: "/api/mongodbId",
    middleware: [verifyToken],
    handler: mongodbIdRoutes,
  },
  { path: "/api/pfp", middleware: [verifyToken], handler: pfpRoutes },
  {
    path: "/api/imageModeration",
    middleware: [verifyToken],
    handler: imageModerationRoutes,
  },
  { path: "/api/offer", middleware: [verifyToken], handler: offerRoutes },
  { path: "/api/email", middleware: [verifyToken], handler: emailRoutes.read },
  {
    path: "/api/email",
    middleware: [verifyToken, verifyAdmin],
    handler: emailRoutes.write,
  },
  {
    path: "/api/earlyAccess",
    middleware: [verifyToken],
    handler: earlyAccessRoutes,
  },

  // admin routes
  { path: "/api/admin", middleware: [verifyToken], handler: adminRoutes },

  { path: "/api/token", handler: tokenRoutes }, // no verification, this is needed for verification
];

routes.forEach(({ path, middleware, handler }) => {
  if (middleware) app.use(path, middleware, handler);
  else app.use(path, handler);
});

const server = app.listen(PORT, () => console.log("Server is running."));

module.exports = { app, server };
