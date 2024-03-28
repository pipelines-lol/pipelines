import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'

import { HOST } from '../util/apiRoutes'

export const ProfilePicture = ({ profile, setPfp }) => {
    const { id } = useParams()

    const [fetchedPfp, setFetchedPfp] = useState(null)

    const fetchPfp = async () => {
        try {
            const response = await fetch(`${HOST}/api/pfp/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('sessionId')}`,
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
            setPfp(data.pfp)
            setFetchedPfp(data.pfp)
        } catch (error) {
            console.error(error.message)
            setPfp(null)
        }
    }

    useEffect(() => {
        const fetchInfo = async () => {
            await fetchPfp()
        }

        fetchInfo()
    }, [])

    const src = fetchedPfp || '/avatar.png'

    return (
        <>
            <div className="relative h-48 w-48 overflow-hidden rounded-full">
                <img
                    src={!profile.anonymous ? src : '/avatar.png'}
                    className="h-full w-full transform rounded-full object-cover transition-transform hover:scale-105"
                    alt={`${profile._id}_avatar`}
                />
            </div>
        </>
    )
}
