const express = require("express");
const {
  getProfiles,
  getProfile,
  deleteProfile,
  updateProfile,
} = require("../controllers/profileController");

const read = express.Router();
const write = express.Router();

// GET all profiles
read.get("/", getProfiles);

// GET a single profile
read.get("/:id", getProfile);

// DELETE a profile
write.delete("/:id", deleteProfile);

// UPDATE a profile
write.patch("/:id", updateProfile);

module.exports = {
  read,
  write,
};
