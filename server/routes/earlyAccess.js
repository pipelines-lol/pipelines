const express = require("express");
const { checkCode } = require("../controllers/earlyAccessController");

const router = express.Router();

// check code
router.post("/check", checkCode);

module.exports = router;
