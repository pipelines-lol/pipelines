import mockPipelineData from '../../data/index'
import { PipelineCard } from '../PipelineCard'

export default function People() {
    // TODO: replace with actual data
    const profiles = mockPipelineData
    return (
        <>
            <section className="flex h-full w-full flex-row flex-wrap items-center justify-center border-t-[0.5px] border-pipeline-blue-200 bg-white/5 bg-opacity-95  py-20 backdrop-blur-lg backdrop-filter">
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
