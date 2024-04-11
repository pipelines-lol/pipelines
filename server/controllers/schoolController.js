const fetch = require("node-fetch");
const School = require("../models/schoolModel");

const createSchool = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "No company name given." });
  }

  try {
    const {
      name,
      domains,
      state_province,
      country,
      alpha_two_code,
      web_pages,
    } = req.body; //pull school values from the request body

    const newSchool = new School({
      name: name,
      domains: domains,
      state_province: state_province,
      country: country,
      alpha_two_code: alpha_two_code,
      web_pages: web_pages,
    }); // Create New School object

    const savedSchool = await newSchool.save();
    console.log("New School Created: ", savedSchool.name);
    console.log(savedSchool);
  } catch (err) {
    console.error(err);
    res.status(500).json();
  }
};

const searchSchools = async (req, res) => {
  const { query } = req.params;

  try {
    // Create a regular expression to find documents that start with the query
    const regex = new RegExp("^" + query, "i"); // "i" for case-insensitive search

    // Find companies that match the regex
    const schools = await School.find({ name: regex });

    res.status(200).json(schools);
  } catch (err) {
    return res.status(400).json({ error: "Failed to retrieve schools" });
  }
};

const getSchool = async (req, res) => {
  const { id } = req.params;
  try {
    const school = await School.findOne({ _id: id });
    if (!school) res.status(404).json({ message: "School not found" });
    res.status(200).json(school);
  } catch (err) {
    return res.status(400).json({ error: "Failed to retrieve school " });
  }
};

const deleteSchool = async (req, res) => {
  const { id } = req.params;
  const result = await School.findOneAndDelete({
    _id: id,
  });

  if (!result) {
    return res.status(404).json({ error: "No such school." });
  }

  console.log("School Deleted: ", id);
  console.log(result);

  res.status(200).json(result);
};

module.exports = {
  searchSchools,
  getSchool,
  deleteSchool,
  createSchool,
};
