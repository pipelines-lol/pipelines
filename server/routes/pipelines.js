const express = require('express')
const {
    getPipeline,
    getPipelinesByCompany,
    getRandomPipelines,
    removeExperience,
    addExperience,
} = require('../controllers/pipelineController')

const router = express.Router()

// GET a single pipeline (by id)
router.get('/get/:id', getPipeline)

// GET pipelines (by company name)
router.get('/search/:company', getPipelinesByCompany)

// GET random pipelines
router.get('/random/:size', getRandomPipelines)

// UPDATE (remove) experience from pipeline
router.patch('/remove/:id', removeExperience)

// UPDATE (add) experience to pipeline
router.patch('/add/:id', addExperience)

module.exports = router;