import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { host } from "../util/apiRoutes";
import { useEffect, useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useAuthContext();

    const [pfp, setPfp] = useState(null);

    const fetchPfp = async () => {
        if (!user || !user.profileCreated) return;

        try {
            const response = await fetch(`${host}/api/pfp/${user.profileId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Check if the response has JSON content
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(`${errorData.error}`);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const data = await response.json();
            setPfp(data.pfp);
        } catch (error) {
            console.error(error.message);
            setPfp(null);
        }
    }

    const handlePipelinesClick = () => {
        navigate('/');
        window.location.reload();
    };

    useEffect(() => {
        const fetchInfo = async () => {
            await fetchPfp();
        }
    
        fetchInfo();
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
        
            <div className="flex flex-row justify-between items-center w-full h-16 px-12 bg-gray-900">
                <button 
                    className="px-8 py-2"
                    onClick={handlePipelinesClick}
                >
                    <h1 className="text-white">pipelines.lol</h1>
                </button>
                <div className="flex flex-row gap-5">

                    {!user &&
                        <>
                            <button 
                                className="px-8 py-2"
                                onClick={() => navigate('/login')}
                            >
                                <h1 className="text-white">Login</h1>
                            </button>
                            <button 
                                className="bg-white px-8 py-2 rounded-full"
                                onClick={() => navigate('/signup')}
                            >
                                <h1 className="text-black">Signup</h1>
                            </button>
                        </>
                    }  

                    {user &&
                        <>
                            {
                                user.profileCreated ? ( 
                                    <>
                                        
                                        <Link
                                            to={`/user/${user.profileId}`}
                                        >
                                            <img 
                                                src={pfp ? pfp : "/avatar.png"}
                                                className="w-12 h-12 rounded-full object-cover"
                                                alt={"user_pfp"}
                                            />
                                        </Link>

                                        <button
                                            className="bg-white px-8 py-2 rounded-full"
                                            onClick={() => navigate('/edit')}
                                        >
                                            <h1>Edit Profile</h1>
                                        </button>

                                    </>
                                ) : (
                                    <>
                                    
                                        <button
                                            className="bg-white px-8 py-2 rounded-full"
                                            onClick={() => navigate('/create')}
                                        >
                                            <h1>Create Profile</h1>
                                        </button>

                                    </>
                                )
                            }

                            <button 
                                className="px-8 py-2"
                                onClick={() => {
                                    dispatch({ type: 'LOGOUT' });
                                    localStorage.setItem('user', null);
                                }}
                            >
                                <h1 className="text-white">Logout</h1>
                            </button>
                        </>
                    }
                </div>
            </div>
        
        </>
    )
}

export default Navbar;