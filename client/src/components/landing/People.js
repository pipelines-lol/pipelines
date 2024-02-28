import { useEffect, useState } from 'react'
import Loading from '../../pages/Loading'
import { HOST } from '../../util/apiRoutes'
import { PipelineCard } from '../PipelineCard'
import { useNavigate } from 'react-router-dom'
export default function People() {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const generateProfiles = async () => {
        const size = 3
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

    const handleNavigation = () => {
        navigate('/discover')
    }

    useEffect(() => {
        generateProfiles()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <section className="flex h-full w-full flex-row flex-wrap items-center justify-center border-t-[0.5px] border-pipeline-blue-200 bg-pipelines-gray-100/10 bg-opacity-95  py-20 backdrop-blur-lg backdrop-filter">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                    <h1 className="xs:text-xl mx-8 text-center text-xl font-light text-pipelines-gray-100/80 sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">
                        People from{' '}
                        <span className="font-semibold text-pipeline-blue-200 underline underline-offset-8">
                            Around the World
                        </span>{' '}
                        are Sharing Their Pipelines
                    </h1>

                    <div className="flex h-full w-full flex-row flex-wrap items-center justify-center gap-4">
                        {profiles.map((profile) => (
                            <div key={`profile_${profile._id}`}>
                                <div className="py-5"></div>
                                <PipelineCard
                                    key={`pipeline_${profile._id}`}
                                    profileId={profile._id}
                                    name={
                                        profile.firstName +
                                        ' ' +
                                        profile.lastName
                                    }
                                    pfp={profile.pfp}
                                    anonymous={profile.anonymous}
                                    pipeline={profile.pipeline}
                                />
                            </div>
                        ))}
                    </div>
                    <a
                        role="button"
                        onClick={() => handleNavigation()}
                        className="group relative mt-12 inline-flex scale-125 items-center justify-center overflow-hidden rounded-full border-2 border-pipeline-blue-200/50 p-4 px-6 font-medium text-pipeline-blue-200 shadow-md transition duration-300 ease-out"
                    >
                        <span className="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-pipeline-blue-200 text-white duration-300 group-hover:translate-x-0">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                ></path>
                            </svg>
                        </span>
                        <span className="ease absolute flex h-full w-full transform items-center justify-center text-pipelines-gray-100 transition-all duration-300 group-hover:translate-x-full">
                            Discover
                        </span>
                        <span className="invisible relative">
                            Add Your Pipeline
                        </span>
                    </a>
                </div>
            </section>
        </>
    )
}
