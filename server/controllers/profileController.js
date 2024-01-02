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

// DELETE a profile
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
    const { firstName, lastName, linkedin, anonymous, pipeline, created } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    const profile = await Profile.findOneAndUpdate({ _id: id }, {
        firstName, 
        lastName,
        linkedin, 
        anonymous,
        pipeline,
        created
    })

    if (!profile) {
        return res.status(404).json({error: 'No such Profile.'})
    }

    res.status(200).json(profile)
}

module.exports = {
    getProfiles, 
    getProfile,
    deleteProfile,
    updateProfile,
}