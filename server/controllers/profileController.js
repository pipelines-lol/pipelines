const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

// GET all profiles
const getProfiles = async (req, res) => {
  const profiles = await Profile.find({}).sort({ createdAt: -1 });

  res.status(200).json(profiles);
};

// GET a single profile
const getProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  const profile = await Profile.findById(id);

  if (!profile) {
    return res.status(404).json({ error: "No such Profile." });
  }

  // check if profile is anonymous
  if (profile.anonymous) {
    // do not send sensitive information
    profile.linkedin = "";
    profile.pfp = "";
    profile.location = "";

    profile.firstName = "Anonymous";
    profile.lastName = "";
  }

  res.status(200).json(profile);
};

// DELETE a profile
const deleteProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  const profile = await Profile.findOneAndDelete({ _id: id });

  if (!profile) {
    return res.status(404).json({ error: "No such Profile." });
  }

  res.status(200).json(profile);
};

// UPDATE a poll
const updateProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  try {
    const profile = await Profile.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!profile) {
      return res.status(404).json({ error: "No such Profile." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

module.exports = {
  getProfiles,
  getProfile,
  deleteProfile,
  updateProfile,
};
