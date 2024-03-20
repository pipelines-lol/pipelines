const express = require('express')
const {
    searchSchools
} = require('../controllers/schoolController')

const router = express.Router()

// GET schools by query
router.get('/', searchSchools)

module.exports = router;
