const fetch = require("node-fetch");
const School = require("../models/schoolModel");

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
  console.log("ID: ", id);
  try {
    const school = await School.findOne({ _id: id });
    console.log("School: ", school);
    if (!school) res.status(404).json({ message: "School not found" });
    res.status(200).json(school);
  } catch (err) {
    return res.status(400).json({ error: "Failed to retrieve school " });
  }
};

module.exports = {
  searchSchools,
  getSchool,
};
