const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.login(email, password);

    // create token
    const token = createToken(admin._id);

    res.status(200).json({ _id: admin._id, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginAdmin,
};
