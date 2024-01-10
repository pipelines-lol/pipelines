const express = require('express')
const {
    recognizeImage
} = require('../controllers/imageModerationController')

const router = express.Router()

const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// POST a check of a single image
router.post('/', upload.single('pfp'), recognizeImage)

module.exports = router;