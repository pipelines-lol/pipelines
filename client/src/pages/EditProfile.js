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
            id: index + 1,
            ...item,
        }))
        setPipeline(temp)
        setOrigCompanies(temp)
    }

    const addExperience = async (index) => {
        const placeholder = {
            id: 0,
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
            let found = -1
            for (let j = 0; j < origCompanies.length; j++) {
                let comp = origCompanies[j]
                if (comp.id === company.id) {
                    found = j
                    break
                }
            }

            if (found !== -1) {
                let prevCompanies = []
                let postCompanies = []
                let prevRemoveCompanies = []
                let postRemoveCompanies = []

                const newPrevCompanies = pipeline
                    .slice(0, i)
                    .map((item) => item.companyName)

                const newPostCompanies = pipeline
                    .slice(i + 1)
                    .map((item) => item.companyName)

                const origPrevCompanies = origCompanies
                    .slice(0, found)
                    .map((item) => item.companyName)

                const origPostCompanies = origCompanies
                    .slice(found + 1)
                    .map((item) => item.companyName)

                // Decide which previous companies need to be incremented
                for (let i = 0; i < newPostCompanies.length; i++) {
                    const company = newPostCompanies[i]
                    if (!origPostCompanies.includes(company)) {
                        postCompanies.push(company)
                    }
                }

                // Decide which next companies need to be incremented
                for (let i = 0; i < newPrevCompanies.length; i++) {
                    const company = newPrevCompanies[i]
                    if (!origPrevCompanies.includes(company)) {
                        prevCompanies.push(company)
                    }
                }

                // Decide which prev comanies need to be decremented
                for (let i = 0; i < origPrevCompanies.length; i++) {
                    const company = origPrevCompanies[i]
                    if (!newPrevCompanies.includes(company)) {
                        prevRemoveCompanies.push(company)
                    }
                }

                // Decide which prev comanies need to be decremented
                for (let i = 0; i < origPostCompanies.length; i++) {
                    const company = origPostCompanies[i]
                    if (!newPostCompanies.includes(company)) {
                        postRemoveCompanies.push(company)
                    }
                }

                let companyJson = {}
                let origDifference = 0
                let differenceDays = 0
                if (!company.isIndefinite) {
                    // Get original dates
                    const origDate1 = new Date(origCompanies[found].startDate)
                    const origDate2 = new Date(origCompanies[found].endDate)

                    const origDifferenceMs = origDate2 - origDate1

                    origDifference = origDifferenceMs / (1000 * 60 * 60 * 24)

                    // Get current date
                    const date1 = new Date(company.startDate)
                    const date2 = new Date(company.endDate)

                    // Calculate the difference in milliseconds
                    const differenceMs = Math.abs(date2 - date1)

                    // Convert the difference to days
                    differenceDays = Math.round(
                        differenceMs / (1000 * 60 * 60 * 24)
                    )
                } else if (
                    company.isIndefinite &&
                    new Date(company.startDate) < new Date()
                ) {
                    const origDate1 = new Date(origCompanies[found].startDate)
                    const origDate2 = new Date()
                    const origMs = origDate2 - origDate1
                    origDifference = Math.round(origMs / (1000 * 60 * 60 * 24))

                    // Get current date
                    const date1 = new Date(company.startDate)
                    const date2 = new Date()

                    // Calculate the difference in milliseconds
                    const differenceMs = Math.abs(date2 - date1)

                    // Convert the difference to days
                    differenceDays = Math.round(
                        differenceMs / (1000 * 60 * 60 * 24)
                    )
                }

                const employeeData = {
                    removeInterns: [],
                    removeRatedEmployees: [],
                }

                if (origCompanies[found].rating > 0 && company.rating === 0) {
                    employeeData.removeRatedEmployees.push(user.profileId)
                }

                if (
                    origCompanies[found].title
                        .toLowerCase()
                        .includes('intern') &&
                    !company.title.toLowerCase().includes('intern')
                ) {
                    employeeData.removeInterns.push(user.profileId)
                }

                // Check if employee rated the company
                if (
                    company.rating === 0 &&
                    company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating - origCompanies[found].rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        prevRemoveCompanies: prevRemoveCompanies || [],
                        postRemoveCompanies: postRemoveCompanies || [],
                        Employees: [],
                        ratedEmployees: [],
                        interns: [user.profileId],
                        ...employeeData,
                    }
                } else if (
                    company.rating === 0 &&
                    !company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating - origCompanies[found].rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        prevRemoveCompanies: prevRemoveCompanies || [],
                        postRemoveCompanies: postRemoveCompanies || [],
                        tenure: differenceDays - origDifference,
                        Employees: [user.profileId],
                        ratedEmployees: [],
                        interns: [],
                        ...employeeData,
                    }
                } else if (
                    company.rating > 0 &&
                    company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating - origCompanies[found].rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        prevRemoveCompanies: prevRemoveCompanies || [],
                        postRemoveCompanies: postRemoveCompanies || [],
                        Employees: [],
                        ratedEmployees: [user.profileId],
                        interns: [user.profileId],
                        ...employeeData,
                    }
                } else if (
                    company.rating > 0 &&
                    !company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating - origCompanies[found].rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        prevRemoveCompanies: prevRemoveCompanies || [],
                        postRemoveCompanies: postRemoveCompanies || [],
                        tenure: differenceDays - origDifference,
                        Employees: [user.profileId],
                        ratedEmployees: [user.profileId],
                        interns: [],
                        ...employeeData,
                    }
                }

                let temp = companies
                temp = companies.push(companyJson)
                setCompanies(temp)
                console.log('Company Json: ', companyJson)
            } else {
                const prevCompanies = pipeline
                    .slice(0, i)
                    .map((item) => item.companyName)
                const postCompanies = pipeline
                    .slice(i + 1)
                    .map((item) => item.companyName)

                let companyJson = {}

                let differenceDays = 0
                if (!company.isIndefinite) {
                    // Get current date
                    const date1 = new Date(company.startDate)
                    const date2 = new Date(company.endDate)

                    // Calculate the difference in milliseconds
                    const differenceMs = Math.abs(date2 - date1)

                    // Convert the difference to days
                    differenceDays = differenceMs / (1000 * 60 * 60 * 24)
                } else if (
                    company.isIndefinite &&
                    new Date(company.startDate) < new Date()
                ) {
                    const date1 = new Date(company.startDate)
                    const date2 = new Date()
                    const differenceMs = Math.abs(date2 - date1)

                    differenceDays = Math.round(
                        differenceMs / (1000 * 60 * 60 * 24)
                    )
                }

                if (
                    company.rating === 0 &&
                    company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        Employees: [user.profileId],
                        ratedEmployees: [],
                        interns: [],
                    }
                } else if (
                    company.rating === 0 &&
                    !company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        tenure: differenceDays,
                        Employees: [user.profileId],
                        ratedEmployees: [],
                        interns: [],
                    }
                } else if (
                    company.rating > 0 &&
                    company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        Employees: [],
                        ratedEmployees: [user.profileId],
                        interns: [user.profileId],
                    }
                } else if (
                    company.rating > 0 &&
                    !company.title.toLowerCase().includes('intern')
                ) {
                    companyJson = {
                        name: company.companyName,
                        rating: company.rating,
                        prevCompanies: prevCompanies || [],
                        postCompanies: postCompanies || [],
                        tenure: differenceDays,
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

        let temp = pipeline
        for (let obj of temp) {
            delete obj.id
        }
        setPipeline(temp)
    }

    const removeExperience = async (experience, index) => {
        const newPipeline = [...pipeline]
        const removeDate = [...dateValidity]

        removeDate.splice(index, 1)
        newPipeline.splice(index, 1)

        let comp = {
            id: experience.id,
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
            if (comp.id === company.id) {
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

        console.log('prev remove companies: ', prevRemoveCompanies)
        console.log('post remove companies: ', postRemoveCompanies)

        if (found !== -1) {
            comp = {
                ...comp,
                prevRemoveCompanies,
                postRemoveCompanies,
                prevRemoveOtherCompanies: postRemoveCompanies,
                postRemoveOtherCompanies: prevRemoveCompanies,
            }
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

            const profile = {
                firstName,
                lastName,
                school,
                anonymous,
                pipeline: tempOrig,
            }

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
                    }
                }
            }
            return true
        }

        // check none of the singular fields are blank
        if (!firstName || firstName === '' || !lastName || lastName === '')
            return false

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

        function isValidDate(arr) {
            for (const valid of arr) {
                if (!valid) return false
            }
            return true
        }

        // make sure no input fields are blank
        if (!validateSubmission()) {
            setErrorMessage('Must fill out all input fields.')
            return
        }

        if (!isValidDate(dateValidity)) {
            setErrorMessage('Invalid Date')
            return
        }

        setLoading(true)
        sortByDate(pipeline)
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
        setLoading(false)
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
