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

const router = express.Router();

// GET a single pipeline (by id)
router.get("/get/:employeeId", getPipeline);

// GET profile (for search), with filters
router.get("/search/", getProfiles);

// GET pipelines (by company name)
router.get("/search/company/:company", getPipelinesByCompany);

// GET pipelines (by university name)
router.get("/search/university/:university", getPipelinesByUniversity);

// GET pipelines (by MULTIPLE company names)
router.get("/search/multi", getMultiplePipelinesByCompany);

// GET random pipelines
router.get("/random/:size", getRandomPipelines);

// UPDATE (remove) experience from pipeline
router.patch("/remove/:employeeId", removeExperience);

// UPDATE (add) experience to pipeline
router.patch("/add/:employeeId", addExperience);



module.exports = router;
