const express = require("express");
const { loginAdmin } = require("../controllers/adminController");

const router = express.Router();

// LOGIN user
router.post("/login", loginAdmin);

module.exports = router;
