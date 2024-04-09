import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { HOST } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

// assets
import { Check, Loader2 } from 'lucide-react'

function Newsletter() {
    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Disable the submit button to prevent spamming
        e.target.disabled = true

        setLoading(true)

        // email logic
        try {
            await fetchWithAuth({
                url: `${HOST}/api/email/newsletter`,
                method: 'POST',
                data: { email },
            })

            // If fetchWithAuth doesn't throw, it means the response was ok
            setSuccess(true)
        } catch (error) {
            setErrorMessage(
                error.message || 'Email failed to subscribe. Please try again.'
            )
        } finally {
            setLoading(false)

            // Re-enable the submit button after a certain delay (e.g., 3 seconds)
            setTimeout(() => {
                e.target.disabled = false
            }, 3000) // 3 seconds delay before re-enabling the button
        }
    }

    return (
        <section
            className="flex h-full w-full flex-col items-center justify-center pb-40 pt-40"
            style={{
                backgroundImage: 'url("hero.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100dvh',
            }}
        >
            <div className="mt-16 flex w-full flex-col items-center justify-center gap-4 text-center">
                {/* Hero */}
                <h1 className="xs:text-6xl mx-8 text-center text-5xl font-normal text-pipelines-gray-100 sm:text-5xl md:text-7xl lg:text-7xl xl:text-8xl">
                    Pipelines <br />
                    <span className="whitespace-nowrap font-normal text-pipeline-blue-200">
                        Coming Soon <br />
                    </span>
                </h1>

                <p className="xs:text-md mx-12 my-8 max-w-2xl text-lg font-light text-gray-300 sm:text-lg md:text-xl lg:text-xl xl:text-2xl">
                    Signup for our newsletter to receive information on when we
                    launch!
                </p>

                {/* Input field for email */}
                <div className="flex w-full max-w-xs justify-center sm:max-w-sm md:max-w-md">
                    <form className="flex flex-row" onSubmit={handleSubmit}>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Your email address"
                            className="w-full rounded-l-lg border bg-gray-50 px-4 py-4 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setSuccess(false)
                                setErrorMessage('')
                            }}
                        />
                        <button
                            type="submit"
                            className="whitespace-nowrap rounded-r-lg bg-pipeline-blue-200 px-6 py-4 font-bold text-white hover:bg-blue-700"
                        >
                            {!success && !loading && <h1>Notify Me!</h1>}
                            {success && <Check />}
                            {loading && <Loader2 className="animate-spin" />}
                        </button>
                    </form>
                </div>

                {errorMessage && <p className="text-red-300">{errorMessage}</p>}

                {/* Grayed-out link for the secret code */}
                <button onClick={() => navigate('/code')}>
                    <h1 className="mt-4 text-gray-500 underline hover:text-gray-400">
                        I have a secret code!
                    </h1>
                </button>
            </div>
        </section>
    )
}

export default Newsletter
