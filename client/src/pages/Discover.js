import { useEffect, useState } from "react";
import { HOST } from "../util/apiRoutes";
import { PipelineCard } from "../components/PipelineCard";
import Loading from "./Loading";

function Discover() {
  const [profiles, setProfiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const generateProfiles = async () => {
    const size = 24;
    setLoading(true);

    fetch(`${HOST}/api/pipeline/random/${size}`, {
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
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    generateProfiles();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full justify-center items-center text-center bg-white min-h-screen pt-20">
      <h1 className="w-full text-pipelines-gray-500 font-bold text-3xl">
        Discover Other Pipelines
      </h1>
      <div className="grid md:grid-cols-4 grid-cols-2 md:gap-4 sm:gap-2 gap-1 pb-12 min-h-96 overflow-y-scroll pt-20">
        {profiles.map((profile) => (
          <div key={`profile_${profile._id}`}>
            <div className="p-5"></div>
            <PipelineCard
              key={`pipeline_${profile._id}`}
              profileId={profile._id}
              name={profile.firstName + " " + profile.lastName}
              pfp={profile.pfp}
              anonymous={profile.anonymous}
              pipeline={profile.pipeline}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;
