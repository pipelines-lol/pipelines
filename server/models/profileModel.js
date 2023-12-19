const mongoose = require('mongoose')
const random = require('mongoose-simple-random');

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
profileSchema.plugin(random);

module.exports = mongoose.model('Profile', profileSchema)