import { createContext, useReducer, useEffect } from 'react'
import Cookies from 'js-cookie'

import { fetchWithAuth } from '../util/fetchUtils'
import { HOST } from '../util/apiRoutes'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        case 'CREATED':
            return { user: { ...state.user, profileCreated: true } }
        default:
            return state
    }
}

const verifyToken = async (email, token) => {
    try {
        const { isVerified } = await fetchWithAuth({
            url: `${HOST}/api/user/verify`,
            method: 'POST',
            data: { email, token },
        })
        return isVerified
    } catch (error) {
        console.error('Error verifying token:', error)
        return false
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        const token = Cookies.get('token')

        if (user && token) {
            verifyToken(user.email, token).then((isValidToken) => {
                if (isValidToken) {
                    dispatch({ type: 'LOGIN', payload: user })

                    if (user.profileCreated) {
                        dispatch({ type: 'CREATED', payload: user })
                    }
                }
            })
        }
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
