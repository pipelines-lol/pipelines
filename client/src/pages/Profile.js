import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

import { HOST } from '../util/apiRoutes'
import { isMongoDBId } from '../util/mongoUtils'
import { fetchWithAuth } from '../util/fetchUtils'

// components
import Loading from './Loading'
import { error404 } from '../components/Error404'
import { EducationCard, ExperienceCard } from '../components/PipelineCard'
import { ProfilePicture } from '../components/ProfilePicture'

// assets
import { MapPin } from 'lucide-react'

function Profile() {
    const { id } = useParams()
    const [profile, setProfile] = useState({})

    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)

    const [saveable, setSaveable] = useState(false)

    const [pfp, setPfp] = useState('')
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [school, setSchool] = useState('')

    const [location, setLocation] = useState('')

    const hasError = errorMessage.length !== 0

    const fetchProfile = async () => {
        try {
            setLoading(true)

            const data = await fetchWithAuth({
                url: `${HOST}/api/profile/get/${id}`,
                method: 'GET',
            })

            if (data.school) fetchSchool(data.school)

            // Successful fetch and data extraction
            setProfile(data)
            setUsername(data.username)
            setLinkedin(extractLinkedinUsername(data.linkedin))
            setLocation(data.location)
            setPfp(data.pfp)
        } catch (error) {
            console.error('Error:', error.message)
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }

    const fetchProfileByUsername = async () => {
        try {
            setLoading(true)

            const data = await fetchWithAuth({
                url: `${HOST}/api/profile/getBy?username=${id}`,
                method: 'GET',
            })

            if (data.school) fetchSchool(data.school)

            // Successful fetch and data extraction
            setProfile(data)
            setUsername(data.username)
            setLinkedin(extractLinkedinUsername(data.linkedin))
            setLocation(data.location)
            setPfp(data.pfp)
        } catch (error) {
            console.error('Error:', error.message)
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }

    const fetchSchool = async (id) => {
        try {
            const data = await fetchWithAuth({
                url: `${HOST}/api/school/get/${id}`,
                method: 'GET',
            })
            data ? setSchool(data) : setSchool(null)
        } catch (err) {
            console.error('Error: ', err)
        }
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

    const handleUsernameChange = async (e) => {
        // change -> saveable progress
        setSaveable(true)

        // remove previous errors
        setErrorMessage('')

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
            location,
        }

        try {
            await fetchWithAuth({
                url: `${HOST}/api/profile/${user.profileId}`,
                method: 'PATCH',
                data: updatedProfile,
            })
        } catch (error) {
            const message = error.message
            console.error('Error:', message)
            setErrorMessage(message)
        }

        setSaveable(false)
    }

    useEffect(() => {
        const fetchInfo = async () => {
            const isValidId = await isMongoDBId(id)

            if (!isValidId.response) {
                await fetchProfileByUsername()
            } else {
                await fetchProfile()
            }
        }

        fetchInfo()
    }, [id])

    // establish if the user viewing the profile
    // has admin privileges of the viewed profile
    const admin = user && profile && user.profileId === profile._id

    const currentExperienceInfo = // {'Incoming / Currently / Previously', Work Title, Company Name}
        profile && profile.pipeline && profile.pipeline.length > 0
            ? getCurrentExperience()
            : null

    const error404component = error404('We were unable to find that profile!')
    return loading ? (
        <Loading />
    ) : !profile ? (
        error404component
    ) : (
        <div className="flex h-full min-h-[90vh] w-full items-center justify-center pt-24">
            <div
                className="flex h-full w-full flex-col items-center justify-center gap-10 bg-pipelines-gray-100/20 p-8 text-center md:flex-row"
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
                <div className="min-h-4/5 min-w-1/4 flex flex-col items-center gap-5">
                    <div className="flex h-full w-full flex-col items-center gap-5 rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 px-24 py-12 text-pipelines-gray-100">
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
                                {errorMessage && (
                                    <h1 className="text-red-400">
                                        {errorMessage}
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
                        <label className="font-medium text-white">
                            Linkedin
                        </label>
                        {profile && profile.anonymous ? (
                            <h1 className="text-white">Anonymous</h1>
                        ) : (
                            <Link
                                to={`https://linkedin.com/in/${linkedin}`}
                                target="_blank"
                            >
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
                    </div>

                    {/* Education */}
                    {!profile.anonymous && school && (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 p-10 px-24 py-12 text-pipelines-gray-100">
                            <EducationCard education={school} />
                        </div>
                    )}
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
