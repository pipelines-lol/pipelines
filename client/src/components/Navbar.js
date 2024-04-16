import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

import { HOMEPAGE, HOST } from '../util/apiRoutes'
import { CLIENT_ID, SCOPE } from '../util/linkedinUtils'
import { fetchWithAuth } from '../util/fetchUtils'
import { generateToken } from '../util/tokenUtils'
import { isObjEmpty } from '../util/generalUtils'

import MobileNavigationBar from './nav/Mobile'
import NonMobileNavbar from './nav/NonMobile'

const Navbar = () => {
    const [mobileNavbar, toggleMobileNavbar] = useState(false)
    const navigate = useNavigate()
    const { user, dispatch } = useAuthContext()

    // taken from linkedin api
    const [linkedinUserInfo, setLinkedinUserInfo] = useState({})
    const [pfp, setPfp] = useState(null)

    const linkedinRedirectUrl = `https://linkedin.com/oauth/v2/authorization?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${HOMEPAGE}`

    const login = async ({ email, ...data }) => {
        try {
            const user = await fetchWithAuth({
                url: `${HOST}/api/user/login`,
                method: 'POST',
                data: { email },
            })

            localStorage.setItem('user', JSON.stringify(user))

            // Update AuthContext
            dispatch({ type: 'LOGIN', payload: user })

            // SPECIAL CASE: user with profile created on logged in
            if (user.profileCreated) {
                dispatch({ type: 'CREATED', payload: user })
            }
            await updateProfile(user.profileId, data)

            // Redirect to home
            navigate('/')
        } catch (error) {
            console.error(error.message)
        }
    }

    const logout = () => {
        setLinkedinUserInfo(null)

        dispatch({ type: 'LOGOUT' })
        localStorage.setItem('user', null)

        navigate('/')
    }

    const updateProfile = async (profileId, data = {}) => {
        if (isObjEmpty(linkedinUserInfo) && !data) {
            return
        }

        const { given_name, family_name, locale, picture, vanity_name } =
            !isObjEmpty(linkedinUserInfo) ? linkedinUserInfo : data

        const profile = {
            firstName: given_name,
            lastName: family_name,
            location: locale.country,
            pfp: picture,
            linkedin: `https://linkedin.com/in/${vanity_name}`,
            created: true,
        }

        try {
            await fetchWithAuth({
                url: `${HOST}/api/profile/get/${profileId}`,
                method: 'PATCH',
                data: profile, // This is the profile data to be updated
            })

            // Set user data
            dispatch({ type: 'CREATED' })

            // Set new user in local storage (with profile created)
            const storedUser = JSON.parse(localStorage.getItem('user'))
            storedUser.profileCreated = true
            localStorage.setItem('user', JSON.stringify(storedUser))

            // Navigate to home or another page
            navigate('/')
        } catch (error) {
            console.error(error.message)
        }
    }

    const fetchPfp = async () => {
        if (!user || !user.profileCreated) return

        try {
            const data = await fetchWithAuth({
                url: `${HOST}/api/pfp/${user.profileId}`,
                method: 'GET',
            })

            setPfp(data.pfp)
        } catch (error) {
            console.error(error.message)
            setPfp(null)
        }
    }

    // checking for code after linkedin login
    const [authCode, setAuthCode] = useState(null)

    useEffect(() => {
        async function checkForLinkedinToken() {
            const windowUrl = window.location.href
            if (windowUrl.includes('code=')) {
                const codeMatch = windowUrl.match(/code=([a-zA-Z0-9_-]+)/)
                if (!codeMatch) return

                setAuthCode(codeMatch[1])
            }
        }

        checkForLinkedinToken()
    }, [])

    useEffect(() => {
        async function handleLinkedinToken() {
            if (!authCode) return

            try {
                const url = `${HOST}/api/user/linkedin/userinfo?code=${authCode}`
                const { token, ...data } = await fetchWithAuth({
                    url,
                    method: 'GET',
                })

                setLinkedinUserInfo(data)
                localStorage.setItem('linkedinToken', token)
                await generateToken()
                await login(data)
            } catch (error) {
                console.error(error.message)
            }
        }

        handleLinkedinToken()
    }, [authCode]) // Run when authCode or user changes

    // check if user info is available, if so, log in user
    useEffect(() => {
        async function checkForUserInfo() {
            // Edge case: If linkedinUserInfo is not available or user is already logged in, return
            if (linkedinUserInfo || !user) return

            // Extract email from linkedinUserInfo
            const email = user.email

            // If email is available, attempt to log in the user
            if (email) {
                await login({ email })
            }
        }

        checkForUserInfo()
    }, [linkedinUserInfo, user])

    useEffect(() => {
        const fetchInfo = async () => {
            await fetchPfp()
        }

        fetchInfo()
    }, [user])

    return (
        <>
            <header
                className={`fixed left-0 top-0 h-16 w-full px-12 sm:p-0  ${mobileNavbar ? 'z-50 bg-black/90 bg-opacity-5 shadow-md backdrop-blur-lg backdrop-filter' : 'z-50 bg-transparent bg-opacity-5 shadow-md backdrop-blur-lg backdrop-filter'}`}
            >
                <NonMobileNavbar
                    pfp={pfp}
                    linkedinRedirectUrl={linkedinRedirectUrl}
                    logout={logout}
                    user={user}
                />
                <MobileNavigationBar
                    linkedinRedirectUrl={linkedinRedirectUrl}
                    user={user}
                    dispatch={dispatch}
                    toggleMobileNavbar={toggleMobileNavbar}
                    mobileNavbar={mobileNavbar}
                />
            </header>
        </>
    )
}

export default Navbar
