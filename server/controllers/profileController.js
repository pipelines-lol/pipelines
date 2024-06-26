const User = require("../models/userModel");
const Company = require("../models/companyModel");
const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

// helper functions
const { shuffleArray } = require("../utils/generalUtils");

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

// GET a certain amount of random profiles
const getRandomProfiles = async (req, res) => {
  try {
    // Retrieve the amount of profiles to retrieve from req.query
    const { amount } = req.query;

    if (amount) {
      // Parse the amount into a number
      const numberOfProfilesToRetrieve = parseInt(amount);

      // Check if the parsed result is NaN
      if (isNaN(numberOfProfilesToRetrieve)) {
        return res.status(400).json({ error: "Invalid amount provided." });
      }

      // Get the total count of profiles in the database with non-empty "pipeline" field
      const totalProfilesCount = await Profile.countDocuments({
        pipeline: { $exists: true, $ne: [], $gt: [] },
      });

      // Generate an array of random indices within the total count of profiles with non-empty "pipeline" field
      const randomIndices = [];
      while (randomIndices.length < numberOfProfilesToRetrieve) {
        const randomIndex = Math.floor(Math.random() * totalProfilesCount);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      // Retrieve random profiles based on the random indices and with non-empty "pipeline" field
      const randomProfiles = await Profile.find({
        pipeline: { $exists: true, $ne: [], $gt: [] },
      })
        .limit(numberOfProfilesToRetrieve)
        .skip(randomIndices[0]);

      res.status(200).json(randomProfiles);
    } else {
      // If no amount is given, retrieve all profiles with non-empty "pipeline" field and shuffle them
      const allProfilesWithPipeline = await Profile.find({
        pipeline: { $exists: true, $ne: [], $gt: [] },
      });
      const shuffledProfiles = shuffleArray(allProfilesWithPipeline);

      res.status(200).json(shuffledProfiles);
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
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

  //* Logs
  console.log(
    `Profile of ${profile.firstName} ${profile.lastName} (Linkedin: ${profile.linkedin}) deleted with ID: ${id}`
  );
  console.log(profile);

  res.status(200).json(profile);
};

// UPDATE a profile
const updateProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  try {
    const profile = req.body;

    if (!profile) {
      return res.status(404).json({ error: "No such Profile." });
    }

    // check if a pipeline change is within the req.body
    if (profile.pipeline) {
      // if there is a pipeline change
      // make sure display names are added vs. raw names
      for (let i = 0; i < profile.pipeline.length; i++) {
        const query_name = profile.pipeline[i].companyName;
        const company = await Company.findOne({ name: query_name });

        if (company) {
          const new_display_name = company.displayName;
          // Update the experience document in the profile collection
          profile.pipeline[i].displayName = new_display_name;
        }
      }
    }

    // Update the profile with the req body
    const updatedProfile = await Profile.findByIdAndUpdate(id, profile, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ error: "No such Profile." });
    }

    //* Logs
    console.log(
      `Profile of ${profile.firstName} ${profile.lastName} (Linkedin: ${profile.linkedin}) updated with ID: ${id}`
    );
    console.log(updatedProfile);

    res.status(200).json(profile);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

module.exports = {
  getProfiles,
  getProfile,
  getRandomProfiles,
  deleteProfile,
  updateProfile,
};
