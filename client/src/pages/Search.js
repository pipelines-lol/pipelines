import { useState, useEffect } from "react";

import { PipelineCard } from "../components/PipelineCard";
import { HOST } from "../util/apiRoutes";
import { QuerySearchInput } from "../components/QuerySearchInput";
import Loading from "./Loading";

function Search () {
    const [profiles, setProfiles] = useState([]);

    const [loading, setLoading] = useState(false);

    const generateProfiles = async () => {
        const size = 1;
        setLoading(true);

        fetch(`${HOST}/api/pipeline/random/${size}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json' // Specify the content type as JSON
            },
        })
        .then((res) => {
            if (!res.ok) {
                // Check if the response has JSON content
                if (res.headers.get('content-type')?.includes('application/json')) {
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
    }

    const handleSearch = async (query) => {
        // loading state to load query
        setLoading(true);

        fetch(`${HOST}/api/pipeline/search/${query}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json' // Specify the content type as JSON
            },
        })
        .then((res) => {
            if (!res.ok) {
                // Check if the response has JSON content
                if (res.headers.get('content-type')?.includes('application/json')) {
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
    }

    useEffect(() => {
        generateProfiles();
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <>

                <div className="flex flex-col justify-center items-center text-center w-full h-[50vh] bg-pink-100 gap-5">
                    <div className="flex flex-col justify-center items-center text-center w-full gap-3">
                        <h1 className="text-pipelines-gray-500 font-bold text-4xl">Find Your <span className="text-pink-700">Pipeline</span></h1>
                        <p className="text-pipelines-gray-500 font-light text-xl">See where you were. Find where you are. <br /> Search where you can be.</p>
                    </div>

                    <QuerySearchInput 
                        handleSearch={handleSearch}
                    />

                </div>

                <div className="flex flex-col justify-center items-center bg-white min-w-1/2 gap-5">
                {
                    profiles.map((profile) => (
                        <PipelineCard
                            key={`pipeline_${profile._id}`}
                            profileId={profile._id}
                            name={profile.firstName + ' ' + profile.lastName}
                            pfp={profile.pfp}
                            anonymous={profile.anonymous}
                            pipeline={profile.pipeline} 
                        />
                    ))
                }
                </div>

        </>
    )
}

export default Search;