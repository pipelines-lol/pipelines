const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  displayName: String,
  rating: Number,
  prevCompanies: {
    type: Map,
    of: Number,
  },
  postCompanies: {
    type: Map,
    of: Number,
  },
  tenure: Number,
  Employees: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  interns: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  ratedEmployees: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
});

module.exports = mongoose.model("Company", companySchema);
