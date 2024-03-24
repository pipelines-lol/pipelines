const User = require("../models/userModel");
const Company = require("../models/companyModel");
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
    // convert the Mongoose document to a plain JavaScript object
    let anonymousProfile = profile.toObject();

    // use object destructuring to exclude certain properties
    const { linkedin, pfp, location, lastName, ...rest } = anonymousProfile;

    // create a new profile object with the properties you want to retain and modify
    anonymousProfile = {
      ...rest,
      firstName: "Anonymous",

      // set unwanted properties an empty string
      linkedin: "",
      pfp: "",
      location: "",
      lastName: "",
    };

    return res.status(200).json(anonymousProfile);
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
  console.log("profile: ", req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  try {
    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({ error: "No such Profile." });
    }

    for (let i = 0; i < profile.pipeline.length; i++) {
      const query_name = profile.pipeline[i].companyName;
      const company = await Company.findOne({ name: query_name });

      if (company) {
        const new_display_name = company.displayName;
        // Update the experience document in the profile collection
        profile.pipeline[i].displayName = new_display_name;
      }
    }

    await profile.save();

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
