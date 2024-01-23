import { useState } from "react";

import { PipelineCard } from "../components/PipelineCard";
import { HOST } from "../util/apiRoutes";
import { QuerySearchInput } from "../components/QuerySearchInput";
import Loading from "./Loading";

function Search() {
  const [profiles, setProfiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (query) => {
    // loading state to load query
    setLoading(true);
    setSearchPerformed(true);

    fetch(`${HOST}/api/pipeline/search/${query}`, {
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
        setProfiles([...data]);
        setLoading(false);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-full min-h-[100vh] bg-white gap-12 pt-15">
        <div className="flex flex-col justify-center items-center text-center w-full h-[70vh] bg-pink-100 gap-5">
          <div className="flex flex-col justify-center items-center text-center w-full gap-3">
            <h1 className="text-pipelines-gray-500 font-bold text-4xl">
              Find Your <span className="text-pink-700">Pipeline</span>
            </h1>
            <p className="text-pipelines-gray-500 font-light text-xl">
              See where you were. Find where you are. <br /> Search where you
              can be.
            </p>
          </div>
          <QuerySearchInput handleSearch={handleSearch} />
        </div>
        <div className="grid md:grid-cols-4 grid-cols-2 md:gap-4 sm:gap-2 gap-1 pb-12">
          {searchPerformed && profiles.length === 0 && !loading && (
            <div className="col-span-full text-center text-pipelines-gray-500 mt-12 text-3xl font-bold">
              No users on this site for this company :/
            </div>
          )}

          {!searchPerformed && (
            <div className="col-span-full text-center text-pipelines-gray-500 mt-12 text-3xl font-bold">
              Search for your dream company
            </div>
          )}
          {profiles.map((profile) => (
            <PipelineCard
              key={`pipeline_${profile._id}`}
              profileId={profile._id}
              name={profile.firstName + " " + profile.lastName}
              pfp={profile.pfp}
              anonymous={profile.anonymous}
              pipeline={profile.pipeline}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Search;
