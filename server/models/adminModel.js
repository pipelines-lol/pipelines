const mongoose = require("mongoose");
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

  if (user.password !== password) {
    throw new Error("Invalid password.");
  }

  return user;
};

module.exports = mongoose.model("Admin", adminSchema);
