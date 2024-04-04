const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

adminSchema.statics.login = async function (email, password) {
  // validation
  if (!email) {
    throw new Error("Email is required.");
  }

  let user = await this.findOne({ email });

  if (!user) {
    throw new Error("Invalid email.");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error(`Incorrect password.`);
  }

  return user;
};

module.exports = mongoose.model("Admin", adminSchema);
