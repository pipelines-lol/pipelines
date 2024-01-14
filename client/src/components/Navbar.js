import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

import { HOST, HOMEPAGE } from "../util/apiRoutes";
import { CLIENT_ID, SCOPE } from "../util/linkedinKeys";

import { useEffect, useState } from "react";
import { GalleryHorizontalEnd } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  // taken from linkedin api

  const [linkedinUserInfo, setUserLinkedinInfo] = useState({});
  const [pfp, setPfp] = useState(null);

  const linkedinRedirectUrl = `https://linkedin.com/oauth/v2/authorization?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${HOMEPAGE}`;

  const login = async (email) => {
    try {
      const response = await fetch(`${HOST}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        // Check if the response has JSON content
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();
          throw new Error(`${errorData.error}`);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const user = await response.json();

      
      localStorage.setItem('user', JSON.stringify(user));

      // update AuthContext
      dispatch({ type: "LOGIN", payload: user });

      // SPECIAL CASE: first time user logged in
      if (!user.profileCreated) {
        await createProfile(user.profileId);
      }

      // redirect to home
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  const logout = () => {

    setUserLinkedinInfo(null);
    
    dispatch({ type: "LOGOUT" });
    localStorage.setItem("user", null);

    navigate("/");
  };

  const createProfile = async (profileId) => {
    if (!linkedinUserInfo) {
      return;
    }

    const { given_name, family_name, locale, picture, vanity_name } = linkedinUserInfo;

    const profile = {
      firstName: given_name,
      lastName: family_name,
      location: locale.country,
      pfp: picture,
      linkedin: `https://linkedin.com/in/${vanity_name}`,
      created: true,
    };

    try {
      const response = await fetch(`${HOST}/api/profile/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        // Check if the response has JSON content
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();
          throw new Error(`${errorData.error}`);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      // set user data
      dispatch({ type: "CREATED" });

      // set new user in local storage (with profile created)
      const storedUser = JSON.parse(localStorage.getItem("user"));
      storedUser.profileCreated = true;
      localStorage.setItem("user", JSON.stringify(storedUser));

      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };


  const fetchPfp = async () => {
    if (!user || !user.profileCreated) return;

    try {
      const response = await fetch(`${HOST}/api/pfp/${user.profileId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Check if the response has JSON content
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();
          throw new Error(`${errorData.error}`);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const data = await response.json();
      setPfp(data.pfp);
    } catch (error) {
      console.error(error.message);
      setPfp(null);
    }
  };

  // checking for code after linkedin login
  useEffect(() => {
    async function checkForLinkedinToken() {
      let windowUrl = window.location.href;
      if (windowUrl.includes("code=")) {
        let codeMatch = windowUrl.match(/code=([a-zA-Z0-9_-]+)/);

        try {
          const response = await fetch(`${HOST}/api/user/linkedin/userinfo`, {
            method: "GET",
            headers: {
              auth_code: codeMatch[1],
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          setUserLinkedinInfo(data);
        } catch (error) {
          console.error(error.message);
        }
      }
    }

    checkForLinkedinToken();
  }, []);

  // check if user info is available, if so, log in user
  useEffect(() => {

    async function checkForUserInfo () {

      // edge case for old logged in users
      if (!linkedinUserInfo && user) return logout();

      if (!linkedinUserInfo) return;
      if (user) return;

      const email = linkedinUserInfo.email;
      if (email) {
        login(email);
      }
    }

    checkForUserInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, linkedinUserInfo]);

  useEffect(() => {
    const fetchInfo = async () => {
      await fetchPfp();
    };

    fetchInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <header className="flex flex-row justify-between items-center w-full md:absolute fixed h-20 px-12 z-40 bg-white">
        <div className="hidden md:flex flex-row justify-start items-center gap-3">
          <Link to="/">
            <GalleryHorizontalEnd size={36} color="#444444" />
          </Link>

          <Link
            to="/"
            className="px-12 text-pipelines-gray-500 font-light uppercase"
          >
            About
          </Link>

          <Link
            to="/search"
            className="px-12 text-pipelines-gray-500 font-light uppercase"
          >
            Search
          </Link>

          <Link
            to="/discover"
            className="px-12 text-pipelines-gray-500 font-light uppercase"
          >
            Discover
          </Link>
        </div>

        <div className="hidden md:flex flex-row gap-5">
          {!user && (
            <>
              <Link
                to={linkedinRedirectUrl}
                className="bg-pipelines-gray-500 px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-700 
                                text-white font-normal uppercase"
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <>
              {user.profileCreated ? (
                <>
                  <Link to={`/user/${user.profileId}`}>
                    <img
                      src={pfp ? pfp : "/avatar.png"}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={"user_pfp"}
                    />
                  </Link>

                  <Link
                    to="/edit"
                    className="bg-pipelines-gray-500 px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-700 text-white font-normal uppercase"
                  >
                    Edit Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/create"
                    className="bg-white px-8 py-2 rounded-full text-pipelines-gray-500 font-light uppercase"
                  >
                    Create Profile
                  </Link>
                </>
              )}

              <button
                className="bg-white px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-100"
                onClick={logout}
              >
                <h1 className="text-pipelines-gray-500 font-light uppercase">
                  Logout
                </h1>
              </button>
            </>
          )}
        </div>
        {/* Mobile Nav */}
        <Link className="md:hidden" to="/">
          <GalleryHorizontalEnd className="md:hidden" size={36} color="#444444" />
        </Link>
        <div
          onClick={() => setNav(!nav)}
          className="md:hidden relative z-50 cursor-pointer"
        >
          {nav ? (
            <FontAwesomeIcon icon={faTimes} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faBars} size="lg" />
          )}
        </div>
        {nav && (
          <ul
            onClick={() => setNav(!nav)}
            className="z-40 flex flex-col justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-pink-700"
          >
            <Link
              to="/"
              className="px-12 text-xl text-white font-light uppercase"
            >
              About
            </Link>

            <Link
              to="/search"
              className="text-xl px-12 py-8 text-white font-light uppercase"
            >
              Search
            </Link>

            <Link
              to="/discover"
              className="text-xl px-12 py-8 text-white font-light uppercase"
            >
              Discover
            </Link>

            {!user && (
              <>
                <Link
                  to={linkedinRedirectUrl}
                  className="bg-pipelines-gray-500 px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-700 
                                    text-white font-normal uppercase"
                >
                  Login
                </Link>
              </>
            )}

            {user && (
              <>
                {user.profileCreated ? (
                  <>
                    <Link
                      to={`/user/${user.profileId}`}
                      className="text-xl text-white pb-7 font-light uppercase"
                    >
                      User
                    </Link>

                    <Link
                      to="/edit"
                      className="text-xl text-white pb-7 font-light uppercase"
                    >
                      Edit Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/create"
                      className="text-xl text-white pb-7 py-12 font-light uppercase"
                    >
                      Create Profile
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    dispatch({ type: "LOGOUT" });
                    localStorage.setItem("user", null);

                    navigate("/");
                  }}
                >
                  <h1 className="text-xl text-white font-light uppercase">
                    Logout
                  </h1>
                </button>
              </>
            )}
          </ul>
        )}
      </header>
    </>
  );
};

export default Navbar;
