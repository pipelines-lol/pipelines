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
    firstName: String,
    lastName: String,
    username: String,
    linkedin: String,
    position: String,
    location: String,
    anonymous: Boolean,
    pipeline: [Experience],
    created: Boolean
}, { timestamps: true })
profileSchema.plugin(random);

// static methods
profileSchema.statics.getByUserId = async function (userId) {
    const profile = await this.findOne({ userId })

    if (!profile) {
        throw Error(`Invalid user ID.`)
    }

    return profile
}

module.exports = mongoose.model('Profile', profileSchema)