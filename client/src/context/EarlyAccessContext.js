import { createContext, useReducer, useEffect } from 'react'

export const EarlyAccessContext = createContext()

export const earlyAccessReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EARLYACCESS':
            return { earlyAccess: action.payload } // action.payload should be a boolean
        case 'LOGOUT':
            return { earlyAccess: false }
        default:
            return state
    }
}

export const EarlyAccessContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(earlyAccessReducer, {
        earlyAccess: false, // default to no early access
    })

    useEffect(() => {
        // retrieve earlyAccess status from localStorage
        const isEarlyAccess = localStorage.getItem('earlyAccess')
        dispatch({ type: 'SET_EARLYACCESS', payload: isEarlyAccess })
    }, [])

    useEffect(() => {
        // persist state changes to localStorage
        localStorage.setItem('earlyAccess', state.earlyAccess)
    }, [state.earlyAccess])

    return (
        <EarlyAccessContext.Provider value={{ ...state, dispatch }}>
            {children}
        </EarlyAccessContext.Provider>
    )
}
