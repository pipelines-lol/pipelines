import { useState, useEffect } from "react";

import { PipelineCard } from "../components/PipelineCard";
import { host } from "../util/apiRoutes";
import { QuerySearchInput } from "../components/QuerySearchInput";
import Loading from "./Loading";

function Home() {

    const [profiles, setProfiles] = useState([]);

    const [loading, setLoading] = useState(false);

    const generateProfiles = async () => {
        const size = 5;
        setLoading(true);

        fetch(`${host}/api/pipeline/random/${size}`, {
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

        fetch(`${host}/api/pipeline/search/${query}`, {
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
        
            <div className="flex flex-col justify-center items-center w-full h-full bg-gray-100 gap-12">
                <h1 className="text-black font-bold text-3xl p-8">Pipelines</h1>

                <QuerySearchInput 
                    handleSearch={handleSearch}
                />

                <div className="flex flex-col justify-center items-center min-w-1/2 gap-5 py-12">
                {
                    profiles.map((profile) => (
                        <PipelineCard
                            key={`pipeline_${profile._id}`}
                            profileId={profile._id}
                            name={profile.firstName + ' ' + profile.lastName}
                            anonymous={profile.anonymous}
                            pipeline={profile.pipeline} 
                        />
                    ))
                }
                </div>
            </div>
        
        </>
    )
}

export default Home;