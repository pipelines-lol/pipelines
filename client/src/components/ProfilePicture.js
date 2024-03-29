import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { HOST } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

export const ProfilePicture = ({ profile, setPfp }) => {
    const { id } = useParams()

    const [fetchedPfp, setFetchedPfp] = useState(null)

    const fetchPfp = async () => {
        try {
            const data = await fetchWithAuth({
                url: `${HOST}/api/pfp/${id}`,
                method: 'GET',
            })

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
