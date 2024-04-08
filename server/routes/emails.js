const express = require("express");
const {
  addToNewsletter,
  sendEmails,
  addEmail,
  getEmails,
  getEmailById,
  removeEmail,
  removeEmailById,
} = require("../controllers/emailController");

const read = express.Router();
const write = express.Router();

// send email + add to newsletter
read.post("/newsletter", addToNewsletter);

// SEND emails
write.post("/send", sendEmails);

// CREATE an email
write.post("/", addEmail);

// GET emails
write.get("/", getEmails);

// GET an email by id
write.get("/:id", getEmailById);

// DELETE an email
write.delete("/:email", removeEmail);

// DELETE an email by id
write.delete("/:id", removeEmailById);

module.exports = {
  read,
  write,
};
