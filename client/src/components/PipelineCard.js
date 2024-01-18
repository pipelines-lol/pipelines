import { useEffect, useState } from "react";
import { companies } from "../data/companyData";

import { HOMEPAGE, HOST } from "../util/apiRoutes";
import { ConditionalLink } from "./ConditionalLink";

export const PipelineCard = ({ profileId, name, pfp, anonymous, pipeline }) => {
  const [pfpUrl, setPfpUrl] = useState(null);
  const [isHover, setIsHover] = useState(0);

  const fetchPfp = async () => {
    if (!profileId || profileId === "") return;
    if (!pfp || pfp === "") return;

    try {
      const response = await fetch(`${HOST}/api/pfp/${profileId}`, {
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
      setPfpUrl(data.pfp);
    } catch (error) {
      console.error(error.message);
      setPfpUrl(null);
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      await fetchPfp();
    };

    fetchInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="flex flex-col justify-center items-center gap-3 p-5"
      key={pipeline._id}
    >
      <ConditionalLink
        className="w-2/3"
        condition={true}
        to={`/user/${profileId}`}
      >
        <div className="flex flex-row justify-end items-center w-full sm:gap-4 md:gap-3 pb-2">
          <img
            onMouseOver={() => setIsHover(profileId)}
            onMouseOut={() => setIsHover(0)}
            className="w-12 h-12 rounded-full object-cover"
            src={anonymous ? "avatar.png" : pfpUrl || "avatar.png"}
            alt="avatar"
          />
          <h1 className="text-black font-light text-xl uppercase">
            {anonymous ? "Anonymous" : name}
          </h1>
        </div>
        <div className="flex flex-row gap-3">
          {!(isHover === profileId) ? (
            <div
              className="flex flex-row justify-center items-center gap-3"
              key={pipeline[pipeline.length - 1]._id}
            >
              <ExperienceCard experience={pipeline[pipeline.length - 1]} />
            </div>
          ) : (
            <div className="flex flex-row gap-3">
              {pipeline.map((experience, i) => (
                <div
                  className="flex flex-row justify-center items-center gap-3"
                  key={experience._id}
                >
                  <ExperienceCard experience={experience} />
                  {i !== pipeline.length - 1 ? (
                    <div className="w-12 h-2 bg-pipelines-gray-500 rounded-md"></div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ConditionalLink>
    </div>
  );
};

export const ExperienceCard = ({ experience }) => {
  function getLogoByName(companyName) {
    const foundCompany = companies.find(
      (company) => company.name === companyName,
    );
    return foundCompany ? foundCompany.logo : null;
  }

  const logo = `${HOMEPAGE}/logos/${getLogoByName(experience.company)}`;

  return (
    <div
      className="flex flex-col justify-center items-center gap-3"
      key={experience._id}
    >
      <img
        className="w-24 h-24 rounded-md object-contain"
        src={logo}
        alt={`${experience.company}_logo`}
      />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-black font-semibold text-2xl">
          {experience.company}
        </h1>
        <h1 className="text-black font-thin italic text-xl">
          {experience.title}
        </h1>
        <h1 className="text-black opacity-60 font-light text-xl">
          {experience.date}
        </h1>
      </div>
    </div>
  );
};
