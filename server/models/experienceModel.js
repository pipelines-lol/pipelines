const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  companyName: String, // Store as lowercase in the database
  title: String,
  startDate: Date,
  endDate: Date,
  isIndefinite: Boolean,
  rating: Number,
  logo: String,
});

module.exports = mongoose.model("Experience", ExperienceSchema);
