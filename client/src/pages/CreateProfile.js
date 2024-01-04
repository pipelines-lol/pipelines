import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { ExperienceForm } from "../components/ExperienceForm";
import { host } from "../util/apiRoutes";

function CreateProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [pipeline, setPipeline] = useState([]);

    const navigate = useNavigate();

    const { user, dispatch } = useAuthContext();

    const fetchProfile = async () => {
        fetch(`${host}/api/profile/${user.profileId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json' // Specify the content type as JSON
            }
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
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setLinkedin(data.linkedin);
            setAnonymous(data.anonymous);
            setPipeline(data.pipeline);
        })
        .catch((error) => {
            console.error(error.message);
        });
    }

    const updateProfile = async () => {
        
        const profile = {
            firstName: firstName,
            lastName: lastName,
            linkedin: linkedin,
            anonymous: anonymous,
            pipeline: pipeline,
            created: true
        };

        fetch(`${host}/api/profile/${user.profileId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json' // Specify the content type as JSON
            },
            body: JSON.stringify(profile)
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
            console.log(data);

            // set user data
            dispatch({ type: 'CREATED' });

            // set new user in local storage (with profile created)
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.profileCreated = true;
            localStorage.setItem('user', JSON.stringify(storedUser));

            // display change in DOM
            fetchProfile();

            navigate('/');
        })
        .catch((error) => {
            console.error(error.message);
        });
    }

    const addExperience = async (index) => {
        const placeholder = {
            company: "",
            title: "",
            date: ""
        }
        const newPipeline = [...pipeline];

        newPipeline.splice(index, 0, placeholder);

        setPipeline(newPipeline);
    }

    const updateExperience = async (experience, index) => {
        const newPipeline = [...pipeline];

        newPipeline.splice(index, 1, experience);

        setPipeline(newPipeline);
    }

    const removeExperience = async(index) => {
        const newPipeline = [...pipeline];

        newPipeline.splice(index, 1);

        setPipeline(newPipeline);
    }

    return (
        <>
        
            <div className="flex justify-center items-center w-full h-full bg-gray-100">
                <div className="flex flex-col justify-center items-center h-2/3 bg-white shadow-md p-5 gap-10">
                    <h1 className="text-black font-semibold text-2xl tracking-wide uppercase">Profile</h1>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-medium">First Name</label>
                                <input 
                                    className="px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none" 
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-medium">Last Name</label>
                                <input 
                                    className="px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none" 
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <label className="text-medium">Linkedin</label>
                        <input 
                            className="px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none" 
                            placeholder="https://www.linkedin.com/john-doe"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                        />

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => setAnonymous((prev) => !prev)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Anonymous</span>
                        </label>
                    </div>

                    <div className="flex flex-row justify-center items-center w-full gap-3">
                        <button
                            key={0}
                            className="w-10 h-10 bg-gray-200 rounded-full"
                            onClick={() => {addExperience(0)}}
                        >
                            <h1>+</h1>
                        </button>
                        {
                            pipeline.map((experience, index) => (
                                <>
                                    <ExperienceForm
                                        experience={experience} 
                                        index={index} 
                                        updateExperience={updateExperience}
                                        removeExperience={removeExperience}
                                    />
                                    <button
                                        key={index + 1}
                                        className="w-10 h-10 bg-gray-200 rounded-full"
                                        onClick={() => {addExperience(index)}}
                                    >
                                        <h1>+</h1>
                                    </button>
                                </>
                            ))
                        }
                    </div>
                    
                    <button 
                        className="bg-black px-12 py-2 rounded-full"
                        onClick={updateProfile}
                    >
                        <h1 className="text-white">Create</h1>
                    </button>
                </div>
            </div>
        
        </>
    )
}

export default CreateProfile;