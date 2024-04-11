const express = require("express");
const { searchSchools, getSchool } = require("../controllers/schoolController");

const router = express.Router();

// GET schools by query
router.get("/get/schools/:query", searchSchools);

router.get("/get/:id", getSchool);

module.exports = router;
