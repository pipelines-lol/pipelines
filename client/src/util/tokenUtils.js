import Cookies from 'js-cookie'

import { HOST } from './apiRoutes'

export const generateToken = async () => {
    // Use fetch to get a new session ID if one does not already exist
    try {
        const response = await fetch(`${HOST}/api/token`)

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        Cookies.set('sessionId', data) // Store the session ID
        return data
    } catch (error) {
        console.error('Error:', error)
    }
}
