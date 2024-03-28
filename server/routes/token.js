const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../middleware/token");

const router = express.Router();

const getToken = async (req, res) => {
  // generate sessionId
  const sessionId = uuidv4();

  // generate token
  const token = generateToken(sessionId);

  res.json(token);
};

// GET token
router.get("/", getToken);

module.exports = router;
