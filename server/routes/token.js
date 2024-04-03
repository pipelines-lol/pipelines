const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../middleware/token");

const router = express.Router();

const getToken = async (req, res) => {
  // Extract profileId from request parameters
  const { linkedinToken } = req.query;

  // generate sessionId
  const sessionId = uuidv4();

  // generate token with profileId included in the payload if it exists
  const token = generateToken(sessionId, linkedinToken);

  res.json(token);
};

// GET token
router.get("/", getToken);

module.exports = router;
