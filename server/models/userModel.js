const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  profileId: String
}, { timestamps: true })

userSchema.statics.login = async function (email) {
  // validation
  if (!email) {
      throw new Error('Email is required.');
  }

  let user = await this.findOne({ email });

  if (!user) {
      user = await this.create({ email, profileId: null });
  }

  return user;
};


module.exports = mongoose.model('User', userSchema)