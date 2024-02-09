const express = require("express");
const {
  createOffer,
  updateOffer,
  deleteOffer,
  getOffer,
  getAllOffers,
} = require("../controllers/offerController.js");

const router = express.Router();

// CREATE an offer for a profile
router.post("/:profileId", createOffer);

// UPDATE an offer for a profile
router.put("/:profileId/:offerId", updateOffer);

// DELETE an offer for a profile
router.delete("/:profileId/:offerId", deleteOffer);

// GET an offer for a profile
router.get("/:profileId/:offerId", getOffer);

// GET all offers for a profile
router.get("/:profileId", getAllOffers);

module.exports = router;
