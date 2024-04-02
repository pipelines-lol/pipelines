const Profile = require("../models/profileModel");
const Company = require("../models/companyModel");
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

const getProfiles = async (req, res) => {
  const INTERN = "intern";
  const FULLTIME = "fulltime";

  try {
    const filters = req.body;
    const query = Profile.find();
    if (filters.company) {
      query.where("pipeline.companyName").equals(filters.company.toLowerCase());
    }
    if (filters.title) {
      query.where("pipeline.title").equals(filters.title);
    }
    if (filters.school) {
      query.where("school").equals(filters.school);
    }
    if (filters.exp_level) {
      if (filters.exp_level === INTERN) {
        query.where("pipeline.title").regex(/INTERN/i);
      } else if (filters.exp_level === "FULLTIME") {
        query
          .where("pipeline.title")
          .not()
          .regex(/INTERN/i);
      }
    }

    if (filters.currently_working === "true") {
      query.where("pipeline.isCurrentlyWorking").equals(true); // pipeline: isCurrentlyWorking (boolean)
    }

    if (filters.startDate) {
      query.where("pipeline.startDate").gte(filters.startDate);
    }

    if (filters.endDate) {
      query.where("pipeline.endDate").lte(filters.endDate);
    }
    const profiles = await query.exec();
    if (profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }
    profiles.forEach((profile) => {
      const endDate = profile.pipeline.endDate;
      console.log(
        `Profile ID: ${profile._id}, End Date: ${endDate}`,
        typeof endDate
      );
    });
    res.json(profiles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//  GET profiles (by experience name with optional title filter)
const getPipelinesByCompany = async (req, res) => {
  const { company } = req.params; // company = company name
  const { title, school, exp_level, currently_working } = req.body;
  const companyDocument = await Company.findOne({
    name: company.toLowerCase(),
  });

  if (!companyDocument) {
    return res.status(404).json({ error: "Company not found." });
  }
  const query = { "pipeline.companyId": companyDocument._id }; // query by company id, no longer by company name

  if (title) {
    query["pipeline.title"] = title;
  }
  if (school) {
    query["school"] = school;
  }
  if (exp_level) {
    if (exp_level === "intern") {
      query["pipeline.title"] = { $regex: /intern/i }; // Match titles containing "intern"
    } else if (exp_level === "fulltime") {
      query["pipeline.title"] = { $not: { $regex: /intern/i } };
    }
  }

  if (currently_working === true) {
    query["pipeline.endDate"] = null;
  }

  try {
    const profiles = await Profile.find(query);
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
/** 
SoftMatch Example: Person A works at AAPL, BB and Person B works at BB
Searching for [AAPL,BB] w/ SoftMatch==true returns {A,B}, and SoftMatch==false {A}
 */
const getMultiplePipelinesByCompany = async (req, res) => {
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
      query = { "pipeline.companyId": { $in: companyIdArray } }; // Matches any pipeline that includes any company in the array
    } else {
      query = { "pipeline.companyId": { $all: companyIdArray } }; // Matches any pipeline that includes all companies in the array
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
  const { employeeId } = req.params;
  const { index, clear } = req.body;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(404).json({ error: "No such Profile." });
  }

  const profile = await Profile.findOne({ _id: employeeId });

  if (!profile) {
    return res.status(404).json({ error: "No such Profile." });
  }

  // Create a copy of the current pipeline
  const newPipeline = [...profile.pipeline];
  let removedExperience; // Declare without 'const'

  if (clear === true) {
    removedExperience = [...newPipeline]; // Assign without redeclaring
    newPipeline.length = 0; // Clear all experiences for the profile
    // Clear the associations in related companies (assuming employees array)
    const relatedCompanies = await Company.find({ employees: employeeId });
    for (const company of relatedCompanies) {
      const employeeIndex = company.employees.indexOf(employeeId);
      if (employeeIndex !== -1) {
        company.employees.splice(employeeIndex, 1);
        await company.save();
      }
    }
  } else if (index !== undefined) {
    // Remove a specific experience based on the provided index
    if (index >= 0 && index < newPipeline.length) {
      removedExperience = newPipeline.splice(index, 1)[0];
      const company = await Company.findOne({
        _id: removedExperience.companyId,
      });
      if (company) {
        // remove employee from company's employee array
        const employeeIndex = company.employees.indexOf(employeeId);
        if (employeeIndex !== -1) {
          company.employees.splice(employeeIndex, 1);
          await company.save();
        }
      }
    } else {
      return res.status(400).json({ error: "Invalid index provided." });
    }
  } else {
    return res.status(400).json({ error: "Invalid request." });
  }

  // Update the profile's pipeline in the database
  await Profile.findOneAndUpdate(
    { _id: employeeId },
    {
      pipeline: newPipeline,
    }
  );

  //* Logs
  console.log(
    `Experience ${removedExperience.displayName} removed from employee: ${employeeId}`
  );
  console.log(newPipeline);

  res.status(200).json(removedExperience);
};

// ADD an experience to Pipeline
const addExperience = async (req, res) => {
  const { employeeId } = req.params;
  const {
    index,
    companyName,
    title,
    startDate,
    endDate,
    isIndefinite,
    rating,
  } = req.body;

  try {
    // Validate profile ID
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new Error("No such Profile.");
    }

    // Find the profile by ID
    const profile = await Profile.findOne({ _id: employeeId });
    if (!profile) {
      throw new Error("No such Profile.");
    }

    const lowercaseCompanyName = companyName.toLowerCase();

    let companyDoc = await Company.findOne({ name: lowercaseCompanyName }); // Get Company Id
    if (companyDoc) {
      // Company already exists, check for duplicates
      const companyId = companyDoc._id;

      const isDuplicateExperience = profile.pipeline.some((experience) => {
        // Check for duplicate experiences
        return (
          companyId.toString() === experience.companyId.toString() &&
          title === experience.title &&
          new Date(startDate).toString() ===
            new Date(experience.startDate).toString() &&
          new Date(endDate).toString() ===
            new Date(experience.endDate).toString()
        );
      });
      if (isDuplicateExperience) {
        throw new Error("Experience already exists.");
      }

      // If the employee is not already in the company's employee list, add them
      if (!companyDoc.employees.includes(employeeId)) {
        companyDoc.employees.push(employeeId);
        await companyDoc.save();
      }
    } else {
      // Create new company
      const newCompany = new Company({ name: lowercaseCompanyName });
      companyDoc = await newCompany.save();
      companyDoc.employees.push(employeeId);
      await companyDoc.save();
    }

    const companyId = companyDoc._id;
    // Create new pipeline + experience
    const newPipeline = [...profile.pipeline];
    const newExperience = {
      companyId: companyId,
      companyName: lowercaseCompanyName,
      title: title,
      startDate: startDate,
      endDate: endDate,
      isIndefinite: isIndefinite,
      rating: rating,
    };

    // If no index, push to end of pipeline; else insert at index
    if (!index) {
      newPipeline.push(newExperience);
    } else {
      newPipeline.splice(index, 0, newExperience);
    }

    // Update pipeline in db
    await Profile.findOneAndUpdate(
      { _id: employeeId },
      {
        pipeline: newPipeline,
      }
    );

    const successMessage = `Successfully added "${title}" at "${companyName}" experience from "${formatDate(
      startDate
    )}" to "${formatDate(endDate)}" to ${profile.firstName} ${
      profile.lastName
    }`;

    //* Logs
    console.log(successMessage);
    console.log(newPipeline);

    res.status(200).json({ message: successMessage });
  } catch (error) {
    // Handle errors centrally
    res.status(400).json({ error: error.message });
  }
};

// Function to format date in "M/D/YY" format
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  return `${month}/${day}/${year}`;
}

module.exports = {
  getPipeline,
  getProfiles,
  getPipelinesByUniversity,
  getPipelinesByCompany,
  getMultiplePipelinesByCompany,
  getRandomPipelines,
  removeExperience,
  addExperience,
};
