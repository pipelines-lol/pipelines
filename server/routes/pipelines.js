const express = require("express");
const {
  getPipeline,
  getPipelinesByUniversity,
  getPipelinesByCompany,
  getMultiplePipelinesByCompany,
  getRandomPipelines,
  removeExperience,
  addExperience,
  getProfiles,
} = require("../controllers/pipelineController");

const read = express.Router();
const write = express.Router();

// GET a single pipeline (by id)
read.get("/get/:employeeId", getPipeline);

// GET profile (for search), with filters
read.get("/search/", getProfiles);

// GET pipelines (by company name)
read.get("/search/company/:company", getPipelinesByCompany);

// GET pipelines (by university name)
read.get("/search/university/:university", getPipelinesByUniversity);

// GET pipelines (by MULTIPLE company names)
read.get("/search/multi", getMultiplePipelinesByCompany);

// GET random pipelines
read.get("/random/:size", getRandomPipelines);

// UPDATE (remove) experience from pipeline
write.patch("/remove/:employeeId", removeExperience);

// UPDATE (add) experience to pipeline
write.patch("/add/:employeeId", addExperience);

module.exports = {
  read,
  write,
};
