const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BaseJobSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  companyName: String, // Store as lowercase in the database
  title: String,
  startDate: Date,
  endDate: Date,
  totalCompensation: String,
});

const ExperienceSchema = new Schema(BaseJobSchema);
const OfferSchema = new Schema(BaseJobSchema);

// Export the schemas
module.exports = {
  BaseJobSchema,
  ExperienceSchema,
  OfferSchema,
};
