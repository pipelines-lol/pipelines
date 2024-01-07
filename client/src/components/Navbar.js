import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useAuthContext();

    const handlePipelinesClick = () => {
        navigate('/');
        window.location.reload();
    };

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
                                                src={"/avatar.png"}
                                                className="w-12 h-12 rounded-full"
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