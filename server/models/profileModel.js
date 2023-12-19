const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Experience = new mongoose.Schema({
    company: String,
    title: String,
    date: String
});

const profileSchema = new Schema({
    userId: String, 
    name: String,
    linkedin: String,
    anonymous: Boolean,
    pipeline: [Experience]
}, { timestamps: true })

module.exports = mongoose.model('Profile', profileSchema)