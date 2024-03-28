import { createContext, useReducer, useEffect } from 'react'

export const AdminContext = createContext()

export const adminReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ADMIN':
            return { admin: action.payload } // action.payload should be a boolean
        case 'LOGOUT':
            return { admin: false }
        default:
            return state
    }
}

export const AdminContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(adminReducer, {
        admin: false, // default to non-admin
    })

    useEffect(() => {
        // Example: retrieve admin status from localStorage
        const isAdmin = localStorage.getItem('admin') === true
        dispatch({ type: 'SET_ADMIN', payload: isAdmin })
    }, [])

    return (
        <AdminContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AdminContext.Provider>
    )
}
