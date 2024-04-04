const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");

const verifyToken = async (token) => {
  try {
    // get decoded token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // extract email and password of user
    const { email, password } = decodedToken;

    // login admin user
    await Admin.login(email, password);

    // return if an admin account exists or not
    return true;
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

  const token = tokenParts[1];

  // Verify the token has admin privileges
  if (!verifyToken(token)) {
    return res.status(403).json({
      msg: "User does not have the required privileges for this request.",
    });
  }

  next();
};

module.exports = {
  verifyAdmin,
};
