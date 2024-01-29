import { useEffect, useState } from 'react'
import { companies } from '../data/companyData'

import { HOST } from '../util/apiRoutes'
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
            className="flex flex-col items-center justify-center gap-3"
            key={pipeline._id}
        >
            <ConditionalLink
                className="w-2/3"
                condition={true}
                to={`/user/${profileId}`}
            >
                <div className="mx-auto flex w-4/6 flex-row items-center justify-center gap-4 px-4">
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
    const current = new Date(experience.startDate) > new Date()
    const formatDateToMMYY = (dateString) => {
        // Converts 2023-01-01T00:00:00.000Z to January 2023
        const date = new Date(dateString)

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return 'Invalid Date'
        }

        const options = { year: 'numeric', month: 'long' }
        return date.toLocaleDateString(undefined, options)
    }

    function capitalize(str) {
        // shoutout bobdagoat
        if (typeof str !== 'string' || str.trim() === '') {
            // bad input
            return str
        }

        const formattedCompany = companies.find(
            (company) => company.name.toLowerCase() === str.toLowerCase()
        )

        if (formattedCompany) {
            console.log('found', formattedCompany.name)
            return formattedCompany.name
        }

        return str
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const navigate = useNavigate()

    return (
        <div
            className="flex flex-col items-center justify-center gap-3"
            key={experience._id}
        >
            <div className="inline-block rounded-md  p-2 backdrop-blur-2xl backdrop-filter">
                <img
                    className="h-24 w-24 rounded-md object-contain"
                    src={experience.logo}
                    alt={`${capitalize(experience.companyName)}_logo`}
                />
                <div className="absolute left-2 top-5 h-24 w-24 animate-blob rounded-full bg-pipelines-gray-100/20 opacity-70 mix-blend-multiply blur-xl filter" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-pipelines-gray-100">
                    {capitalize(experience.companyName)}
                </h1>
                <h1 className="text-xl font-thin italic text-pipelines-gray-100">
                    {experience.title}
                </h1>
                <h1 className="text-xl font-light text-pipelines-gray-100 opacity-60">
                    {formatDateToMMYY(experience.startDate)} -{' '}
                    {!experience.isIndefinite
                        ? formatDateToMMYY(experience.endDate)
                        : !current
                          ? 'Present'
                          : 'Indefinite'}
                </h1>
            </div>
        </div>
    )
}
