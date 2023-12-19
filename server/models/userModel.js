const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profileId: String
}, { timestamps: true })

// static methods
userSchema.statics.signup = async function (email, password) {

  // validation
  if (!email || !password) {
    throw Error(`All fields must be filled.`)
  }
  if (!validator.isEmail(email)) {
    throw Error(`Email is invalid.`)
  }
  
  // Enable when strong passwords are needed.
  // if (!validator.isStrongPassword(password)) {
  //   throw Error(`Password is not strong enough.`)
  // }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error(`Email already in use.`)
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash, profileId: null })

  return user
}

userSchema.statics.login = async function (email, password) {

  // validation
  if (!email || !password) {
    throw Error(`All fields must be filled.`)
  }

  const user = await this.findOne({ email })

  if (!user) {
    throw Error(`Incorrect email.`)
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error(`Incorrect password.`)
  }

  return user;
}


module.exports = mongoose.model('User', userSchema)