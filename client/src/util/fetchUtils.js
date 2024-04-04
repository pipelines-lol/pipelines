import Cookies from 'js-cookie'

import { generateToken } from './tokenUtils'

export const fetchWithAuth = async ({
    url,
    method,
    data = {},
    headers = {},
    retry = false,
}) => {
    // Default headers including Authorization
    const defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
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

        // if this is the first catch at an unauthorized call
        // try and regenerate the token
        if (!retry && response.status === 401) {
            // Invalid token, regenerate it and retry the request
            const newToken = await generateToken()
            combinedHeaders.Authorization = `Bearer ${newToken}`

            // Retry the request with the new token
            return fetchWithAuth({
                url,
                method,
                data,
                headers: combinedHeaders,
                retry: true,
            })
        }

        if (!response.ok) {
            const errorMessage = await getErrorMessage(response)
            throw new Error(errorMessage)
        }

        return response.json()
    } catch (error) {
        throw new Error(
            error.message || 'An error occurred during the fetch operation.'
        )
    }
}

async function getErrorMessage(response) {
    try {
        const error = await response.json()
        return (
            error.error ||
            error.message ||
            error.msg ||
            `Error occurred with response ${error.response}`
        )
    } catch (err) {
        return `Error occurred with response ${response.status} ${response.statusText}`
    }
}
