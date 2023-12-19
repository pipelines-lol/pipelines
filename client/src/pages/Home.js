import { useState, useEffect } from "react";

import { PipelineCard } from "../components/PipelineCard";

function Home() {

    const [profiles, setProfiles] = useState([]);

    const generateProfiles = async () => {
        const size = 5;

        const response = fetch(`http://localhost:4000/api/pipeline/random/${size}`, {
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
            console.log(data);

            // localStorage.setItem('user', JSON.stringify(data));

            // update context
            // dispatch({ type: "LOGIN", payload: data });
        })
        .catch((error) => {
            console.error(error.message);
        });
    }

    useEffect(() => {
        generateProfiles();
    }, [])

    return (
        <>
        
            <div className="flex flex-col justify-center items-center w-full h-full bg-gray-100">
                <h1 className="text-black font-bold text-3xl p-8">Pipelines</h1>

                <div>
                {
                    profiles.map((profile) => (
                        <PipelineCard name={profile.name} pipeline={profile.pipeline} />
                    ))
                }
                </div>
            </div>
        
        </>
    )
}

export default Home;