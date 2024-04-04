import { createContext, useReducer, useEffect } from 'react'

import { fetchWithAuth } from '../util/fetchUtils'
import { HOST } from '../util/apiRoutes'

export const AdminContext = createContext()

export const adminReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ADMIN':
            return { admin: action.payload } // action.payload should be a boolean value
        default:
            return state
    }
}

const verifyToken = async (token) => {
    try {
        const { isAdmin } = await fetchWithAuth({
            url: `${HOST}/api/admin/verify`,
            method: 'POST',
            data: { token },
        })
        return isAdmin
    } catch (error) {
        console.error('Error verifying token:', error)
        return false
    }
}

export const AdminContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(adminReducer, {
        admin: false, // Default to null
    })

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (token) {
            verifyToken(token).then((isValidToken) => {
                dispatch({ type: 'SET_ADMIN', payload: isValidToken })
            })
        }
    }, [])

    return (
        <AdminContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AdminContext.Provider>
    )
}
