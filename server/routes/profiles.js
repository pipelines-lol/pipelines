const express = require('express')
const {
    getProfiles, 
    getProfile,
    createProfile,
    deleteProfile,
    updateProfile,
} = require('../controllers/profileController')

const router = express.Router()

// GET all profiles
router.get('/', getProfiles)

// GET a single profile
router.get('/:id', getProfile)

// POST a profile
router.post('/', createProfile)

// DELETE a profile
router.delete('/:id', deleteProfile)

// UPDATE a profile
router.patch('/:id', updateProfile)

module.exports = router;