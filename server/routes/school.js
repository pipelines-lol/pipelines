const express = require("express");
const {
  searchSchools,
  getSchool,
  createSchool,
  deleteSchool,
} = require("../controllers/schoolController");

const read = express.Router();
const write = express.Router();

write.post("/create", createSchool);

// GET schools by query
read.get("/get/schools/:query", searchSchools);

read.get("/get/:id", getSchool);

write.get("/delete/:id", deleteSchool);

module.exports = read;
