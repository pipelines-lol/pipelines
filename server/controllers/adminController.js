const Admin = require("../models/adminModel");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.login(email, password);
    res.status(200).json({ email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginAdmin,
};
