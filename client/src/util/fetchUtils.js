import Cookies from 'js-cookie'
import { useSession } from '../hooks/useSessionContext'

export const fetchWithAuth = async ({
    url,
    method,
    data = {},
    headers = {},
}) => {
    const { generateToken } = useSession()

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

    const response = await fetch(url, fetchOptions)

    // Check for a 400 Unauthorized status code to detect invalid token
    if (response.status === 400) {
        // refresh token and throw error
        generateToken()

        throw new Error('Invalid token. Please try again.')
    }

    if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
    }

    return response.json()
}
