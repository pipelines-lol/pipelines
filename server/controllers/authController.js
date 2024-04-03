const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const jwt = require("jsonwebtoken");
const axios = require("axios");

const { HOMEPAGE } = require("../utils/apiRoutes");

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

    res.status(200).json({
      email,
      _id: user._id,
      profileId: profile._id,
      profileCreated: profile.created,
      username: profile.username,
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

    // This request gets access_token
    const refreshTokenResponse = await axios.get(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`
    );

    const refreshToken = refreshTokenResponse.data.refresh_token;

    // refresh the token for a new one (not sure why we have to do this)
    const url = "https://www.linkedin.com/oauth/v2/accessToken";
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });
    const accessTokenResponse = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = accessTokenResponse.data.access_token;

    // This request gets user info from access_token (given in the headers of the request)
    let userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

    return res.status(200).json({
      ...userInfoResponse.data,
      token: accessToken, // include access token in the response
      refresh_token: refreshToken, // include refresh token as well
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
};

const refreshLinkedinToken = async (req, res) => {
  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
  const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

  const { refresh_token } = req.body;

  const url = "https://www.linkedin.com/oauth/v2/accessToken";
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  getLinkedinInfoWithCode,
  refreshLinkedinToken,
};
