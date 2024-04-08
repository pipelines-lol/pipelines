import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { binarySearch } from '../util/generalUtils'
import { HOST } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

// components
import Loading from './Loading'
import { ExperienceForm } from '../components/ExperienceForm'
import { SchoolQuerySearch } from '../components/SchoolQuerySearch'

// assets
import { PlusCircle } from 'lucide-react'

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
    const { user, dispatch } = useAuthContext()

    const fetchProfile = async () => {
        setLoading(true)

        try {
            // Use fetchWithAuth to perform the request
            const data = await fetchWithAuth({
                url: `${HOST}/api/profile/${user.profileId}`, // Adjust HOST and user.profileId as needed
                method: 'GET',
            })

            // Use the response data to update the UI state
            updateUIState(data)
        } catch (error) {
            console.error(error.message) // Error handling is simplified as fetchWithAuth should handle HTTP errors and token issues
        } finally {
            setLoading(false) // Reset the loading state
        }
    }

    const sortByDate = (array) => {
        // Custom comparison function
        function compareDates(a, b) {
            const dateA = new Date(a.startDate)
            const dateB = new Date(b.startDate)
            return dateA - dateB
        }

        const sortedPipeline = array.sort(compareDates)
        setPipeline(sortedPipeline)
    }

    const updateUIState = (data) => {
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setSchool(data.school)
        setAnonymous(data.anonymous)
        initializeDate(data.pipeline.length)
        const temp = data.pipeline.map((item, index) => ({
            tempId2: index + 1,
            ...item,
        }))
        setPipeline(temp)
        setOrigCompanies(temp)
    }

    const addExperience = async (index) => {
        const placeholder = {
            tempId2: 0,
            logo: '',
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
            const company = pipeline[i]
            const lowerTitle = company.title.toLowerCase()

            const companyJson = {
                tempId2: company.tempId2,
                companyId: company.companyId,
                name: company.companyName,
                rating: company.rating,
                startDate: new Date(company.startDate),
                endDate: new Date(company.endDate),
                userId: user.profileId,
                indefinite: company.isIndefinite,
                title: lowerTitle,
            }

            let temp = companies
            temp.push(companyJson)
            setCompanies(temp)
        }

        let temp = pipeline
        for (let obj of temp) {
            delete obj.tempId
        }
        setPipeline(temp)
    }

    const removeExperience = async (experience, index) => {
        const newPipeline = [...pipeline]
        const removeDate = [...dateValidity]

        removeDate.splice(index, 1)
        newPipeline.splice(index, 1)

        let comp = {
            tempId2: experience.tempId2,
            companyId: experience.companyId,
            name: experience.companyName,
            title: experience.title,
            rating: experience.rating,
            startDate: experience.startDate,
            endDate: experience.endDate,
            userId: user.profileId,
            indefinite: experience.isIndefinite,
            remove: true,
        }

        let tempOrig = origCompanies
        let found = -1
        found = binarySearch(origCompanies, comp)

        if (found !== -1) {
            try {
                const profile = {
                    firstName,
                    lastName,
                    school,
                    anonymous,
                    pipeline: tempOrig,
                }

                comp = {
                    ...comp,
                    index: found,
                }
                setLoading(true)
                await fetchWithAuth({
                    url: `${HOST}/api/profile/${user.profileId}`,
                    method: 'PATCH',
                    data: profile,
                })

                await fetchWithAuth({
                    url: `${HOST}/api/company/update/${comp.companyId}`,
                    method: 'PATCH',
                    data: [comp, origCompanies],
                })
                setLoading(false)
            } catch (error) {
                console.error(error.message)
            }
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
                            if (
                                experience['isIndefinite'] &&
                                key === 'endDate'
                            ) {
                                experience[key] =
                                    '2200-12-02T00:00:00.000+00:00'
                                continue
                            }
                            return false
                        }

                        if (key === 'companyName' && !experience[key])
                            return false
                    }
                }
            }
            return true
        }

        // check none of the singular fields are blank
        if (!firstName || firstName === '' || !lastName || lastName === '')
            return false

        // // check the education isnt blank
        // if (school === '') return false

        // check none of the fields in the pipeline are blank
        if (!checkPipelineForEmptyFields(pipeline)) return false

        return true
    }

    const checkDuplicates = (companies) => {
        for (let i = 0; i < companies.length; i++) {
            for (let j = i + 1; j < companies.length; j++) {
                if (companies[i].companyName === companies[j].companyName) {
                    return false
                }
            }
        }
        return true
    }

    const handleEditProfile = async () => {
        const profile = {
            firstName,
            lastName,
            school,
            anonymous,
            pipeline,
            created: true,
        }

        function isValidDate(arr) {
            for (const valid of arr) {
                if (!valid) return false
            }
            return true
        }

        // Check input fields
        if (!validateSubmission()) {
            setErrorMessage('Must fill out all input fields.')
            return
        }

        // Check date validity
        if (!isValidDate(dateValidity)) {
            setErrorMessage('Invalid Date')
            return
        }

        // Check for duplicate companies
        if (!checkDuplicates(pipeline)) {
            setErrorMessage('Duplicate Companies (See Guidelines)')
            return
        }

        setLoading(true)
        sortByDate(pipeline)
        generateCompanies(pipeline)

        // Update companies
        try {
            // Update user profile
            await fetchWithAuth({
                url: `${HOST}/api/profile/${user.profileId}`,
                method: 'PATCH',
                data: profile,
            })

            // update companies associated with user profile change
            await fetchWithAuth({
                url: `${HOST}/api/company/update`,
                method: 'PATCH',
                data: [companies, origCompanies],
            })

            dispatch({ type: 'CREATED', payload: user })
        } catch (error) {
            console.error('Error:', error.message)
            setErrorMessage('An error occurred while updating your profile.')
        } finally {
            setLoading(false)
            navigate('/')
        }
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
                    className="flex w-full flex-col items-center justify-center gap-5 bg-pipelines-gray-100/20 text-center"
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
                        <h1 className="mb-2 py-4 text-4xl font-light text-pipelines-gray-100 md:text-6xl">
                            {`${user.profileCreated ? 'Edit' : 'Create'} Your Profile`}
                        </h1>
                        <p className="text-xl font-light text-pipelines-gray-100/80">
                            {`${user.profileCreated ? 'Update' : 'Create'}`}{' '}
                            your profile to get the most out of Pipelines.{' '}
                            <br /> Don&#39;t worry, you can remain 100%
                            anonymous.
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

                        <div className="flex flex-col gap-1">
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
