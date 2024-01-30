const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//jobModel.js
const BaseJobSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" }, // Reference to CompanySchema
  companyName: String,
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
