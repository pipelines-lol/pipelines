const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const jwt = require("jsonwebtoken");
const axios = require("axios");

const { HOMEPAGE } = require("../utils/apiRoutes");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.login(email);

    let profile;

    // check to see if a profile has been made
    try {
      profile = await Profile.getByUserId(user._id);
    } catch (error) {
      // no profile created yet
      // create new profile
      profile = await Profile.create({
        userId: user._id,
        firstName: "",
        lastName: "",
        username: "",
        linkedin: "",
        pfp: "",
        position: "",
        location: "",
        anonymous: false,
        school: "",
        pipeline: [],
        offers: [],
        created: false,
      });

      // update profileId on user
      await User.updateOne({ _id: user._id }, { profileId: profile._id });
    }

    // create token
    const token = createToken(user._id);

    res.status(200).json({
      email,
      _id: user._id,
      profileId: profile._id,
      profileCreated: profile.created,
      username: profile.username,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getLinkedinInfoWithCode = async (req, res) => {
  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
  const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
  const REDIRECT_URI = HOMEPAGE;

  try {
    const code = req.headers.auth_code;
    if (!code) throw new Error("No code provided");
    console.log("Code gotten succesfully");

    // This request gets access_token
    let accessTokenResponse = await axios.get(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`
    );

    // This request gets user info from access_token (given in the headers of the request)
    let userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessTokenResponse.data.access_token}`,
        },
      }
    );

    // This request gets profile info from access_token (given in the headers of the request)
    let userBasicProfileResponse = await axios.get(
      "https://api.linkedin.com/v2/me",
      {
        headers: {
          Authorization: `Bearer ${accessTokenResponse.data.access_token}`,
        },
      }
    );

    // Get the "vanityName" value from userBasicProfileResponse
    const vanity_name = userBasicProfileResponse.data.vanityName;

    // Attach the "vanityName" value to the userInfoResponse object as "vanity_name"
    userInfoResponse.data.vanity_name = vanity_name;

    //* Logs
    console.log(`User logged in: ${vanity_name}`);
    console.log(userInfoResponse.data);

    return res.status(200).json(userInfoResponse.data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  getLinkedinInfoWithCode,
};
