const jwt = require("jsonwebtoken");

const generateToken = (sessionId, linkedinToken) => {
  // Create payload object with sessionId
  const payload = { id: sessionId };

  // If profileId exists, include it in the payload
  if (linkedinToken) {
    payload.linkedinToken = linkedinToken;
  }

  // Generate token with payload
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No authorization token provided." });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ msg: "Token format is 'Bearer <token>'." });
  }

  const token = tokenParts[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
