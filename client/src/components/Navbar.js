import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

import { HOST } from "../util/apiRoutes";
import { CLIENT_ID, SCOPE, REDIRECT_URI } from "../util/linkedinKeys";

import { useEffect, useState } from "react";
import { GalleryHorizontalEnd } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useAuthContext();

    // taken from linkedin api
    const [userInfo, setUserInfo] = useState({});
    const [pfp, setPfp] = useState(null);

    const linkedinRedirectUrl = `https://linkedin.com/oauth/v2/authorization?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`

    const fetchPfp = async () => {
        if (!user || !user.profileCreated) return;

        try {
            const response = await fetch(`${HOST}/api/pfp/${user.profileId}`, {
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

    const handleLinkedinLogin = () => {
        window.location.href = linkedinRedirectUrl;
    }

    useEffect(() => {
        async function checkForLinkedinToken () {
            let windowUrl = window.location.href
            if (windowUrl.includes('code=')) {
                let codeMatch = windowUrl.match(/code=([a-zA-Z0-9_\-]+)/)

                console.log(codeMatch[1]);
                
                try {
                    const response = await fetch(`${HOST}/api/user/linkedin/userinfo`, {
                        method: 'GET',
                        headers: {
                            auth_code: codeMatch[1]
                        }
                    });
                
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                
                    const data = await response.json();
                    console.log(data);
                    setUserInfo(data);
                } catch (error) {
                    console.error(error.message);
                }
            }
        }

        checkForLinkedinToken();
    
    }, []);

    useEffect(() => {
        async function checkForUserInfo () {
            if (!userInfo) return;

            const email = userInfo.email;
            if (email) {
                try {
                    const response = await fetch(`${HOST}/api/user/login`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
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
                    console.log(data);
                    
                    localStorage.setItem('user', JSON.stringify(data));

                    // update AuthContext
                    dispatch({ type: "LOGIN", payload: data });

                    // redirect to home
                    navigate('/');
                } catch (error) {
                    console.error(error.message);
                }
            }
        }

        checkForUserInfo();

    }, [userInfo]);

    // useEffect(() => {
    //     const fetchInfo = async () => {
    //         await fetchPfp();
    //     }
    
    //     fetchInfo();
    
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <>
        
            <div className="flex flex-row justify-between items-center w-full h-20 px-12 bg-white">
                <div className="flex flex-row justify-start items-center gap-3">
                    <GalleryHorizontalEnd 
                        size={36}
                        color="#444444"
                    />

                    <button 
                        className="px-12"
                        onClick={handlePipelinesClick}
                    >
                        <h1 className="text-pipelines-gray-500 font-light uppercase">About</h1>
                    </button>

                    <button 
                        className="px-12"
                        onClick={() => navigate('/search')}
                    >
                        <h1 className="text-pipelines-gray-500 font-light uppercase">Search</h1>
                    </button>
                </div>

                <div className="flex flex-row gap-5">

                    {!user &&
                        <>
                            <button 
                                className="bg-pipelines-gray-500 px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-700"
                                onClick={handleLinkedinLogin}
                            >
                                <h1 className="text-white font-normal uppercase">Signup</h1>
                            </button>

                            <button 
                                className="bg-white px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-100"
                                onClick={handleLinkedinLogin}
                            >
                                <h1 className="text-pipelines-gray-500 font-light uppercase">Login</h1>
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
                                            className="bg-pipelines-gray-500 px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-700"
                                            onClick={() => navigate('/edit')}
                                        >
                                            <h1 className="text-white font-normal uppercase">Edit Profile</h1>
                                        </button>

                                    </>
                                ) : (
                                    <>
                                    
                                        <button
                                            className="bg-white px-8 py-2 rounded-full"
                                            onClick={() => navigate('/create')}
                                        >
                                            <h1 className="text-pipelines-gray-500 font-light uppercase">Create Profile</h1>
                                        </button>

                                    </>
                                )
                            }

                            <button 
                                className="bg-white px-8 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-gray-100"
                                onClick={() => {
                                    dispatch({ type: 'LOGOUT' });
                                    localStorage.setItem('user', null);

                                    navigate('/');
                                }}
                            >
                                <h1 className="text-pipelines-gray-500 font-light uppercase">Logout</h1>
                            </button>
                        </>
                    }
                </div>
            </div>
        
        </>
    )
}

export default Navbar;