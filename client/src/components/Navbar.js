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
  const [userInfo, setUserInfo] = useState({});
  const [pfp, setPfp] = useState(null);

  const linkedinRedirectUrl = `https://linkedin.com/oauth/v2/authorization?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${HOMEPAGE}`

  const fetchPfp = async () => {
    if (!user || !user.profileCreated) return;

    try {
      const response = await fetch(`${HOST}/api/pfp/${user.profileId}`, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
        // Check if the response has JSON content
        if (response.headers.get("content-type")?.includes("application/json")) {
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

  useEffect(() => {
    async function checkForLinkedinToken () {
      let windowUrl = window.location.href
      if (windowUrl.includes('code=')) {
        let codeMatch = windowUrl.match(/code=([a-zA-Z0-9_-]+)/);

        try {
          const response = await fetch(`${HOST}/api/user/linkedin/userinfo`, {
            method: 'GET',
            headers: {
              auth_code: codeMatch[1]
            }
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          console.error(error.message);
        }
      }
    }

    checkForLinkedinToken();

  }, []);

  useEffect(() => {
    async function checkForUserInfo () {
      if (!userInfo) return;
      if (user) return;

      const email = userInfo.email;
      if (email) {
        try {
          const response = await fetch(`${HOST}/api/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
  
          if (!response.ok) {
            // Check if the response has JSON content
            if (response.headers.get('content-type')?.includes('application/json')) {
              const errorData = await response.json();
              throw new Error(`${errorData.error}`);
            } else {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          }
    
          const data = await response.json();
          
          localStorage.setItem('user', JSON.stringify(data));

          // update AuthContext
          dispatch({ type: "LOGIN", payload: data });

          // redirect to home
          navigate('/');
        } catch (error) {
            console.error(error.message);
        }
      }
    }

    checkForUserInfo();

  }, [userInfo, user, dispatch, navigate]);

  useEffect(() => {
    const fetchInfo = async () => {
      await fetchPfp();
    };

    fetchInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header className="flex flex-row justify-between items-center w-full h-20 px-12 z-100 bg-white">
        <div className="hidden md:flex flex-row justify-start items-center gap-3">
          <GalleryHorizontalEnd size={36} color="#444444" />

          <Link
            to="/"
            className="px-12 text-pipelines-gray-500 font-light uppercase"
          >
            About
          </Link>

          <Link to="/search" className="px-12 text-pipelines-gray-500 font-light uppercase">
            Search
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
                onClick={() => {
                  dispatch({ type: "LOGOUT" });
                  localStorage.setItem("user", null);

                  navigate("/");
                }}
              >
                <h1 className="text-pipelines-gray-500 font-light uppercase">
                  Logout
                </h1>
              </button>
            </>
          )}
        </div>
        {/* Mobile Nav */}
        <GalleryHorizontalEnd className="md:hidden" size={36} color="#444444" />
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
        { nav && (
            <ul onClick={() => setNav(!nav)} className="z-40 flex flex-col justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-pink-700">
              <Link to="/" className="px-12 text-xl text-white font-light uppercase">
                About
              </Link>

              <Link to="/search" className="text-xl px-12 py-8 text-white font-light uppercase">
                Search
              </Link>

              {!user &&
                <>
                  <Link
                    to={linkedinRedirectUrl}
                    className="bg-pipelines-gray-500 px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-700 
                                    text-white font-normal uppercase"
                  >
                    Login
                  </Link>
                </>
              }

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

                      <Link to="/edit" className="text-xl text-white pb-7 font-light uppercase">
                        Edit Profile
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/create" className="text-xl text-white pb-7 py-12 font-light uppercase">
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
                    <h1 className="text-xl text-white font-light uppercase">Logout</h1>
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
