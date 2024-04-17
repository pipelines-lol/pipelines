import Cookies from 'js-cookie'

import { HOST } from './apiRoutes'

export const generateToken = async () => {
    const tokenKeys = ['linkedin', 'admin']
    const tokenQueries = []

    // loop through tokens needed and fetch them
    for (const tokenKey of tokenKeys) {
        const tokenName = `${tokenKey}Token`
        const token = localStorage.getItem(tokenName)

        // if the token exists, add it to the token pieces
        if (token) {
            tokenQueries.push(`${tokenName}=${token}`)
        }
    }

    // Construct the URL dynamically based on the tokens array
    const tokenParams =
        tokenQueries.length > 0 ? '?' + tokenQueries.join('&') : ''
    const url = `${HOST}/api/token${tokenParams}`

    // Use fetch to get a new session ID if one does not already exist
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        Cookies.set('token', data) // Store the session ID
        return data
    } catch (error) {
        console.error('Error:', error)
    }
}
