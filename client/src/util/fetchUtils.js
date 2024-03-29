import Cookies from 'js-cookie'

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

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
        throw new Error('Request failed with status ' + response.status)
    }

    return response.json()
}
