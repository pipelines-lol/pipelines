const axios = require("axios");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");

const getProfileIdFromToken = async (token) => {
  try {
    // get decoded token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // extract linkedin token and use this as user identifier
    const linkedinToken = decodedToken.linkedinToken;

    // this request gets basic profile info from linkedin token
    const { data } = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${linkedinToken}`,
      },
    });
    const email = data.email;

    // Query MongoDB model to find user with matching email
    const user = await User.findOne({ email: email });
    if (!user) {
      throw Error(`User not found: ${email}`);
    }

    // Find profile using user's _id
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      throw Error(`Profile not found for user: ${user._id}`);
    }

    // extract id from profile object
    const profileId = profile._id.toString();

    // return profile id
    return profileId;
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
