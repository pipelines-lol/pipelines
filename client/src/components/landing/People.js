import { useEffect, useState } from 'react'
import Loading from '../../pages/Loading'
import { HOST } from '../../util/apiRoutes'
import { PipelineCard } from '../PipelineCard'
export default function People() {
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
                </div>
            </section>
        </>
    )
}
