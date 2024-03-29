import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { HOST } from '../util/apiRoutes'
import { isMongoDBId } from '../util/mongoUtils'

import Loading from './Loading'

import { ExperienceCard } from '../components/PipelineCard'

import { GraduationCap, MapPin } from 'lucide-react'
import { ProfilePicture } from '../components/ProfilePicture'

function Profile() {
    const { id } = useParams()
    const [profile, setProfile] = useState({})

    // for searching through profiles that have
    // id as a username instead of id
    const [profiles, setProfiles] = useState([])

    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)

    const [saveable, setSaveable] = useState(false)

    const [pfp, setPfp] = useState('')
    const [username, setUsername] = useState('')
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [linkedinErrorMessage, setLinkedinErrorMessage] = useState('')

    const [location, setLocation] = useState('')

    const hasError =
        usernameErrorMessage.length !== 0 && linkedinErrorMessage.length !== 0

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const isValidId = await isMongoDBId(id)

            if (isValidId) {
                const response = await fetch(`${HOST}/api/profile/${id}`, {
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
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        )
                    }
                }

                const data = await response.json()
                setProfile(data)

                setUsername(data.username)
                setLinkedin(extractLinkedinUsername(data.linkedin))
                setLocation(data.location)
                setPfp(data.pfp)
            } else {
                setProfile(null)
            }
        } catch (error) {
            console.error(error.message)
            setProfile(null)
            setLoading(false)
        }
    }

    const fetchProfiles = async () => {
        fetch(`${HOST}/api/profile/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
        })
            .then((res) => {
                if (!res.ok) {
                    // Check if the response has JSON content
                    if (
                        res.headers
                            .get('content-type')
                            ?.includes('application/json')
                    ) {
                        return res.json().then((errorData) => {
                            throw new Error(`${errorData.error}`)
                        })
                    } else {
                        throw new Error(`HTTP error! Status: ${res.status}`)
                    }
                }

                return res.json()
            })
            .then((data) => {
                setProfiles(data)

                setLoading(false)
            })
            .catch((error) => {
                console.error(error.message)
            })
    }

    const getCurrentExperience = () => {
        if (!profile || !profile.pipeline) return

        // compare experience dates to todays date
        const currentDate = new Date()
        for (const [index, experience] of profile.pipeline.entries()) {
            const startDate = new Date(experience.startDate)
            const endDate = new Date(experience.endDate)

            // check if current experience date range overlaps current date
            if (
                startDate.getTime() <= currentDate.getTime() &&
                currentDate.getTime() <= endDate.getTime()
            ) {
                const experience = profile.pipeline[index]
                const title = experience.title
                const companyName = experience.displayName
                return {
                    time: 'Currently ',
                    title: title,
                    company: companyName,
                }
            }

            // check if current experience is in the future compared to current date
            if (
                startDate.getTime() >= currentDate.getTime() &&
                endDate.getTime() >= currentDate.getTime()
            ) {
                const experience = profile.pipeline[index]
                const title = experience.title
                const companyName = experience.displayName
                return {
                    time: 'Incoming ',
                    title: title,
                    company: companyName,
                }
            }
        }

        const experience = profile.pipeline[profile.pipeline.length - 1]
        const title = experience.title
        const companyName = experience.displayName
        return {
            time: 'Previously ',
            title: title,
            company: companyName,
        }
    }

    const validateUsername = async (username) => {
        const isValidUsername = async (username) => {
            const mongodbConflict = await isMongoDBId(username)
            const usernameRegex =
                /^[a-zA-Z0-9_](?!.*[._]{2})[a-zA-Z0-9_.]{1,30}[a-zA-Z0-9_]$/
            return !mongodbConflict && usernameRegex.test(username)
        }

        const isAvailable = (username) => {
            const filteredProfiles = profiles.filter(
                (profile) =>
                    profile.username.toLowerCase() === username.toLowerCase()
            )

            // check if the one profile there is the current user's
            if (filteredProfiles.length === 1) {
                const filteredProfile = filteredProfiles[0]

                return profile.username === filteredProfile.username
            }

            return filteredProfiles.length === 0
        }

        // blank username
        if (username.length === 0) {
            setUsernameErrorMessage('Invalid username.')
            return false
        } else if (username.indexOf('/') !== -1) {
            // contains '/'
            setUsernameErrorMessage('Invalid username.')
            return false
        } else if (!(await isValidUsername(username))) {
            // invalid regex
            setUsernameErrorMessage('Invalid username.')
            return false
        } else if (!isAvailable(username)) {
            // taken username
            setUsernameErrorMessage('Username already taken.')
            return false
        } else {
            // valid username
            setUsernameErrorMessage('')
            return true
        }
    }

    const validateLinkedin = async (linkedin) => {
        // Regular expression for a basic LinkedIn username check
        const regex = /^[a-z0-9-]+$/i

        // Check if the username matches the pattern
        if (!regex.test(linkedin)) {
            setLinkedinErrorMessage('Invalid Linkedin username.')
            return false
        } else {
            setLinkedinErrorMessage('')
            return true
        }
    }

    const extractLinkedinUsername = (linkedin) => {
        const regex = /https:\/\/linkedin\.com\/in\/([^/]+)/
        const match = linkedin.match(regex)

        // Check if the regex matched and has the expected parts
        if (match && match[1]) {
            return match[1]
        }

        // If no match, return null or handle it according to your requirements
        return null
    }

    const buildLinkedinUrl = (username) => {
        const baseLinkedinUrl = 'https://linkedin.com/in/'
        return `${baseLinkedinUrl}${username}`
    }

    const handleUsernameChange = async (e) => {
        // change -> saveable progress
        setSaveable(true)

        // remove previous errors
        setUsernameErrorMessage('')

        const value = e.target.value
        setUsername(value)
    }

    const handleLocationChange = async (e) => {
        // change -> saveable progress
        setSaveable(true)

        const value = e.target.value
        setLocation(value)
    }

    const handleEditProfile = async () => {
        const updatedProfile = {
            username,
            linkedin: buildLinkedinUrl(linkedin),
            location,
        }

        // check all fields are filled out
        if (!username || username.length === 0) {
            setUsernameErrorMessage('All fields must be filled.')
            return
        }

        if (!linkedin || linkedin.length === 0) {
            // clear linkedin if user left blank / deleted
            updatedProfile.linkedin = ''
        }

        if (!location || location.length === 0) {
            // clear location if user left blank / deleted
            updatedProfile.location = ''
        }

        // field validation
        if (!validateUsername(username)) {
            return
        }

        if (!validateLinkedin(linkedin)) {
            return
        }

        try {
            const response = await fetch(
                `${HOST}/api/profile/${user.profileId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json', // Specify the content type as JSON
                    },
                    body: JSON.stringify(updatedProfile),
                }
            )

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
        } catch (error) {
            console.error(error.message)
        }

        setSaveable(false)
    }

    useEffect(() => {
        const fetchInfo = async () => {
            await fetchProfile()
            await fetchProfiles()
        }

        fetchInfo()
    }, [id])

    const admin = user && (user.profileId === id || user.username === id)

    const currentExperienceInfo = // {'Incoming / Currently / Previously', Work Title, Company Name}
        profile && profile.pipeline && profile.pipeline.length > 0
            ? getCurrentExperience()
            : null

    if (loading) {
        return <Loading />
    }

    return (
        <div className="flex h-full min-h-[90vh] w-full items-center justify-center pt-24">
            <div
                className="flex h-full w-full flex-col items-center justify-center gap-10 bg-pipelines-gray-100/20 text-center md:flex-row"
                style={{
                    backgroundImage: 'url("/hero.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                    borderTop: '1px solid rgba(2, 101, 172, 0.3)',
                    paddingBottom: '10vh',
                }}
            >
                <div className="min-h-4/5 min-w-1/4 flex flex-col items-center gap-5 rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 px-24 py-12 text-pipelines-gray-100">
                    {admin && !profile.anonymous ? (
                        <ProfilePicture profile={profile} setPfp={setPfp} />
                    ) : (
                        <img
                            src={pfp || '/avatar.png'}
                            className="h-48 w-48 rounded-full object-cover"
                            alt={`${profile._id}_avatar`}
                        />
                    )}

                    {admin && !profile.anonymous ? (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <label className="text-white">Username</label>
                            <input
                                className="rounded-full bg-pipelines-gray-100/10 p-3 text-white"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            {usernameErrorMessage && (
                                <h1 className="text-red-400">
                                    {usernameErrorMessage}
                                </h1>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <label className="font-medium text-white">
                                Username
                            </label>
                            <h1 className="text-white">
                                {profile && profile.anonymous
                                    ? 'Anonymous'
                                    : username}
                            </h1>
                        </div>
                    )}

                    {/* Linkedin Section */}
                    <label className="font-medium text-white">Linkedin</label>
                    {profile && profile.anonymous ? (
                        <h1 className="text-white">Anonymous</h1>
                    ) : (
                        <Link to={buildLinkedinUrl(linkedin)} target="_blank">
                            <h1 className="text-white hover:underline">
                                {profile && linkedin}
                            </h1>
                        </Link>
                    )}

                    {/* Save Button */}
                    {admin && saveable && !hasError ? (
                        <button
                            className={
                                'rounded-full bg-black px-12 py-1 text-white'
                            }
                            onClick={handleEditProfile}
                        >
                            <h1 className="font-normal uppercase text-white">
                                Save
                            </h1>
                        </button>
                    ) : (
                        <></>
                    )}

                    {/* Education */}
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-10">
                        <div className="flex w-full flex-row items-center justify-center gap-5">
                            <GraduationCap color="white" />
                            <h1 className="text-white">
                                {profile && profile.anonymous
                                    ? 'Anonymous'
                                    : profile.school}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Center text (location / position) */}
                <div className="flex h-full w-1/4 flex-col items-center justify-center gap-3 md:w-1/3 md:items-start">
                    <h1 className="text-2xl font-semibold text-white">
                        {profile.firstName} {profile.lastName}
                    </h1>

                    {currentExperienceInfo && (
                        <h1 className="text-center text-white md:text-start">
                            {currentExperienceInfo.time +
                                currentExperienceInfo.title}{' '}
                            at{' '}
                            <span className="font-medium">
                                {currentExperienceInfo.company}
                            </span>
                        </h1>
                    )}

                    <div className="flex flex-row items-center justify-center gap-2">
                        <MapPin />
                        {admin && !profile.anonymous ? (
                            <input
                                className="rounded-full bg-pipelines-gray-100/10 p-3 text-white"
                                value={location}
                                onChange={handleLocationChange}
                            />
                        ) : (
                            <h1 className="italic text-white">
                                {profile && profile.anonymous
                                    ? 'Somewhere'
                                    : location}
                            </h1>
                        )}
                    </div>
                </div>

                {/* Pipeline */}
                <div className="flex h-4/5 w-4/5 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 py-8 text-pipelines-gray-100 md:w-1/4">
                    {profile.pipeline &&
                        profile.pipeline.map((experience, i) => (
                            <div
                                className="flex flex-col items-center justify-center gap-3"
                                key={experience._id}
                            >
                                <ExperienceCard experience={experience} />
                                {i !== profile.pipeline.length - 1 ? (
                                    <h1>--</h1>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Profile
