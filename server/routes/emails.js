const express = require("express");
const {
  addToNewsletter,
  addEmail,
  getEmails,
  getEmailById,
  removeEmail,
  removeEmailById,
} = require("../controllers/emailController");

const router = express.Router();

// send email + add to newsletter
router.post("/send", addToNewsletter);

// CREATE an email
router.post("/", addEmail);

// GET emails
router.get("/", getEmails);

// GET an email by id
router.get("/:id", getEmailById);

// DELETE an email
router.delete("/:email", removeEmail);

// DELETE an email by id
router.delete("/:id", removeEmailById);

module.exports = router;
