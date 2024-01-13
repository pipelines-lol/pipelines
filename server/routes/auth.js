const express = require('express')
const {
    loginUser,
    signupUser,
    getLinkedinInfoWithCode
} = require('../controllers/authController')

const router = express.Router()

// LOGIN user
router.post('/login', loginUser)

// SIGN UP user
router.post('/signup', signupUser)

// GET linkedin user info
router.get('/linkedin/userinfo', getLinkedinInfoWithCode)

module.exports = router;