const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

adminSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error(`All fields must be filled.`);
  }
  if (!validator.isEmail(email)) {
    throw Error(`Email is invalid.`);
  }

  // Enable when strong passwords are needed.
  // if (!validator.isStrongPassword(password)) {
  //   throw Error(`Password is not strong enough.`)
  // }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error(`Email already in use.`);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const admin = await this.create({ email, password: hash });

  return admin;
};

adminSchema.statics.login = async function (email, password) {
  // validation
  if (!email) {
    throw new Error("Email is required.");
  }

  let admin = await this.findOne({ email });

  if (!admin) {
    throw new Error("Invalid email.");
  }

  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    throw new Error(`Incorrect password.`);
  }

  return admin;
};

module.exports = mongoose.model("Admin", adminSchema);
