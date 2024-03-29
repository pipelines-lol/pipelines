const jwt = require("jsonwebtoken");

const generateToken = (sessionId) => {
  const token = jwt.sign(
    {
      id: sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

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
    return res.status(400).json({ msg: "Invalid or expired token." });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
