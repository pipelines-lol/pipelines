const User = require('../models/userModel')
const Profile = require('../models/profileModel')
const jwt = require('jsonwebtoken')

const { Authorization, Redirect } = require('../helpers/authHelper')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)

        const profile = await Profile.getByUserId(user._id)

        // create token
        const token = createToken(user._id)

        res.status(200).json({ email, _id: user._id, profileId: profile._id, profileCreated: profile.created, username: profile.username, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.signup(email, password)

        // create new profile
        const profile = await Profile.create({ 
            userId: user._id, 
            name: '',
            username: '',
            linkedin: '',
            position: '',
            pfp: '',
            location: '',
            anonymous: false,
            pipeline: [],
            created: false
        })

        // update profileId on user
        await User.updateOne({ _id: user._id }, { profileId: profile._id })

        // create token
        const token = createToken(user._id)

        res.status(200).json({ email, _id: user._id, profileId: profile._id, profileCreated: profile.created, username: profile.username, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

const authorizeLinkedinUser = async (req, res) => {
    return res.redirect(Authorization())
}

const redirectLinkedinUser = async (req, res) => {
    const code = req.query.code

    return res.json(Redirect(code))
}

module.exports = {
    loginUser,
    signupUser,
    authorizeLinkedinUser,
    redirectLinkedinUser
}