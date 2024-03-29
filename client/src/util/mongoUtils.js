import Cookies from 'js-cookie'

import { HOST } from './apiRoutes'

export const isMongoDBId = async (id) => {
    try {
        const response = await fetch(`${HOST}/api/mongodbId/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('sessionId')}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`${errorData.error}`)
        }

        const data = await response.json()
        return data.response
    } catch (error) {
        console.error(error.message)
        return true
    }
}
