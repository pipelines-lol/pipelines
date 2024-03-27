const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const emailSchema = new Schema(
  {
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
