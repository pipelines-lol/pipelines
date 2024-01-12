const express = require('express')
const {
    loginUser,
    signupUser,
    authorizeLinkedinUser,
    redirectLinkedinUser
} = require('../controllers/authController')

const router = express.Router()

// LOGIN user
router.post('/login', loginUser)

// SIGN UP user
router.post('/signup', signupUser)

// AUTHORIZE linkedin user
router.get('/linkedin/authorize', authorizeLinkedinUser)

// REDIRECT linkedin user
router.get('/linkedin/redirect', redirectLinkedinUser)

module.exports = router;