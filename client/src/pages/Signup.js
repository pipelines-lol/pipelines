import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import Cookies from 'js-cookie'

import { HOST } from '../util/apiRoutes'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const { dispatch } = useAuthContext()

    const navigate = useNavigate()

    const signUp = async (email, password) => {
        const _user = { email, password }

        // validation
        if (email.includes(' ') || password.includes(' ')) {
            setErrorMessage('Invalid username or password.')
            return
        }

        try {
            // Using a variant of fetchWithAuth or ensuring fetchWithAuth can be used without automatically including Authorization header
            const data = await fetchWithAuth({
                url: `${HOST}/api/user/signup`,
                method: 'POST',
                data: _user,
            })

            // On successful signup
            localStorage.setItem('user', JSON.stringify(data))
            dispatch({ type: 'LOGIN', payload: data }) // Update AuthContext
            navigate('/') // Redirect to home or dashboard
        } catch (error) {
            console.error('Error:', error.message)
            setErrorMessage(error.message) // Set the signup error message for the UI
        }
    }

    return (
        <>
            <div className="flex h-[90vh] w-full items-center justify-center">
                <div
                    className="flex h-full w-full flex-col items-center justify-center gap-5 bg-pipeline-blue-200/20 text-center"
                    style={{
                        backgroundImage: 'url("hero.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '70dvh',
                        borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                        borderTop: '1px solid rgba(2, 101, 172, 0.3)',
                    }}
                >
                    <div className="mb-8 flex w-full flex-col items-center justify-center gap-3 text-center">
                        <h1 className="text-3xl font-light text-pipelines-gray-100 md:text-4xl">
                            Welcome to{' '}
                            <span className="text-pipeline-blue-200">
                                Pipelines.lol
                            </span>
                        </h1>
                    </div>
                    <div className="flex h-2/3 w-96 flex-col items-center justify-center gap-4 rounded-lg border border-pipeline-blue-200/20 bg-white/10 bg-opacity-10  py-24 shadow-md backdrop-blur-xl backdrop-filter">
                        <h1 className="pb-2 text-2xl font-semibold uppercase tracking-wide text-pipelines-gray-100">
                            Sign Up
                        </h1>

                        <div className="flex flex-col gap-3">
                            <label className="text-light text-pipelines-gray-100">
                                Email
                            </label>
                            <input
                                className={
                                    'z-20 w-full rounded-2xl bg-gray-100/60 px-4 py-2 text-black outline-none placeholder:text-gray-950/30'
                                }
                                placeholder="someone@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label className="text-light text-pipelines-gray-100">
                                Password
                            </label>
                            <input
                                className={
                                    'z-20 w-full rounded-2xl bg-gray-100/60 px-4 py-2 text-black outline-none placeholder:text-gray-950/30'
                                }
                                type="password"
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {errorMessage && (
                            <h1 className="text-red-400">{errorMessage}</h1>
                        )}

                        <div className="flex flex-col pt-2 hover:cursor-pointer">
                            <a
                                onClick={() => signUp(email, password)}
                                className="group relative z-0 mt-6 inline-flex items-center justify-center overflow-hidden rounded-lg bg-pipelines-gray-100 px-10 py-2 font-light tracking-wide text-black/80"
                            >
                                <span className="absolute h-0 w-0 rounded-full bg-pipeline-blue-200 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"></span>
                                <span className="absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-200 opacity-30"></span>
                                <span className="relative">Join Pipelines</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
