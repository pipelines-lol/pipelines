import { useState, useEffect } from "react";

import { PipelineCard } from "../components/PipelineCard";
import { HOST } from "../util/apiRoutes";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

function Home() {
  const [profiles, setProfiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateProfiles = async () => {
    const size = 1;
    setLoading(true);
    
    fetch(`${host}/api/pipeline/random/${size}`, {
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
    <>
      <div className="flex flex-col justify-center items-center w-full h-full bg-white gap-12">
        <div className="flex flex-row w-full h-[50vh] bg-pink-100">
          <div className="flex flex-col justify-center items-center text-center w-1/2 h-full gap-3">
            <h1 className="text-pipelines-gray-500 font-bold text-4xl">
              Find Your <span className="text-pink-700">Pipeline</span>
            </h1>
            <p className="text-pipelines-gray-500 font-light text-xl">
              See where you were. Find where you are. <br /> Search where you
              can be.
            </p>

            <button
              className="px-8 py-3 bg-pipelines-gray-500 rounded-xl"
              onClick={() => navigate("/search")}
            >
              <h1 className="text-white font-medium uppercase">Find Now</h1>
            </button>
          </div>

          <div className="flex justify-center items-center w-1/2 h-full">
            <img
              className="w-full h-[50vh] translate-y-12 object-contain"
              src={"Hero.webp"}
              alt={"Hero"}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-start text-center w-full h-[50vh] gap-8">
          <h1 className="w-full text-pipelines-gray-500 font-bold text-3xl">
            Discover Your Pipeline
          </h1>

          <div className="flex flex-row justify-evenly w-full h-full 2xl:gap-24 gap-4">
            <div className="flex flex-col justify-center items-end w-1/2 h-full">
              <img
                className="w-72 h-72 object-contain"
                src={"Hero2.png"}
                alt={"Hero2"}
              />
            </div>

            <div className="flex flex-col justify-center items-start w-1/2 h-full">
              <p className="2xl:w-1/2 w-full text-pipelines-gray-500 font-light 2xl:leading-7 leading-2 2xl:text-lg lg:text-md text-xs">
                A <span className="font-semibold">pipeline</span> is a roadmap
                of experiences that individuals traverse throughout their
                professional journey. It captures the diverse paths taken by
                individuals, starting from pivotal internships to noteworthy
                career milestones.
                <br />
                <br />
                Explore the journeys of others who, like you, began their
                professional adventure with (rotating company name), and uncover
                where their unique pipelines have led them. Gain insights, draw
                inspiration, and chart your course by discovering the diverse
                destinations that await along your own career pipeline.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 grid-cols-2 row-span-5 gap-5 py-12 overflow-y-scroll">
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

export default Home;
