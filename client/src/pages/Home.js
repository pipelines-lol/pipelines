import { useState, useEffect } from "react";

import { PipelineCard } from "../components/PipelineCard";

function Home() {

    const [profiles, setProfiles] = useState([]);
    const [search, setSearch] = useState("");

    const generateProfiles = async () => {
        const size = 5;

        fetch(`http://localhost:4000/api/pipeline/random/${size}`, {
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
        })
        .catch((error) => {
            console.error(error.message);
        });
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        await searchProfiles();
    }

    const searchProfiles = async () => {
        fetch(`http://localhost:4000/api/pipeline/search/${search}`, {
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
        
            <div className="flex flex-col justify-center items-center w-full h-full bg-gray-100 gap-12">
                <h1 className="text-black font-bold text-3xl p-8">Pipelines</h1>

                <form className="flex flex-col justify-center items-center w-full gap-5" onSubmit={(e) => handleSearch(e)}>
                    <input 
                        className="w-1/2 h-20 bg-gray-200 rounded-2xl text-xl p-10" 
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="bg-white px-12 py-4 text-black font-semibold text-xl uppercase rounded-2xl" type="submit">
                        <h1>Search</h1>
                    </button>
                </form>

                <div className="flex flex-col justify-center items-center w-1/2 gap-5 py-12">
                {
                    profiles.map((profile) => (
                        <PipelineCard name={profile.firstName + ' ' + profile.lastName}  pipeline={profile.pipeline} />
                    ))
                }
                </div>
            </div>
        
        </>
    )
}

export default Home;