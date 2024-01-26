const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

// GET a single profile
const getPipeline = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  const profile = await Profile.findById(id);

  if (!profile) {
    return res.status(404).json({ error: "No such Profile." });
  }

  res.status(200).json(profile.pipeline);
};

//  GET profiles (by experience name with optional title filter)
const getPipelinesByCompany = async (req, res) => {
  const { company } = req.params;
  const { title, school, employment } = req.query; // Use query parameters to specify job title, school, and employment type

  const query = { "pipeline.company": company };

  if (title) {
    query["pipeline.title"] = title;
  }

  if (school) {
    query["school"] = school;
  }

  if (employment) {
    if (employment === "intern") {
      query["pipeline.title"] = { $regex: /intern/i }; // Match titles containing "intern"
    } else if (employment === "fulltime") {
      query["pipeline.title"] = { $not: { $regex: /intern/i } };
    }
  }

  try {
    const profiles = await Profile.find(query);

    if (profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found." });
    }

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET profiles by university (with optional title filter)
const getPipelinesByUniversity = async (req, res) => {
  const { university } = req.params;
  const { title } = req.query;

  const query = { school: university };

  if (title) {
    query["pipeline.title"] = title;
  }

  try {
    const profiles = await Profile.find(query);

    if (profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found." });
    }

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET multiple profiles by company
const getMultiplePipelinesByCompany = async (req, res) => {
  // SoftMatch Example: Person A works at AAPL, BB and Person B works at BB
  // Searching for [AAPL,BB] w/ SoftMatch==true returns {A,B}, and SoftMatch==false {A}
  const { companies, isSoftMatch } = req.query; // An array of company names and a boolean flag
  try {
    let query = {};
    const companiesArray = companies.split(",");
    console.log(companiesArray);

    if (isSoftMatch === "true") {
      query = { "pipeline.company": { $in: companiesArray } }; // Matches any pipeline that includes any company in the array
    } else {
      query = { "pipeline.company": { $all: companiesArray } }; // Matches any pipeline that includes all companies in the array
    }
    console.log(query);
    const profiles = await Profile.find(query);

    if (profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found." });
    }

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET random profiles
const getRandomPipelines = async (req, res) => {
  const { size } = req.params;

  const randomProfiles = await Profile.aggregate([
    { $match: { created: true, "pipeline.0": { $exists: true } } },
    { $sample: { size: Number(size) } },
  ]);

  res.status(200).json(randomProfiles);
};

// REMOVE an experience from a pipeline
const removeExperience = async (req, res) => {
  const { id } = req.params;
  const { index } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  const profile = await Profile.findOne({ _id: id });

  if (!profile) {
    return res.status(404).json({ error: "No such Profile." });
  }

  // create new pipeline
  const newPipeline = [...profile.pipeline];

  // remove the experience at index
  newPipeline.splice(index, 0);

  // update pipeline in db
  await Profile.findOneAndUpdate(
    { _id: id },
    {
      pipeline: newPipeline,
    }
  );

  res.status(200).json(profile);
};

// ADD an experience
const addExperience = async (req, res) => {
  const { id } = req.params;
  const { index, company, title, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  const profile = await Profile.findOne({ _id: id });

  if (!profile) {
    return res.status(404).json({ error: "No such Profile." });
  }

  // create new pipeline + experience
  const newPipeline = [...profile.pipeline];
  const experience = {
    company: company,
    title: title,
    date: date,
  };

  // if no index, push to end of pipeline; else insert at index
  if (!index) {
    newPipeline.push(experience);
  } else {
    newPipeline.splice(index, 0, experience);
  }

  // update pipeline in db
  await Profile.findOneAndUpdate(
    { _id: id },
    {
      pipeline: newPipeline,
    }
  );

  res.status(200).json(profile);
};

module.exports = {
  getPipeline,
  getPipelinesByUniversity,
  getPipelinesByCompany,
  getMultiplePipelinesByCompany,
  getRandomPipelines,
  removeExperience,
  addExperience,
};
