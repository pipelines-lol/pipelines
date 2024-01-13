const User = require('../models/userModel')
const Profile = require('../models/profileModel')

const jwt = require('jsonwebtoken')
const axios = require('axios')

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

const getLinkedinInfoWithCode = async (req, res) => {
    const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
    const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
    const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI

    try {
        const code = req.headers.auth_code
        if (!code) throw new Error('No code provided')

        // This request gets access_token
        let accessTokenResponse = await axios.get(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`)

        // This request gets user info from access_token (given in the headers of the request)
        let userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessTokenResponse.data.access_token}`
            }
        })

        return res.status(200).json(userInfoResponse.data)

    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error.message })

    }
}

module.exports = {
    loginUser,
    signupUser,
    getLinkedinInfoWithCode
}