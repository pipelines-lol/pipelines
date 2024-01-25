const express = require("express");
const {
  getPipeline,
  getPipelinesByUniversity,
  getPipelinesByCompany,
  getMultiplePipelinesByCompany,
  getRandomPipelines,
  removeExperience,
  addExperience,
} = require("../controllers/pipelineController");

const router = express.Router();

// GET a single pipeline (by id)
router.get("/get/:id", getPipeline);

// GET pipelines (by company name)
router.get("/search/company/:company", getPipelinesByCompany); // Danny would reccomend changing this to /search/company/:company

// GET pipelines (by university name) (TODO: please let Danny know if you disagree with this route)
router.get("/search/university/:university", getPipelinesByUniversity);

// GET pipelines (by MULTIPLE company names)
router.get("/search/multi", getMultiplePipelinesByCompany);

// GET random pipelines
router.get("/random/:size", getRandomPipelines);

// UPDATE (remove) experience from pipeline
router.patch("/remove/:id", removeExperience);

// UPDATE (add) experience to pipeline
router.patch("/add/:id", addExperience);

module.exports = router;
