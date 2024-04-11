import { useEffect, useState } from 'react'
import { PipelineCard } from '../components/PipelineCard'

import { HOST } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

import { ArrowLeft, ArrowRight } from 'lucide-react'

// components
import Loading from './Loading'

function Discover() {
    const [profiles, setProfiles] = useState([])
    const [currentProfiles, setCurrentProfiles] = useState([])
    const [loading, setLoading] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const PROFILES_PER_PAGE = 12

    const generateProfiles = async () => {
        setLoading(true)

        try {
            const data = await fetchWithAuth({
                url: `${HOST}/api/pipeline/random`,
                method: 'GET',
            })

            setProfiles([...data])
            getPageProfiles(1, data) // get the profiles for the first page
        } catch (error) {
            console.error('Error:', error.message)
        } finally {
            setLoading(false)
        }
    }

    const getPageProfiles = (page, profiles) => {
        const startIndex = (page - 1) * PROFILES_PER_PAGE
        let endIndex = startIndex + PROFILES_PER_PAGE

        // Ensure endIndex does not exceed the length of profiles
        endIndex = Math.min(endIndex, profiles.length)

        const slicedProfiles = profiles.slice(startIndex, endIndex)
        setCurrentProfiles(slicedProfiles)
    }

    useEffect(() => {
        generateProfiles()
    }, [])

    // page navigation
    const nextPage = () => {
        if (profiles && currentPage < profiles.length / PROFILES_PER_PAGE) {
            const newPage = currentPage + 1
            getPageProfiles(newPage, profiles)
            setCurrentPage(newPage)
        }
    }

    const previousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            getPageProfiles(newPage, profiles)
            setCurrentPage(newPage)
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center pt-20 text-center">
            <div className="flex w-full flex-col items-center justify-center pt-16">
                <div
                    className="flex w-full flex-col items-center justify-center gap-5  text-center"
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
                    {/* Header */}
                    <h1 className="mx-16 mt-16 text-4xl font-light text-pipelines-gray-100 md:mx-20 md:w-4/6 md:text-5xl">
                        Discover The Pipelines of Engineers
                        <div className="mt-4 whitespace-nowrap font-semibold text-pipeline-blue-200 underline underline-offset-8">
                            Around the World
                        </div>
                    </h1>

                    {/* Bouncing Arrow */}
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

                {/* Profile Display */}
                <div className="overflow-y-scrollpt-10 grid min-h-96 w-full grid-cols-1 bg-pipelines-gray-100/10 px-10 pt-10 sm:grid-cols-2 sm:gap-2 sm:px-2 md:grid-cols-3 md:gap-4 md:px-4 lg:grid-cols-4">
                    {currentProfiles.map((profile) => (
                        <div
                            key={`profile_${profile._id}`}
                            className="mb-5 bg-zinc-800 p-7 sm:mb-0 sm:rounded-md"
                        >
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

                {/* Page Navigation */}
                <div className="flex w-full flex-row items-center justify-center gap-8 border-b-[0.5px] border-pipeline-blue-200 bg-pipelines-gray-100/10 bg-opacity-95 pb-12  pt-10">
                    <button onClick={previousPage}>
                        <ArrowLeft />
                    </button>

                    <h1>{currentPage}</h1>

                    <button onClick={nextPage}>
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Discover
