import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HOST } from "../util/apiRoutes";
import { isMongoDBId } from "../util/isMongodbId";
import { useAuthContext } from "../hooks/useAuthContext";

import Loading from "./Loading";

import { ExperienceCard } from "../components/PipelineCard";

import { MapPin } from "lucide-react";
import { ProfilePicture } from "../components/ProfilePicture";

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState({});

  // for searching through profiles that have
  // id as a username instead of id
  const [profiles, setProfiles] = useState([]);

  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const [saveable, setSaveable] = useState(false);

  const [pfp, setPfp] = useState("");
  const [username, setUsername] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [linkedinErrorMessage, setLinkedinErrorMessage] = useState("");

  const [location, setLocation] = useState("");

  const hasError =
    usernameErrorMessage.length !== 0 && linkedinErrorMessage.length !== 0;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const isValidId = await isMongoDBId(id);

      if (isValidId) {
        const response = await fetch(`${HOST}/api/profile/${id}`, {
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
        setProfile(data);

        setUsername(data.username);
        setLinkedin(extractLinkedinUsername(data.linkedin));
        setLocation(data.location);
        setPfp(data.pfp);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error(error.message);
      setProfile(null);
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    fetch(`${HOST}/api/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    })
      .then((res) => {
        if (!res.ok) {
          // Check if the response has JSON content
          if (res.headers.get("content-type")?.includes("application/json")) {
            return res.json().then((errorData) => {
              throw new Error(`${errorData.error}`);
            });
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }

        return res.json();
      })
      .then((data) => {
        setProfiles(data);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getCurrentExperience = () => {
    
    function splitDateString(dateString) {
      const dateParts = dateString.split(' - ');
      const startDate = parseDateString(dateParts[0]);
      const endDate = parseDateString(dateParts[1]);
  
      return [startDate, endDate];
    }

    function parseDateString(dateString) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const [month, year] = dateString.split(' ');
      const monthIndex = months.indexOf(month);
      const parsedDate = new Date(year, monthIndex);

      return parsedDate;
    }
    
    if (!profile || !profile.pipeline) return;

    // compare experience dates to todays date
    const currentDate = new Date();
    for (const [index, experience] of profile.pipeline.entries()) {
      const [startDate, endDate] = splitDateString(experience.date);

      // check if current experience date range overlaps current date
      if (startDate.getTime() <= currentDate.getTime() && currentDate.getTime() <= endDate.getTime()) {
        return ["Current ", profile.pipeline[index]];
      }

      // check if current experience is in the future compared to current date
      if (startDate.getTime() >= currentDate.getTime() && endDate.getTime() >= currentDate.getTime()) {
        return ["Incoming ", profile.pipeline[index]];
      }
    }

    return ["Previous ", profile.pipeline[profile.pipeline.length - 1]];
  }

  const validateUsername = async (username) => {
    const isValidUsername = async (username) => {
      const mongodbConflict = await isMongoDBId(username);
      const usernameRegex =
        /^[a-zA-Z0-9_](?!.*[._]{2})[a-zA-Z0-9_.]{1,30}[a-zA-Z0-9_]$/;
      return !mongodbConflict && usernameRegex.test(username);
    };

    const isAvailable = (username) => {
      const filteredProfiles = profiles.filter(
        (profile) => profile.username.toLowerCase() === username.toLowerCase()
      );

      // check if the one profile there is the current user's
      if (filteredProfiles.length === 1) {
        const filteredProfile = filteredProfiles[0];

        return profile.username === filteredProfile.username;
      }

      return filteredProfiles.length === 0;
    };

    // blank username
    if (username.length === 0) {
      setUsernameErrorMessage("Invalid username.");
      return false;
    }

    // contains '/'
    if (username.indexOf("/") !== -1) {
      setUsernameErrorMessage("Invalid username.");
      return false;
    }

    // invalid regex
    else if (!(await isValidUsername(username))) {
      setUsernameErrorMessage("Invalid username.");
      return false;
    }

    // taken username
    else if (!isAvailable(username)) {
      setUsernameErrorMessage("Username already taken.");
      return false;
    }

    // valid username
    else {
      setUsernameErrorMessage("");
      return true;
    }
  };

  const validateLinkedin = async (linkedin) => {
    // Regular expression for a basic LinkedIn username check
    const regex = /^[a-z0-9-]+$/i;

    // Check if the username matches the pattern
    if (!regex.test(linkedin)) {
      setLinkedinErrorMessage("Invalid Linkedin username.");
      return false;
    } else {
      setLinkedinErrorMessage("");
      return true;
    }
  };

  const extractLinkedinUsername = (linkedin) => {
    const regex = /https:\/\/linkedin\.com\/in\/([^/]+)/;
    const match = linkedin.match(regex);

    // Check if the regex matched and has the expected parts
    if (match && match[1]) {
      return match[1];
    }

    // If no match, return null or handle it according to your requirements
    return null;
  };

  const buildLinkedinUrl = (username) => {
    const baseLinkedinUrl = "https://linkedin.com/in/";
    return `${baseLinkedinUrl}${username}`;
  };

  const handleUsernameChange = async (e) => {
    // change -> saveable progress
    setSaveable(true);

    // remove previous errors
    setUsernameErrorMessage("");

    const value = e.target.value;
    setUsername(value);
  };

  const handleLinkedinChange = async (e) => {
    // change -> saveable progress
    setSaveable(true);

    // remove previous errors
    setLinkedinErrorMessage("");

    const value = e.target.value;
    setLinkedin(value);
  };

  const handleLocationChange = async (e) => {
    // change -> saveable progress
    setSaveable(true);

    const value = e.target.value;
    setLocation(value);
  };

  const handleEditProfile = async () => {
    const updatedProfile = {
      username: username,
      linkedin: buildLinkedinUrl(linkedin),
      location: location,
    };

    // check all fields are filled out
    if (!username || username.length === 0) {
      setUsernameErrorMessage("All fields must be filled.");
      return;
    }

    if (!linkedin || linkedin.length === 0) {
      // clear linkedin if user left blank / deleted
      updatedProfile.linkedin = "";
    }

    if (!location || location.length === 0) {
      // clear location if user left blank / deleted
      updatedProfile.location = "";
    }

    // field validation
    if (!validateUsername(username)) {
      return;
    }

    if (!validateLinkedin(linkedin)) {
      return;
    }

    try {
      const response = await fetch(`${HOST}/api/profile/${user.profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(updatedProfile),
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
    } catch (error) {
      console.error(error.message);
    }

    setSaveable(false);
  };

  useEffect(() => {
    const fetchInfo = async () => {
      await fetchProfile();
      await fetchProfiles();
    };

    fetchInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const admin = user && (user.profileId === id || user.username === id);

  const currentExperienceInfo = (profile && profile.pipeline && profile.pipeline.length > 0) ? (getCurrentExperience()) : (null)

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {profile && !profile.anonymous ? (
        <div className="flex md:flex-row flex-col justify-center items-center w-full min-h-[90vh] h-full p-16 gap-10">
          {/* Profile picture + few fields */}
          <div className="flex flex-col justify-center items-center bg-white md:w-1/3 min-w-96 w-full h-full p-10 gap-5 shadow-md">
            {admin ? (
              <ProfilePicture profile={profile} setPfp={setPfp} />
            ) : (
              <img
                src={pfp ? pfp : "/avatar.png"}
                className="w-96 h-96 rounded-full object-cover"
                alt={`${profile._id}_avatar`}
              />
            )}

            {admin ? (
              <div className="flex flex-col justify-center items-center gap-3">
                <label>Username</label>
                <input
                  className="p-3 bg-gray-100 rounded-full"
                  value={username}
                  onChange={handleUsernameChange}
                />
                {usernameErrorMessage && (
                  <h1 className="text-red-400">{usernameErrorMessage}</h1>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-3">
                <label className="text-black font-medium">Username</label>
                <h1>{username}</h1>
              </div>
            )}
            
            {/* Linkedin Section */}
            <label className="text-black font-medium">Linkedin</label>
            <Link to={buildLinkedinUrl(linkedin)} target="_blank">
              <h1 className="hover:underline">{linkedin}</h1>
            </Link>

            {/* Save Button */}
            {admin && saveable && !hasError ? (
              <button
                className={"bg-black px-12 py-1 rounded-full"}
                onClick={handleEditProfile}
              >
                <h1 className="text-white font-normal uppercase">Save</h1>
              </button>
            ) : (<></>)}
          </div>

          {/* Name + job info */}
          <div className="flex flex-col justify-center md:items-start items-center md:w-1/3 w-full h-full gap-3">
            <h1 className="text-black font-semibold text-2xl">
              {profile.firstName} {profile.lastName}
            </h1>

            {currentExperienceInfo && 
                <h1 className="md:text-start text-center">
                  {currentExperienceInfo[0] + currentExperienceInfo[1].title} at{" "}
                  <span className="font-medium">
                    {currentExperienceInfo[1].company}
                  </span>
                </h1>
            } 

            <div className="flex flex-row justify-center items-center gap-2">
              <MapPin />
              {admin ? (
                <input
                  className="p-3 bg-white rounded-full"
                  value={location}
                  onChange={handleLocationChange}
                />
              ) : (
                <h1 className="italic">{location}</h1>
              )}
            </div>
          </div>

          {/* Pipeline */}
          <div className="flex flex-col justify-center items-center md:w-1/3 w-full h-full bg-white p-10 gap-3 pt-20">
            {profile.pipeline &&
              profile.pipeline.map((experience, i) => (
                <div
                  className="flex flex-col justify-center items-center gap-3"
                  key={experience._id}
                >
                  <ExperienceCard experience={experience} />
                  {i !== profile.pipeline.length - 1 ? <h1>--</h1> : <></>}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-col justify-center items-center w-full min-h-[90vh] h-full p-16 gap-10">
          {/* Profile picture + few fields */}
          <div className="flex flex-col justify-center items-center bg-white md:w-1/3 min-w-96 w-full h-full p-10 gap-5 shadow-md">
            {admin ? (
              <ProfilePicture profile={profile} setPfp={setPfp} />
            ) : (
              <img
                src={"/avatar.png"}
                className="w-96 h-96 rounded-full object-cover"
                alt={`${profile._id}_avatar`}
              />
            )}

            {admin ? (
              <div className="flex flex-col justify-center items-center gap-3">
                <label>Username</label>
                <input
                  className="p-3 bg-gray-100 rounded-full"
                  value={username}
                  onChange={handleUsernameChange}
                />
                {usernameErrorMessage && (
                  <h1 className="text-red-400">{usernameErrorMessage}</h1>
                )}

                <label>Linkedin</label>
                <div className="flex flex-row justify-center items-center gap-2">
                  <h1>linkedin.com/in/</h1>
                  <input
                    className="p-3 bg-gray-100 rounded-full"
                    value={linkedin}
                    onChange={handleLinkedinChange}
                  />
                </div>
                {linkedinErrorMessage && (
                  <h1 className="text-red-400">{linkedinErrorMessage}</h1>
                )}

                <div className="h-4" />

                {saveable && !hasError ? (
                  <button
                    className={"bg-black px-12 py-1 rounded-full"}
                    onClick={handleEditProfile}
                  >
                    <h1 className="text-white font-normal uppercase">Save</h1>
                  </button>
                ) : (
                  <div className="h-8" />
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-3">
                <label className="text-black font-medium">Username</label>
                <h1>Anonymous</h1>

                <label className="text-black font-medium">Linkedin</label>
                <h1>Anonymous</h1>
              </div>
            )}
          </div>

          {/* Name + job info */}
          <div className="flex flex-col justify-center md:items-start items-center md:w-1/3 w-full h-full gap-3">
            <h1 className="text-black font-semibold text-2xl">
              Anonymous
            </h1>

            {currentExperienceInfo && 
                <h1 className="md:text-start text-center">
                  {currentExperienceInfo[0] + currentExperienceInfo[1].title} at{" "}
                  <span className="font-medium">
                    {currentExperienceInfo[1].company}
                  </span>
                </h1>
            }

            <div className="flex flex-row justify-center items-center gap-2">
              <MapPin />
              {admin ? (
                <input
                  className="p-3 bg-white rounded-full"
                  value={location}
                  onChange={handleLocationChange}
                />
              ) : (
                <h1 className="italic">{location}</h1>
              )}
            </div>
          </div>

          {/* Pipeline */}
          <div className="flex flex-col justify-center items-center md:w-1/3 w-full h-full bg-white p-10 gap-3 pt-20">
            {profile.pipeline &&
              profile.pipeline.map((experience, i) => (
                <div
                  className="flex flex-col justify-center items-center gap-3"
                  key={experience._id}
                >
                  <ExperienceCard experience={experience} />
                  {i !== profile.pipeline.length - 1 ? <h1>--</h1> : <></>}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
