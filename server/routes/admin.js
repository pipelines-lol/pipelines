const express = require("express");
const { loginAdmin, verifyToken } = require("../controllers/adminController");

const router = express.Router();

// LOGIN user
router.post("/login", loginAdmin);

// VERIFY admin token
router.post("/verify", verifyToken);

module.exports = router;
