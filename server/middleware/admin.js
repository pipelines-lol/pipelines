const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");

const verifyAdminToken = async (token) => {
  try {
    // Get decoded token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the id from the decoded token
    const { _id } = decodedToken;

    // Check if an admin account exists with the provided _id
    const admin = await Admin.findById(_id);

    // Return true if an admin account exists, false otherwise
    return admin ? true : false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const verifyAdmin = async (req, res, next) => {
  // Log the requested URL
  console.log("Requested URL:", req.originalUrl);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No authorization token provided." });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ msg: "Token format is 'Bearer <token>'." });
  }

  // extract admin token from MOTHER token
  const token = tokenParts[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const adminToken = decodedToken.adminToken;

  // Verify the token has admin privileges
  if (!verifyAdminToken(adminToken)) {
    return res.status(403).json({
      msg: "User does not have the required privileges for this request.",
    });
  }

  next();
};

module.exports = {
  verifyAdminToken,
  verifyAdmin,
};
