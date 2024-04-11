const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  domains: [String],
  state_province: String,
  country: String,
  alpha_two_code: String,
  webpages: [String],
  schoolTally: {
    type: Map,
    of: Number,
  },
  rank: Number,
});

module.exports = mongoose.model("School", schoolSchema);
