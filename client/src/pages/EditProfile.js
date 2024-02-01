import { useAutoAnimate } from '@formkit/auto-animate/react'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExperienceForm } from '../components/ExperienceForm'
import { SchoolQuerySearch } from '../components/SchoolQuerySearch'
import { useAuthContext } from '../hooks/useAuthContext'
import { HOST } from '../util/apiRoutes'
import Loading from './Loading'
function EditProfile() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [anonymous, setAnonymous] = useState(false)
    const [pipeline, setPipeline] = useState([])
    const [dateValid, setDateValid] = useState(true)

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [school, setSchool] = useState('')

    const navigate = useNavigate()
    const [animationRef] = useAutoAnimate()
    const { user } = useAuthContext()

    const fetchProfile = async () => {
        setLoading(true)

        try {
            const res = await fetch(`${HOST}/api/profile/${user.profileId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
            })

            if (!res.ok) {
                // Check if the response has JSON content
                if (
                    res.headers
                        .get('content-type')
                        ?.includes('application/json')
                ) {
                    const errorData = await res.json()
                    throw new Error(`${errorData.error}`)
                } else {
                    throw new Error(`HTTP error! Status: ${res.status}`)
                }
            }

            const data = await res.json()
            updateUIState(data)
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateUIState = (data) => {
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setSchool(data.school)
        setAnonymous(data.anonymous)
        setPipeline(data.pipeline)
    }

    const addExperience = async (index) => {
        const placeholder = {
            companyName: '',
            title: '',
            startDate: '',
            endDate: '',
        }
        const newPipeline = [...pipeline]

        newPipeline.splice(index, 0, placeholder)

        setPipeline(newPipeline)
    }

    const updateExperience = async (experience, index) => {
        const newPipeline = [...pipeline]

        newPipeline.splice(index, 1, experience)

        setPipeline(newPipeline)
    }

    const removeExperience = async (index) => {
        const newPipeline = [...pipeline]

        newPipeline.splice(index, 1)

        setPipeline(newPipeline)
    }

    const validateSubmission = () => {
        function isValidDateFormat(date) {
            return !date.includes('undefined')
        }

        function checkPipelineForEmptyFields(pipeline) {
            for (const experience of pipeline) {
                for (const key in experience) {
                    if (experience.hasOwnProperty(key)) {
                        // validate date
                        if (
                            (key === 'startDate' &&
                                !isValidDateFormat(experience[key])) ||
                            (key === 'endDate' &&
                                !isValidDateFormat(experience[key]))
                        ) {
                            return false
                        }

                        // empty field
                        if (
                            typeof experience[key] === 'string' &&
                            experience[key].trim() === ''
                        ) {
                            return false
                        }
                    }
                }
            }
            return true
        }

        // check none of the singular fields are blank
        if (firstName === '' || lastName === '') return false

        // check the education isnt blank
        if (school === '') return false

        // check none of the fields in the pipeline are blank
        if (!checkPipelineForEmptyFields(pipeline)) return false

        return true
    }

    const handleEditProfile = async () => {
        const profile = {
            firstName,
            lastName,
            school,
            anonymous,
            pipeline,
        }

        // make sure no input fields are blank
        if (!validateSubmission()) {
            setErrorMessage('Must fill out all input fields.')
            return
        }

        if (!dateValid) {
            setErrorMessage('Invalid Date input')
            return
        }
        console.log('pipeline: ', profile.pipeline)
        fetch(`${HOST}/api/profile/${user.profileId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: JSON.stringify(profile),
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
            })
            .catch((error) => {
                console.error(error.message)
            })

        navigate('/')
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <div className="flex h-auto min-h-full w-full items-center justify-center pt-24">
                <div
                    className="flex w-full flex-col items-center justify-center gap-5 bg-pipeline-blue-200/20 text-center"
                    style={{
                        backgroundImage: 'url("hero.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                        borderTop: '1px solid rgba(2, 101, 172, 0.3)',
                        paddingBottom: '10vh',
                    }}
                >
                    <div className="flex w-full flex-col items-center justify-center gap-3 pt-12 text-center">
                        <h1 className="py-4 text-4xl font-light text-pipelines-gray-100 md:text-6xl">
                            Edit Your Profile
                        </h1>
                        <p className="text-xl font-light text-pipelines-gray-100/80">
                            Update your profile to get the most out of
                            Pipelines. <br /> Don&#39;t worry, you can remain
                            100% anonymous.
                        </p>
                    </div>

                    <div className="xs:scale-105 flex flex-col gap-6 pt-8 md:scale-125">
                        <div className="flex flex-col gap-3 md:flex-row">
                            <div className="flex flex-col gap-6">
                                <label className="text-light text-pipelines-gray-100">
                                    First Name
                                </label>
                                <input
                                    className="rounded-full border-2 border-transparent bg-pipeline-blue-200/20 px-4 py-2 text-pipelines-gray-100 outline-none focus:bg-pipeline-blue-200/40 focus:ring-1 focus:ring-blue-300/40"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-6">
                                <label className="text-light text-pipelines-gray-100">
                                    Last Name
                                </label>
                                <input
                                    className="rounded-full border-2 border-transparent bg-pipeline-blue-200/20 px-4 py-2 text-pipelines-gray-100 outline-none focus:bg-pipeline-blue-200/40 focus:ring-1 focus:ring-blue-300/40"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* TODO: fix styling */}
                        <div className="flex flex-col gap-1">
                            <label className="text-medium">Education</label>
                            <SchoolQuerySearch
                                value={school}
                                handleSearch={setSchool}
                            />
                        </div>

                        <label className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={() => setAnonymous((prev) => !prev)}
                                className="peer sr-only cursor-pointer"
                            />
                            <div className="peer h-6 w-11 cursor-pointer rounded-full bg-gray-200/50 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300/5 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-700 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-gray-300/90 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                            <span className="ms-3 text-sm font-light text-gray-300 dark:text-gray-300">
                                I want to remain anonymous
                            </span>
                        </label>
                    </div>

                    <div
                        className="my-4 flex w-full flex-col flex-wrap items-center justify-center gap-3 pt-12 md:flex-row"
                        ref={animationRef}
                    >
                        <button
                            key={0}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-pipeline-blue-200/20 text-pipelines-gray-100/80 hover:bg-pipeline-blue-200/40 hover:text-pipelines-gray-100"
                            onClick={() => addExperience(0)}
                        >
                            <PlusCircle size={30} />
                        </button>
                        {pipeline.map((experience, index) => (
                            <div
                                key={`experience_${index}`}
                                className="scroll flex flex-col items-center justify-center gap-3 overflow-auto md:flex-row"
                            >
                                <ExperienceForm
                                    key={`experience_form_${index}`}
                                    experience={experience}
                                    index={index}
                                    updateExperience={updateExperience}
                                    removeExperience={removeExperience}
                                    setIsValid={setDateValid}
                                />
                                <button
                                    key={`add_experience_button_${index + 1}`}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-pipeline-blue-200/20 text-pipelines-gray-100/80 hover:bg-pipeline-blue-200/40 hover:text-pipelines-gray-100"
                                    onClick={() => {
                                        addExperience(index + 1)
                                    }}
                                >
                                    <PlusCircle size={30} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {errorMessage && (
                        <h1 className="text-lg font-light italic text-red-400">
                            {errorMessage}
                        </h1>
                    )}
                    <a
                        onClick={handleEditProfile}
                        className="group relative inline-block rounded px-20 py-2.5 font-light text-white hover:cursor-pointer"
                    >
                        <span className="absolute left-0 top-0 h-full w-full rounded bg-gradient-to-br from-slate-950 to-blue-800 opacity-50 blur-sm filter"></span>
                        <span className="absolute inset-0 ml-0.5 mt-0.5 h-full w-full rounded bg-gradient-to-br from-slate-950 to-blue-800 opacity-50 filter group-active:opacity-0"></span>
                        <span className="absolute inset-0 h-full w-full rounded bg-gradient-to-br from-slate-950 to-blue-800 shadow-xl filter transition-all duration-200 ease-out group-hover:blur-sm group-active:opacity-0"></span>
                        <span className="absolute inset-0 h-full w-full rounded bg-gradient-to-br from-blue-800 to-slate-950 transition duration-200 ease-out"></span>
                        <span className="relative">Save</span>
                    </a>
                </div>
            </div>
        </>
    )
}

export default EditProfile
