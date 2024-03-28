const dotenv = require("dotenv");

dotenv.config();

const config = {
  HOST:
    process.env.NODE_ENV === "DEV"
      ? "http://localhost:4000"
      : process.env.NODE_ENV === "PROD"
      ? process.env.API_URL
      : (console.error("Unknown mode:", process.env.MODE), null),

  HOMEPAGE:
    process.env.NODE_ENV === "DEV"
      ? "http://localhost:3000"
      : process.env.NODE_ENV === "PROD"
      ? "https://pipelines.lol"
      : (console.error("Unknown mode:", process.env.MODE), null),
};

module.exports = config;
