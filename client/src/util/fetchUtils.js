import Cookies from 'js-cookie'

import { generateToken } from './tokenUtils'

export const fetchWithAuth = async ({
    url,
    method,
    data = {},
    headers = {},
}) => {
    // Default headers including Authorization
    const defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('sessionId')}`,
    }

    // Combine default headers with any custom headers passed in
    const combinedHeaders = { ...defaultHeaders, ...headers }

    const fetchOptions = {
        method: method,
        headers: combinedHeaders,
    }

    if (data && Object.keys(data).length) {
        fetchOptions.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(url, fetchOptions)

        // Check for a 400 or 401 Unauthorized status code to detect invalid token
        if (response.status === 400) {
            // Invalid token, regenerate it and retry the request
            const newToken = generateToken()
            combinedHeaders.Authorization = `Bearer ${newToken}`

            // Retry the request with the new token
            return fetchWithAuth({
                url,
                method,
                data,
                headers: combinedHeaders,
            })
        }

        if (!response.ok) {
            // If response status is not in the range 200-299, parse the response body for error message
            const error = await response.json()
            throw new Error(error.error)
        }

        return response.json()
    } catch (error) {
        // If there's an error during the fetch operation, include its message in the thrown error
        throw new Error(error.message)
    }
}
