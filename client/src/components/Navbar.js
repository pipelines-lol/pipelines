import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

import { HOMEPAGE, HOST } from '../util/apiRoutes'
import { CLIENT_ID, SCOPE } from '../util/linkedinKeys'

import { useEffect, useState } from 'react'
import MobileNavigationBar from './nav/Mobile'
import NonMobileNavbar from './nav/NonMobile'

const Navbar = () => {
    const [mobileNavbar, toggleMobileNavbar] = useState(false)
    const navigate = useNavigate()
    const { user, dispatch } = useAuthContext()

    // taken from linkedin api

    const [linkedinUserInfo, setUserLinkedinInfo] = useState({})
    const [pfp, setPfp] = useState(null)

    const linkedinRedirectUrl = `https://linkedin.com/oauth/v2/authorization?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${HOMEPAGE}`

    const login = async (email) => {
        try {
            const response = await fetch(`${HOST}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                // Check if the response has JSON content
                if (
                    response.headers
                        .get('content-type')
                        ?.includes('application/json')
                ) {
                    const errorData = await response.json()
                    throw new Error(`${errorData.error}`)
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
            }

            const user = await response.json()

            localStorage.setItem('user', JSON.stringify(user))

            // update AuthContext
            dispatch({ type: 'LOGIN', payload: user })

            // SPECIAL CASE: first time user logged in
            if (!user.profileCreated) {
                await createProfile(user.profileId)
            }

            // redirect to home
            navigate('/')
        } catch (error) {
            console.error(error.message)
        }
    }

    const logout = () => {
        setUserLinkedinInfo(null)

        dispatch({ type: 'LOGOUT' })
        localStorage.setItem('user', null)

        navigate('/')
    }

    const createProfile = async (profileId) => {
        if (!linkedinUserInfo) {
            return
        }

        const { givenName, familyName, locale, picture, vanityName } =
            linkedinUserInfo

        const profile = {
            firstName: givenName,
            lastName: familyName,
            location: locale.country,
            pfp: picture,
            linkedin: `https://linkedin.com/in/${vanityName}`,
            created: true,
        }

        try {
            const response = await fetch(`${HOST}/api/profile/${profileId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify(profile),
            })

            if (!response.ok) {
                // Check if the response has JSON content
                if (
                    response.headers
                        .get('content-type')
                        ?.includes('application/json')
                ) {
                    const errorData = await response.json()
                    throw new Error(`${errorData.error}`)
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
            }

            // set user data
            dispatch({ type: 'CREATED' })

            // set new user in local storage (with profile created)
            const storedUser = JSON.parse(localStorage.getItem('user'))
            storedUser.profileCreated = true
            localStorage.setItem('user', JSON.stringify(storedUser))

            navigate('/')
        } catch (error) {
            console.error(error.message)
        }
    }

    const fetchPfp = async () => {
        if (!user || !user.profileCreated) return

        try {
            const response = await fetch(`${HOST}/api/pfp/${user.profileId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                // Check if the response has JSON content
                if (
                    response.headers
                        .get('content-type')
                        ?.includes('application/json')
                ) {
                    const errorData = await response.json()
                    throw new Error(`${errorData.error}`)
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
            }

            const data = await response.json()
            setPfp(data.pfp)
        } catch (error) {
            console.error(error.message)
            setPfp(null)
        }
    }

    // checking for code after linkedin login
    useEffect(() => {
        async function checkForLinkedinToken() {
            const windowUrl = window.location.href
            if (windowUrl.includes('code=')) {
                const codeMatch = windowUrl.match(/code=([a-zA-Z0-9_-]+)/)

                try {
                    const response = await fetch(
                        `${HOST}/api/user/linkedin/userinfo`,
                        {
                            method: 'GET',
                            headers: {
                                auth_code: codeMatch[1],
                            },
                        }
                    )

                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        )
                    }

                    const data = await response.json()

                    setUserLinkedinInfo(data)
                } catch (error) {
                    console.error(error.message)
                }
            }
        }

        checkForLinkedinToken()
    }, [])

    // check if user info is available, if so, log in user
    useEffect(() => {
        async function checkForUserInfo() {
            // edge case for old logged in users
            if (!linkedinUserInfo && user) return logout()

            if (!linkedinUserInfo) return
            if (user) return

            const email = linkedinUserInfo.email
            if (email) {
                login(email)
            }
        }

        checkForUserInfo()
    }, [user, linkedinUserInfo])

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
