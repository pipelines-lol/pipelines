const express = require("express");
const {
  getProfiles,
  getProfile,
  getProfileByUsername,
  getRandomProfiles,
  deleteProfile,
  updateProfile,
} = require("../controllers/profileController");

const read = express.Router();
const write = express.Router();

// GET all profiles
read.get("/", getProfiles);

// GET a single profile
read.get("/get/:id", getProfile);

// GET a single profile by username
read.get("/getBy", getProfileByUsername);

// GET a certain amount of random profiles
read.get("/random", getRandomProfiles);

// DELETE a profile
write.delete("/:id", deleteProfile);

// UPDATE a profile
write.patch("/:id", updateProfile);

module.exports = {
  read,
  write,
};
