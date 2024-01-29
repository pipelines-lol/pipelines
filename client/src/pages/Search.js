import { useState, useCallback } from 'react'

import { PipelineCard } from '../components/PipelineCard'
import { QuerySearchInput } from '../components/QuerySearchInput'
import { HOST } from '../util/apiRoutes'
import Loading from './Loading'

function Search() {
    const [profiles, setProfiles] = useState([])

    const [loading, setLoading] = useState(false)

    const [searchPerformed, setSearchPerformed] = useState(false)

    const handleSearch = useCallback(
        async (query) => {
            // loading state to load query
            setLoading(true)
            setSearchPerformed(true)

            try {
                const response = await fetch(
                    `${HOST}/api/pipeline/search/${query}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (!response.ok) {
                    if (
                        response.headers
                            .get('content-type')
                            ?.includes('application/json')
                    ) {
                        const errorData = await response.json()
                        throw new Error(`${errorData.error}`)
                    } else {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        )
                    }
                }

                const data = await response.json()
                setProfiles([...data])
                setLoading(false)
            } catch (error) {
                console.error(error.message)
                setLoading(false)
            }
        },
        [setLoading, setSearchPerformed, setProfiles]
    )

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <div className="flex h-[89vh] w-full flex-col items-center justify-center gap-12 bg-black/20 pt-24">
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
                </div>
                <div className="grid grid-cols-2 gap-1 pb-12 sm:gap-2 md:grid-cols-4 md:gap-4">
                    {searchPerformed && profiles.length === 0 && !loading && (
                        <div className="col-span-full mt-9 text-center text-3xl font-bold text-pipelines-gray-500">
                            No users on this site for this company :/
                        </div>
                    )}
                    {profiles.map((profile) => (
                        <PipelineCard
                            key={`pipeline_${profile._id}`}
                            profileId={profile._id}
                            name={profile.firstName + ' ' + profile.lastName}
                            pfp={profile.pfp}
                            anonymous={profile.anonymous}
                            pipeline={profile.pipeline}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Search
