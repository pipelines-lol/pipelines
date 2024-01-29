const mongoose = require("mongoose");
const random = require("mongoose-simple-random");
const { ExperienceSchema, OfferSchema } = require("./jobModel");

const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    userId: String,
    firstName: String,
    lastName: String,
    username: String,
    linkedin: String,
    pfp: String,
    position: String,
    location: String,
    anonymous: Boolean,
    school: String,
    pipeline: [ExperienceSchema],
    offers: [OfferSchema],
    created: Boolean,
  },
  { timestamps: true }
);
profileSchema.plugin(random);

// static methods
profileSchema.statics.getByUserId = async function (userId) {
  const profile = await this.findOne({ userId });

  if (!profile) {
    throw Error(`Invalid user ID.`);
  }

  return profile;
};

module.exports = mongoose.model("Profile", profileSchema);
