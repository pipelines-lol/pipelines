import { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export const EarlyAccessContext = createContext()

export const EarlyAccessContextProvider = ({ children }) => {
    const [earlyAccess, setEarlyAccess] = useState(false)

    useEffect(() => {
        // check if user originally had early access
        const access = Cookies.get('earlyAccess')
        if (access === 'true') {
            setEarlyAccess(true)
        }
    }, [])

    const setAccess = (access) => {
        setEarlyAccess(access)
        Cookies.set('earlyAccess', access.toString())
    }

    return (
        <EarlyAccessContext.Provider value={{ earlyAccess, setAccess }}>
            {children}
        </EarlyAccessContext.Provider>
    )
}
