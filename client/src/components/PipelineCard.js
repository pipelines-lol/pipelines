import { companies } from '../data/companyData'
import { ConditionalLink } from './ConditionalLink'

export const PipelineCard = ({ profileId, name, anonymous, pipeline }) => {
    const avatarUrl = 'https://i.pravatar.cc/300'
    const profileLink = `/user/${profileId}`
    const displayName = anonymous ? 'Anonymous' : name
    const lastExperience = pipeline?.[pipeline?.length - 1]
    return (
        <div className="flex flex-col items-center justify-center gap-3 p-5">
            <ConditionalLink
                className="w-2/3"
                condition={true}
                to={profileLink}
            >
                <div className="flex w-full flex-row items-center justify-end gap-3 sm:gap-5 ">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={avatarUrl}
                        alt="avatar"
                    />
                    <h1 className="text-xl font-light uppercase text-pipelines-gray-100">
                        {displayName}
                    </h1>
                </div>
            </ConditionalLink>

            <div className="flex flex-col items-center justify-center gap-3">
                {lastExperience && (
                    <ExperienceCard experience={lastExperience} />
                )}
            </div>
        </div>
    )
}

export const ExperienceCard = ({ experience }) => {
    const randomCompany =
        companies[Math.floor(Math.random() * companies?.length)]
    const logoUrl = `https://pipelines.lol/logos/${randomCompany.logo}`
    return (
        <div className="flex flex-col items-center justify-center gap-3 p-5">
            <img
                className="h-24 w-24 rounded-md object-contain"
                src={logoUrl}
            />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-pipelines-gray-100">
                    {experience.company}
                </h1>
                <h1 className="text-xl font-thin italic text-pipelines-gray-100">
                    {experience.title}
                </h1>
                <h1 className="text-xl font-light text-pipelines-gray-100 opacity-60">
                    {experience.date}
                </h1>
            </div>
        </div>
    )
}
