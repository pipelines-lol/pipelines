const express = require("express");
const {
  loginUser,
  getLinkedinInfoWithCode,
  refreshLinkedinToken,
} = require("../controllers/authController");

const router = express.Router();

// LOGIN user
router.post("/login", loginUser);

// GET linkedin user info
router.get("/linkedin/userinfo", getLinkedinInfoWithCode);

// REFRESH linkedin token
router.post("/linkedin/refresh", refreshLinkedinToken);

module.exports = router;
