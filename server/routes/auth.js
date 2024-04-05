const express = require("express");
const {
  loginUser,
  verifyToken,
  getLinkedinInfo,
  refreshLinkedinToken,
} = require("../controllers/authController");

// middleware
const { verifyUser } = require("../middleware/user");

const router = express.Router();

// LOGIN user
router.post("/login", verifyUser, loginUser);

// VERIFY linkedin token
router.post("/verify", verifyToken);

// GET linkedin user info
router.get("/linkedin/userinfo", getLinkedinInfo);

// REFRESH linkedin token
router.post("/linkedin/refresh", refreshLinkedinToken);

module.exports = router;
