const express = require('express')
const {
    getPfp,
    updatePfp
} = require('../controllers/pfpController')

const router = express.Router()

const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// GET a single pfp (by id)
router.get('/:id', getPfp)

// UPDATE a single pfp (by id)
router.patch('/:id', upload.single('pfp'), updatePfp);

module.exports = router;