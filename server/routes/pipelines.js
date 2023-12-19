const express = require('express')
const {
    getPipeline,
    removeExperience,
    addExperience,
} = require('../controllers/pipelineController')

const router = express.Router()

// GET a single profile
router.get('/:id', getPipeline)

// UPDATE (remove) experience from pipeline
router.patch('/remove/:id', removeExperience)

// UPDATE (add) experience to pipeline
router.patch('/add/:id', addExperience)

module.exports = router;