import { createContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import { HOST } from '../util/apiRoutes'

export const SessionContext = createContext()

export const SessionContextProvider = ({ children }) => {
    useEffect(() => {
        // Function to initialize session
        const initializeSession = async () => {
            const currentSessionId = Cookies.get('sessionId')
            console.log(currentSessionId)

            if (!currentSessionId || currentSessionId === 'undefined') {
                // Use fetch to get a new session ID if one does not already exist
                try {
                    const response = await fetch(`${HOST}/api/token`)

                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }

                    const data = await response.json()
                    Cookies.set('sessionId', data) // Store the session ID
                } catch (error) {
                    console.error('Error:', error)
                }
            }
        }

        initializeSession()
    }, [])

    return (
        <SessionContext.Provider value={{}}>{children}</SessionContext.Provider>
    )
}
