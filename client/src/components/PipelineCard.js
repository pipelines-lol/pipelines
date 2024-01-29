import { useEffect, useState } from 'react'
import { companies } from '../data/companyData'

import { HOMEPAGE, HOST } from '../util/apiRoutes'
import { ConditionalLink } from './ConditionalLink'

export const PipelineCard = ({ profileId, name, pfp, anonymous, pipeline }) => {
    const [pfpUrl, setPfpUrl] = useState(null)

    const fetchPfp = async () => {
        if (!profileId || profileId === '') return
        if (!pfp || pfp === '') return

        try {
            const response = await fetch(`${HOST}/api/pfp/${profileId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                // Check if the response has JSON content
                if (
                    response.headers
                        .get('content-type')
                        ?.includes('application/json')
                ) {
                    const errorData = await response.json()
                    throw new Error(`${errorData.error}`)
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
            }

            const data = await response.json()
            setPfpUrl(data.pfp)
        } catch (error) {
            console.error(error.message)
            setPfpUrl(null)
        }
    }

    useEffect(() => {
        const fetchInfo = async () => {
            await fetchPfp()
        }

        fetchInfo()
    }, [])

    return (
        <div
            className="flex flex-col items-center justify-center gap-3 p-5"
            key={pipeline._id}
        >
            <ConditionalLink
                className="w-2/3"
                condition={true}
                to={`/user/${profileId}`}
            >
                <div className="flex w-full flex-row items-center justify-end gap-3 sm:gap-5 ">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={anonymous ? 'avatar.png' : pfpUrl || 'avatar.png'}
                        alt="avatar"
                    />
                    <h1 className="mx-auto whitespace-nowrap text-xl font-light uppercase text-pipelines-gray-100">
                        {anonymous ? 'Anonymous' : name}
                    </h1>
                </div>
            </ConditionalLink>

            <div className="flex flex-row gap-3">
                {pipeline.length > 0 && (
                    <div
                        className="flex flex-row items-center justify-center gap-3"
                        key={pipeline[pipeline.length - 1]._id}
                    >
                        <ExperienceCard
                            experience={pipeline[pipeline.length - 1]}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
import { useNavigate } from 'react-router-dom'

export const ExperienceCard = ({ experience }) => {
    function getLogoByName(companyName) {
        const foundCompany = companies.find(
            (company) => company.name === companyName
        )
        return foundCompany ? foundCompany.logo : null
    }

    const logo = `${HOMEPAGE}/logos/${getLogoByName(experience.company)}`

    const navigate = useNavigate()

    return (
        <div
            className="flex flex-col items-center justify-center gap-3"
            key={experience._id}
        >
            <img
                className="flex h-24 w-24 items-center justify-center rounded-md object-contain transition duration-500 hover:scale-125 hover:cursor-pointer hover:bg-indigo-300"
                src={logo}
                alt={`${experience.company}_logo`}
                onClick={() => {
                    navigate(`/company/${experience.company.toLowerCase()}`)
                }}
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
