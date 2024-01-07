import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { host } from "../util/apiRoutes";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const { dispatch } = useAuthContext();

    const navigate = useNavigate();
    
    const signUp = (email, password) => {
        const _user = { email, password };

        // validation
        if (email.includes(" ") || password.includes(" ")) {
            setErrorMessage("Invalid username or password.");
            return;
        } 

        fetch(`${host}/api/user/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json' // Specify the content type as JSON
            },
            body: JSON.stringify(_user)
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
            localStorage.setItem('user', JSON.stringify(data));

            // update AuthContext
            dispatch({ type: "LOGIN", payload: data });

            // redirect to home
            navigate('/');
        })
        .catch((error) => {
            setErrorMessage(error.message);
        });
    }

    return (
        <>
        
            <div className="flex justify-center items-center w-full h-full bg-gray-100">
                <div className="flex flex-col justify-center items-center w-96 h-2/3 bg-white shadow-md py-10 gap-10">
                    <h1 className="text-black font-semibold text-2xl tracking-wide uppercase">Signup</h1>

                    <div className="flex flex-col gap-3">
                        <label className="text-medium">Email</label>
                        <input 
                            className="px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none" 
                            placeholder="someone@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <label className="text-medium">Password</label>
                        <input 
                            className="px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none"
                            type="password"
                            placeholder="••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    { errorMessage &&
                        <h1 className="text-red-400">{errorMessage}</h1>
                    }
                    
                    <button 
                        className="bg-black px-12 py-2 rounded-full"
                        onClick={() => signUp(email, password)}
                    >
                        <h1 className="text-white">Sign Up</h1>
                    </button>
                </div>
            </div>
        
        </>
    )
}

export default Signup;