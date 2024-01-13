const express = require('express')
const {
    loginUser,
    getLinkedinInfoWithCode
} = require('../controllers/authController')

const router = express.Router()

// LOGIN user
router.post('/login', loginUser)

// GET linkedin user info
router.get('/linkedin/userinfo', getLinkedinInfoWithCode)

module.exports = router;