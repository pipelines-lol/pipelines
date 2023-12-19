const User = require('../models/userModel')
const Profile = require('../models/profileModel')
const mongoose = require('mongoose')

// GET all profiles
const getProfiles = async (req, res) => {
    const profiles = await Profile.find({}).sort({ createdAt: -1 })

    res.status(200).json(profiles)
}

// GET a single profile
const getProfile = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    const profile = await Profile.findById(id)

    if (!profile) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    res.status(200).json(profile)
}

// POST a profile
const createProfile = async (req, res) => {
    const { userId, name, linkedin } = req.body

    // verify user id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({error: 'No such User.'})
    }

    try {

        // create profile
        const profile = await Profile.create({ 
            userId: userId, 
            name: name,
            linkedin: linkedin,
            anonymous: false,
            pipeline: []
        })

        // find user associated with profile
        // and update profileId
        User.findOneAndUpdate({ _id: userId }, {
            profileId: profile._id
        })

        res.status(200).json(profile)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE a poll
const deleteProfile = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    const profile = await Profile.findOneAndDelete({ _id: id })

    if (!profile) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    res.status(200).json(profile)
}

// UPDATE a poll
const updateProfile = async (req, res) => {
    const { id } = req.params
    const { name, linkedin, anonymous } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    const profile = await Profile.findOneAndUpdate({ _id: id }, {
        name, 
        linkedin, 
        anonymous
    })

    if (!profile) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    res.status(200).json(profile)
}

module.exports = {
    getProfiles, 
    getProfile,
    createProfile,
    deleteProfile,
    updateProfile,
}