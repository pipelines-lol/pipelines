import { useEffect, useState } from 'react'
import { PipelineCard } from '../components/PipelineCard'
import { HOST } from '../util/apiRoutes'
import Loading from './Loading'

function Discover() {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(false)

    const generateProfiles = async () => {
        const size = 24
        setLoading(true)

        fetch(`${HOST}/api/pipeline/random/${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
        })
            .then((res) => {
                if (!res.ok) {
                    // Check if the response has JSON content
                    if (
                        res.headers
                            .get('content-type')
                            ?.includes('application/json')
                    ) {
                        return res.json().then((errorData) => {
                            throw new Error(`${errorData.error}`)
                        })
                    } else {
                        throw new Error(`HTTP error! Status: ${res.status}`)
                    }
                }
                return res.json()
            })
            .then((data) => {
                setProfiles([...data])
                setLoading(false)
            })
            .catch((error) => {
                console.error(error.message)
            })
    }

    useEffect(() => {
        generateProfiles()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center pt-20 text-center">
            <div className="flex w-full flex-col items-center justify-center pt-16">
                <div
                    className="flex w-full flex-col items-center justify-center gap-5 bg-pipeline-blue-200/20 text-center"
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
                    <h1 className="mx-16 mt-16 text-4xl font-light text-pipelines-gray-100 md:mx-20 md:w-4/6 md:text-5xl">
                        Discover The Pipelines of Engineers
                        <div className="mt-4 whitespace-nowrap font-semibold text-pipeline-blue-200 underline underline-offset-8">
                            Around the World
                        </div>
                    </h1>

                    <div className="translate-y-4 transform">
                        <svg
                            className="mt-8 h-12 animate-bounce text-pipeline-blue-200"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M12 18l-6-6h12l-6 6z"
                            ></path>
                        </svg>
                    </div>
                </div>
                <div className="grid min-h-96 grid-cols-1 overflow-y-scroll bg-pipeline-blue-200/15 pb-12 pt-20 sm:grid-cols-2 sm:gap-2 md:grid-cols-4 md:gap-4">
                    {profiles.map((profile) => (
                        <div key={`profile_${profile._id}`}>
                            <div className="p-5"></div>
                            <PipelineCard
                                key={`pipeline_${profile._id}`}
                                profileId={profile._id}
                                name={
                                    profile.firstName + ' ' + profile.lastName
                                }
                                pfp={profile.pfp}
                                anonymous={profile.anonymous}
                                pipeline={profile.pipeline}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Discover
