const Profile = require("../models/profileModel");
const Company = require("../models/companyModel");
const mongoose = require("mongoose");

// CREATE an offer for a profile
const createOffer = async (req, res) => {
  const { profileId } = req.params;
  const { companyName, title, startDate, endDate, isIndefinite } = req.body;

  try {
    // Validate profile ID
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      throw new Error("Invalid Profile ID.");
    }

    // Find the profile by ID
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found.");
    }

    const company = await Company.findOne({ name: companyName.toLowerCase() });
    if (!company) {
      throw new Error("Company not found.");
    }

    // Ensure that the end date is after the start date
    if (new Date(endDate) <= new Date(startDate)) {
      throw new Error("End date must be after the start date.");
    }

    // Ensure that if isIndefinite is false, end date is present, and vice versa
    if ((isIndefinite && endDate) || (!isIndefinite && !endDate)) {
      throw new Error("End date and isIndefinite must be mutually exclusive.");
    }

    // Create the offer
    const newOffer = {
      companyId: company._id,
      companyName: companyName.toLowerCase(),
      title,
      startDate,
      endDate,
      isIndefinite,
    };

    console.log("New Offer:", newOffer);

    // Save the offer to the profile's offers array
    profile.offers.push(newOffer);
    await profile.save();

    res
      .status(201)
      .json({ message: "Offer created successfully.", offer: newOffer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE an offer for a profile
const updateOffer = async (req, res) => {
  const { profileId } = req.params;
  const { offerId } = req.query; // Extract offerId from query params
  const { newCompanyId, newTitle, newStartDate, newEndDate } = req.body;

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found.");
    }

    // Find the offer within the profile's offers array
    const offer = profile.offers.find((o) => o._id.toString() === offerId);
    if (!offer) {
      throw new Error("Offer not found.");
    }

    // Update the offer fields if provided in the query parameters
    if (newCompanyId) offer.companyId = newCompanyId;
    if (newTitle) offer.title = newTitle;
    if (newStartDate) offer.startDate = newStartDate;
    if (newEndDate) offer.endDate = newEndDate;

    // Save the updated profile
    await profile.save();

    res.status(200).json({ message: "Offer updated successfully.", offer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE an offer from a profile
const deleteOffer = async (req, res) => {
  const { profileId } = req.params;
  const { offerId } = req.query; // Extract offerId from query params

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found.");
    }

    // Filter out the offer to be deleted
    profile.offers = profile.offers.filter((o) => o._id.toString() !== offerId);

    // Save the updated profile
    await profile.save();

    res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET an offer for a profile
const getOffer = async (req, res) => {
  const { profileId } = req.params;
  const { offerId } = req.query; // Extract offerId from query params

  try {
    // Validate profile ID
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      throw new Error("Invalid Profile ID.");
    }

    // Find the profile by ID
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found.");
    }

    // Find the offer within the profile's offers array
    const offer = profile.offers.find((o) => o._id.toString() === offerId);
    if (!offer) {
      throw new Error("Offer not found.");
    }

    res.status(200).json({ offer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all offers for a profile
const getAllOffers = async (req, res) => {
  const { profileId } = req.params;

  try {
    // Validate profile ID
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      throw new Error("Invalid Profile ID.");
    }

    // Find the profile by ID
    const profile = await Profile.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found.");
    }

    res.status(200).json({ offers: profile.offers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOffer,
  updateOffer,
  deleteOffer,
  getOffer,
  getAllOffers,
};
