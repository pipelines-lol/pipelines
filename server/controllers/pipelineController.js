const Profile = require("../models/profileModel");
const Company = require("../models/companyModel");
const ExperienceSchema = require("../models/jobModel").ExperienceSchema;
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
  const { company } = req.params; // company = company name
  const { title, school, employment } = req.query;
  const companyDocument = await Company.findOne({ name: company });

  if (!companyDocument) {
    return res.status(404).json({ error: "Company not found." });
  }
  const query = { "pipeline.company": companyDocument._id }; // query by company id, no longer by company name

  // apply filters
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
    console.log(profiles);
    if (profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found." });
    }

    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
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
    const companiesArray = companies
      .split(",")
      .map((company) => company.trim().toLowerCase());

    if (!companiesArray || companiesArray.length === 0) {
      return res.status(400).json({ error: "No company names provided." });
    }

    const companyDocs = await Company.find({ name: { $in: companiesArray } });
    const companyIdArray = companyDocs.map((companyDoc) => companyDoc._id);
    if (isSoftMatch === "true") {
      query = { "pipeline.company": { $in: companyIdArray } }; // Matches any pipeline that includes any company in the array
    } else {
      query = { "pipeline.company": { $all: companyIdArray } }; // Matches any pipeline that includes all companies in the array
    }
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

// ADD an experience to Pipeline
const addExperience = async (req, res) => {
  const { id } = req.params;
  const { index, company, title, startDate, endDate } = req.body;

  // Validate and retrieve company ID
  const companyDoc = await Company.findOne({ name: company });
  if (!companyDoc) {
    return res.status(404).json({ error: "Company not found." });
  }
  const companyId = companyDoc._id;

  // Validate profile ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  // Find the profile by ID
  const profile = await Profile.findOne({ _id: id });
  if (!profile) {
    return res.status(404).json({ error: "No such Profile." });
  }

  // create new pipeline + experience
  const newPipeline = [...profile.pipeline];
  const newExperience = {
    company: companyId,
    title: title,
    startDate: startDate,
    endDate: endDate,
  };

  // if no index, push to end of pipeline; else insert at index
  if (!index) {
    newPipeline.push(newExperience);
  } else {
    newPipeline.splice(index, 0, newExperience);
  }

  // update pipeline in db
  await Profile.findOneAndUpdate(
    { _id: id },
    {
      pipeline: newPipeline,
    }
  );

  res.status(200).json({ message: "Success" });
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
