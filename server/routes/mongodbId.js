const express = require('express')
const {
    checkMongodbId
} = require('../controllers/mongodbIdController')

const router = express.Router()

// GET a check of a single id
router.get('/:id', checkMongodbId)

module.exports = router;