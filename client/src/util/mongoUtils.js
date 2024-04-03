import { HOST } from './apiRoutes'
import { fetchWithAuth } from './fetchUtils'

export const isMongoDBId = async (id) => {
    try {
        const response = await fetchWithAuth({
            url: `${HOST}/api/mongodbId/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return response
    } catch (error) {
        console.error(error.message)
        return true
    }
}
