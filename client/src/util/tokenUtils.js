import Cookies from 'js-cookie'

import { HOST } from './apiRoutes'

export const generateToken = async () => {
    const linkedinToken = localStorage.getItem('linkedinToken')

    // Use fetch to get a new session ID if one does not already exist
    try {
        const url = `${HOST}/api/token${linkedinToken ? `?linkedinToken=${linkedinToken}` : ''}`
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
