const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const axios = require("axios");

const { HOMEPAGE } = require("../utils/apiRoutes");
const { getEmailFromToken } = require("../middleware/user");

const verifyToken = async (req, res) => {
  const { email, token } = req.body;

  const emailFromToken = await getEmailFromToken(token);

  const isVerified = email === emailFromToken;

  res.status(200).json({ isVerified });
};

const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // login user
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

// getLinkedinInfo helpers
const getLinkedinInfoWithCode = async (res, code) => {
  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
  const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
  const REDIRECT_URI = HOMEPAGE;

  try {
    if (!code) throw new Error("No code provided");
    console.log("Code received successfully.");

    // This request gets access_token
    const tokenResponse = await axios.get(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`
    );

    const refreshToken = tokenResponse.data.refresh_token;
    const accessToken = tokenResponse.data.access_token;

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
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Get the "vanityName" value from userBasicProfileResponse
    const vanity_name = userBasicProfileResponse.data.vanityName;

    // Attach the "vanityName" value to the userInfoResponse object as "vanity_name"
    userInfoResponse.data.vanity_name = vanity_name;

    // Attach the tokens from the linkedin api to the userInfo
    userInfoResponse.data.token = accessToken;
    userInfoResponse.data.refresh_token = refreshToken;

    //* Logs
    console.log(`User logged in: ${vanity_name}`);
    console.log(userInfoResponse.data);

    const data = userInfoResponse.data;
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

const getLinkedinInfoWithToken = async (res, token) => {
  try {
    if (!token) throw new Error("No token provided");
    console.log("Token received successfully.");

    // decode mother jwt
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // extract linkedin token from mother jwt
    const linkedinToken = decodedToken.linkedinToken;

    // This request gets user info from access_token (given in the headers of the request)
    let userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${linkedinToken}`,
        },
      }
    );

    // This request gets profile info from access_token (given in the headers of the request)
    let userBasicProfileResponse = await axios.get(
      "https://api.linkedin.com/v2/me",
      {
        headers: {
          Authorization: `Bearer ${linkedinToken}`,
        },
      }
    );

    // Get the "vanityName" value from userBasicProfileResponse
    const vanity_name = userBasicProfileResponse.data.vanityName;

    // Attach the "vanityName" value to the userInfoResponse object as "vanity_name"
    userInfoResponse.data.vanity_name = vanity_name;

    //* Logs
    console.log(`User fetched linkedin info: ${vanity_name}`);
    console.log(userInfoResponse.data);

    const data = userInfoResponse.data;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const getLinkedinInfo = async (req, res) => {
  const { code } = req.query;

  if (code) return getLinkedinInfoWithCode(res, code);
  else {
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

    return getLinkedinInfoWithToken(res, token);
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
  verifyToken,
  getLinkedinInfo,
  refreshLinkedinToken,
};
