import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminContext } from '../../hooks/useAdminContext'

function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()
    const { dispatch } = useAdminContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        // authentication logic
        try {
            const response = await fetch(
                'http://localhost:4000/api/admin/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                }
            )

            if (response.ok) {
                // update admin state
                dispatch({ type: 'SET_ADMIN', payload: true })

                // navigate to dashboard
                navigate('/admin/dashboard')
            } else {
                throw new Error('Failed to login')
            }
        } catch (error) {
            setErrorMessage(error.message)
            dispatch({ type: 'SET_ADMIN', payload: false })
        }
    }

    return (
        <div
            className="flex min-h-[90vh] flex-col items-center justify-center bg-gray-100"
            style={{
                backgroundImage: 'url("hero.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '50dvh',
                borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                borderTop: '1px solid rgba(2, 101, 172, 0.3)',
            }}
        >
            <div className="flex w-full max-w-md flex-col items-center gap-5 space-y-8 rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 px-24 py-12 text-pipelines-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        Admin Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-blue-900 px-3 py-2 text-gray-300 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-blue-900 px-3 py-2 text-gray-300 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Sign in
                        </button>
                    </div>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
