const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  companyName: String, // Store as lowercase in the database
  title: String,
  startDate: Date,
  endDate: Date,
  isIndefinite: Boolean,
});

module.exports = mongoose.model("Offer", OfferSchema);
