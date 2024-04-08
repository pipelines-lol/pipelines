// models
const Email = require("../models/emailModel");

// resend
const Resend = require("resend").Resend;
const resend = new Resend(process.env.RESEND_API_KEY);
const supportEmail = process.env.RESEND_EMAIL;

// emails
const { welcome } = require("../emails/welcome");

const addToNewsletter = async (req, res) => {
  const { email } = req.body;

  // check if email already subscribed
  const existingEmail = await Email.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({ message: "Email already subscribed." });
  }

  // send welcome email
  const { data, error } = await resend.emails.send({
    from: supportEmail,
    to: email,
    subject: "Welcome to Our Newsletter!",
    html: welcome,
  });

  if (error) {
    return res.status(400).json({ error });
  }

  // add email to mongodb
  const newEmail = new Email({ email });
  await newEmail.save();

  //* Logs
  console.log(`Email added to newsletter: ${email}`);

  res.status(200).json({ data });
};

const sendEmails = async (req, res) => {
  const { earlyAccess } = req.query;
  const { subject, body } = req.body;

  try {
    let query = {}; // Default query to fetch all emails
    if (earlyAccess === "true") {
      // If earlyAccess is true, add additional condition to the query
      query = { earlyAccess: true };
    }

    // Fetch emails from MongoDB based on the query
    const emailsToSend = await Email.find(query);

    // Loop through the emails and send them
    for (const email of emailsToSend) {
      // send email logic (e.g., using a third-party service like SendGrid)
      const { data, error } = await resend.emails.send({
        from: supportEmail,
        to: email.email,
        subject: subject,
        html: body,
      });

      if (error) {
        console.error(`Error sending email to ${email.email}:`, error);
      } else {
        console.log(`Email sent successfully to ${email.email}`);
      }
    }

    res.status(200).json({ message: "Emails sent successfully." });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Failed to send emails." });
  }
};

// email model
// Add an email
const addEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const newEmail = new Email({ email });
    const savedEmail = await newEmail.save();

    //* Logs
    console.log(`New email added to MongoDB: ${email}`);
    console.log(savedEmail);

    res.status(201).json(savedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read all emails
const getEmails = async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a singular email by ID
const getEmailById = async (req, res) => {
  try {
    const { id } = req.params;
    const email = await Email.findById(id);
    if (email) {
      res.status(200).json(email);
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove an email by its email address
const removeEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const deletedEmail = await Email.findOneAndDelete({ email: email });
    if (deletedEmail) {
      //* Logs
      console.log(`Email removed from MongoDB: ${email}`);
      console.log(deletedEmail);

      res.status(200).json({ message: "Email removed" });
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove an email by id
const removeEmailById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmail = await Email.findByIdAndDelete(id);
    if (deletedEmail) {
      //* Logs
      console.log(`Email removed from MongoDB (by ID): ${id}`);
      console.log(deletedEmail);

      res.status(200).json({ message: "Email removed" });
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToNewsletter,
  sendEmails,
  addEmail,
  getEmails,
  getEmailById,
  removeEmail,
  removeEmailById,
};
