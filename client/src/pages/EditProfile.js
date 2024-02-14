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
    const [dateValidity, setDateValidity] = useState([])
    const [origCompanies, setOrigCompanies] = useState([])
    const [companies, setCompanies] = useState([])

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
        console.log('pipeline: ', data.pipeline)
        setPipeline(data.pipeline)
        initializeDate(data.pipeline.length)
        const temp = data.pipeline.map((item) => ({
            companyName: item.companyName,
            title: item.title,
            rating: item.rating,
            startDate: item.startDate,
            endDate: item.endDate,
        }))
        setOrigCompanies(temp)
    }

    const addExperience = async (index) => {
        const placeholder = {
            companyName: '',
            title: '',
            startDate: '',
            endDate: '',
            isIndefinite: false,
            rating: 0,
        }
        const newPipeline = [...pipeline]

        newPipeline.splice(index, 0, placeholder)

        setPipeline(newPipeline)
        addDate(true, index + 1)
    }

    const updateExperience = async (experience, index) => {
        const newPipeline = [...pipeline]

        newPipeline.splice(index, 1, experience)
        setPipeline(newPipeline)
    }

    const generateCompanies = (pipeline) => {
        for (let i = 0; i < pipeline.length; i++) {
            if (origCompanies.includes(pipeline[i].companyName)) {
                const company = pipeline[i]
                console.log('Company Name: ', company.companyName)
                const prevCompanies = pipeline
                    .slice(0, i)
                    .map((item) => item.companyName)
                    .filter((company) => !origCompanies.includes(company))
                const postCompanies = pipeline
                    .slice(i + 1)
                    .map((item) => item.companyName)
                    .filter((company) => !origCompanies.includes(company))

                let companyJson = {}

                if (company.rating === 0) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating - origCompanies[i].rating,
                        prevCompanies: prevCompanies || {},
                        postCompanies: postCompanies || {},
                        Employees: [user.profileId],
                        ratedEmployees: [],
                        interns: [],
                    }
                } else {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating - origCompanies[i].rating,
                        prevCompanies: prevCompanies || {},
                        postCompanies: postCompanies || {},
                        Employees: [user.profileId],
                        ratedEmployees: [user.profileId],
                        interns: [],
                    }
                }

                let temp = companies
                temp = companies.push(companyJson)
                setCompanies(temp)
            } else {
                const company = pipeline[i]
                console.log('Company Name: ', company.companyName)
                const prevCompanies = pipeline
                    .slice(0, i)
                    .map((item) => item.companyName)
                const postCompanies = pipeline
                    .slice(i + 1)
                    .map((item) => item.companyName)

                let companyJson = {}

                if (company.rating === 0) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating,
                        prevCompanies: prevCompanies || {},
                        postCompanies: postCompanies || {},
                        Employees: [user.profileId],
                        ratedEmployees: [],
                        interns: [],
                    }
                } else {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating,
                        prevCompanies: prevCompanies || {},
                        postCompanies: postCompanies || {},
                        Employees: [user.profileId],
                        ratedEmployees: [user.profileId],
                        interns: [],
                    }
                }

                let temp = companies
                temp = companies.push(companyJson)
                setCompanies(temp)
            }
        }
    }

    const removeExperience = async (experience, index) => {
        const newPipeline = [...pipeline]
        const removeDate = [...dateValidity]

        removeDate.splice(index, 1)
        newPipeline.splice(index, 1)

        let comp = {
            name: experience.companyName,
            title: experience.title,
            removeRating: experience.rating,
            startDate: experience.startDate,
            endDate: experience.endDate,
            removeEmployees: [user.profileId],
        }

        let tempOrig = origCompanies
        let found = -1
        for (let i = 0; i < tempOrig.length; i++) {
            let company = tempOrig[i]
            console.log('Company: ', company)
            console.log('Comp: ', comp)
            if (
                comp.name === company.companyName &&
                comp.title === company.title &&
                comp.removeRating === company.rating
            ) {
                tempOrig.splice(i, 1)
                found = i
                break
            }
        }

        const prevRemoveCompanies = origCompanies
            .slice(0, found)
            .map((item) => item.companyName)
        const postRemoveCompanies = origCompanies
            .slice(found + 1)
            .map((item) => item.companyName)

        if (found !== -1) {
            comp = { ...comp, prevRemoveCompanies, postRemoveCompanies }
            const response = await fetch(
                `${HOST}/api/company/update/${comp.name}`,
                {
                    method: `PATCH`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(comp),
                }
            )

            if (!response.ok) {
                console.log(response.status)
            }

            const data = await response.json()
            console.log('data: ', data)

            const profile = {
                firstName,
                lastName,
                school,
                anonymous,
                pipeline: tempOrig,
            }

            console.log('pipeline: ', profile)

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
                    console.err(error.message)
                })
        }

        setOrigCompanies(tempOrig)
        setDateValidity(removeDate)
        setPipeline(newPipeline)
    }

    const addDate = (bool, index) => {
        const newDate = [...dateValidity]

        newDate.splice(index, 0, bool)
        setDateValidity(newDate)
    }

    const updateDate = (bool, index) => {
        const newDate = [...dateValidity]
        console.log('newDate: ', newDate)
        newDate.splice(index, 1, bool)
        setDateValidity(newDate)
    }

    const initializeDate = (len) => {
        const newDate = Array(len).fill(true)
        setDateValidity(newDate)
    }

    const validateSubmission = () => {
        function isValidDateFormat(date) {
            return !date.includes('undefined')
        }

        function isValidDate(arr) {
            for (const valid of arr) {
                if (!valid) return false
            }
            return true
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
                            key !== 'isIndefinite' &&
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
        if (
            !checkPipelineForEmptyFields(pipeline) ||
            !isValidDate(dateValidity)
        )
            return false

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

        generateCompanies(pipeline)

        // update companies
        const response = await fetch(`${HOST}/api/company/update`, {
            method: `PATCH`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companies),
        })

        if (!response.ok) {
            console.log(response.status)
        }

        const data = await response.json()
        console.log('data: ', data)

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
                console.err(error.message)
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
                                    updateDate={updateDate}
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
