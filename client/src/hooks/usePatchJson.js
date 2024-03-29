import { useState } from 'react'
import Cookies from 'js-cookie'

const usePatchJson = async (url, dataToUpdate) => {
    // State to manage response data
    const [responseData, setResponseData] = useState(null)
    // State to manage loading state
    const [loading, setLoading] = useState(true)
    // State to manage error state
    const [error, setError] = useState(null)

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('sessionId')}`,
            },
            body: JSON.stringify(dataToUpdate), // Assuming you have data to update
        })

        if (!response.ok) {
            throw new Error(`Failed to update data. Status: ${response.status}`)
        }

        const result = await response.json()
        setResponseData(result)
    } catch (error) {
        setError(error.message)
    } finally {
        setLoading(false)
    }

    // Return the state values
    return { responseData, loading, error }
}

export default usePatchJson
