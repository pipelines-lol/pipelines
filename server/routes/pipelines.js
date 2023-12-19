const express = require('express')
const {
    getPipeline,
    getPipelinesByCompany,
    removeExperience,
    addExperience,
} = require('../controllers/pipelineController')

const router = express.Router()

// GET a single pipeline (by id)
router.get('/:id', getPipeline)

// GET pipelines (by company name)
router.get('/', getPipelinesByCompany)

// UPDATE (remove) experience from pipeline
router.patch('/remove/:id', removeExperience)

// UPDATE (add) experience to pipeline
router.patch('/add/:id', addExperience)

module.exports = router;