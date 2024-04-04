const axios = require("axios");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileModel");

const getProfileIdFromToken = async (token) => {
  try {
    // get decoded token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // extract linkedin token and use this as user identifier
    const linkedinToken = decodedToken.linkedinToken;

    // this request gets basic profile info from linkedin token
    const { data } = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${linkedinToken}`,
      },
    });

    const vanityName = data.vanityName;

    // Query MongoDB model to find profile with matching vanity name
    const profile = await Profile.findOne({
      linkedin: `https://linkedin.com/in/${vanityName}`,
    });

    // extract id from mongo object
    if (profile) {
      const profileId = profile._id.toString();

      // return profile id
      return profileId;
    } else {
      throw Error(`Profile not found: ${vanityName}`);
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

const verifyProfile = async (req, res, next) => {
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

  // Extract the ID from the end of the URL path
  const idParts = req.originalUrl.split("/");
  const requestedProfileId = idParts[idParts.length - 1];

  const profileIdFromToken = await getProfileIdFromToken(token);

  if (!profileIdFromToken) {
    return res.status(401).json({ msg: "Invalid or expired token." });
  }

  if (profileIdFromToken !== requestedProfileId) {
    return res.status(403).json({
      msg: "Profile ID in the token does not match the requested profile ID.",
    });
  }

  next();
};

module.exports = {
  verifyProfile,
};
