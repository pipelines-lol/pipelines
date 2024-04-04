const axios = require("axios");
const jwt = require("jsonwebtoken");

const getEmailFromToken = async (token) => {
  try {
    // decode mother jwt
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // extract linkedin token from mother jwt
    const linkedinToken = decodedToken.linkedinToken;

    // this request gets basic profile info from linkedin token
    const { data } = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${linkedinToken}`,
      },
    });

    // get the email from linkedin data
    return data.email;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const verifyUser = async (req, res, next) => {
  const { email } = req.body;

  // Log the requested URL
  console.log("Requested URL:", req.originalUrl);

  // verify token has linkedin token with
  // requested user's email
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
    const emailFromToken = await getEmailFromToken(token);

    if (!emailFromToken) {
      throw new Error("Invalid token.");
    }

    // compare emails and break out if they dont match
    if (email !== emailFromToken) {
      return res.status(403).json({
        msg: "Invalid Linkedin token for user login.",
      });
    }
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired Linkedin token." });
  }

  next();
};

module.exports = {
  verifyUser,
  getEmailFromToken,
};
