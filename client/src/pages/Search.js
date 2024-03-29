import { useState, useCallback } from 'react'
import Cookies from 'js-cookie'

import { HOST } from '../util/apiRoutes'

// components
import Loading from './Loading'
import { PipelineDisplay } from '../components/PipelineDisplay'
import { PipelineCard } from '../components/PipelineCard'
import { QuerySearchInput } from '../components/QuerySearchInput'

// assets
import { LayoutGrid, Rows3 } from 'lucide-react'

function Search() {
    const [profiles, setProfiles] = useState([])

    const [loading, setLoading] = useState(false)
    const [noneFound, setNoneFound] = useState(false)

    const [viewMode, setViewMode] = useState('grid')

    const handleSearch = useCallback(
        async (query) => {
            // loading state to load query
            setLoading(true)

            try {
                setLoading(true)

                const data = await fetchWithAuth({
                    url: `${HOST}/api/pipeline/search/company/${query.name}`,
                    method: 'GET',
                })

                // Assuming fetchWithAuth throws for non-OK responses, including 404
                setNoneFound(false) // If the fetch was successful, there's no 404, so we assume some results were found
                setProfiles([...data]) // Update the profiles state with the fetched data
            } catch (error) {
                console.error('Error:', error.message)

                // Handle specific conditions like 404 Not Found
                if (error.message.includes('404')) {
                    setNoneFound(true)
                } else {
                    // Handle other errors generically
                    setErrorMessage(
                        error.message || 'An error occurred during the search.'
                    )
                }
            } finally {
                setLoading(false)
            }
        },
        [setLoading, setNoneFound, setProfiles]
    )

    if (loading) {
        return <Loading />
    }

    const gridView = (
        <div className="my-4 grid grid-cols-2 gap-1 pb-12 sm:gap-2 md:grid-cols-4 md:gap-4">
            {noneFound ? (
                <div className="col-span-full mt-9 text-center text-3xl font-bold text-pipelines-gray-500">
                    No users on this site for this company :/
                </div>
            ) : (
                profiles.map((profile) => (
                    <PipelineCard
                        key={`pipeline_${profile._id}`}
                        profileId={profile._id}
                        name={profile.firstName + ' ' + profile.lastName}
                        pfp={profile.pfp}
                        anonymous={profile.anonymous}
                        pipeline={profile.pipeline}
                    />
                ))
            )}
        </div>
    )

    const pipelineView = (
        <div className="my-4 flex flex-col gap-16 pb-12">
            {noneFound ? (
                <div className="col-span-full mt-9 text-center text-3xl font-bold text-pipelines-gray-500">
                    No users on this site for this company :/
                </div>
            ) : (
                profiles.map((profile) => (
                    <PipelineDisplay
                        key={`pipeline_${profile._id}`}
                        profileId={profile._id}
                        name={profile.firstName + ' ' + profile.lastName}
                        pfp={profile.pfp}
                        anonymous={profile.anonymous}
                        pipeline={profile.pipeline}
                    />
                ))
            )}
        </div>
    )

    const ViewButtons = () => (
        <div className="flex flex-row items-center justify-center gap-5">
            <button
                className={`rounded-lg p-1 ${viewMode === 'grid' ? 'bg-white bg-opacity-30' : 'transition-all duration-300 hover:bg-white hover:bg-opacity-30'}`}
                onClick={() => setViewMode('grid')}
            >
                <LayoutGrid />
            </button>

            <button
                className={`rounded-lg p-1 ${viewMode === 'pipeline' ? 'bg-white bg-opacity-30' : 'transition-all duration-300 hover:bg-white hover:bg-opacity-30'}`}
                onClick={() => setViewMode('pipeline')}
            >
                <Rows3 />
            </button>
        </div>
    )

    return (
        <>
            <div className="flex min-h-[90vh] w-full flex-col items-center justify-center gap-12 bg-black/20 pt-24">
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
                    <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
                        <h1 className="text-4xl font-light text-pipelines-gray-100 md:text-6xl">
                            Find Your{' '}
                            <span className="text-pipeline-blue-200">
                                Pipeline
                            </span>
                        </h1>
                        <p className="text-xl font-light text-pipelines-gray-100/80">
                            See where you were. Find where you are. <br />{' '}
                            Search where you can be.
                        </p>
                    </div>
                    <QuerySearchInput handleSearch={handleSearch} />
                    <ViewButtons />
                </div>
                {viewMode === 'grid' ? gridView : pipelineView}
            </div>
        </>
    )
}

export default Search
