import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { HOST, HOMEPAGE } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

// components
import { error404 } from '../components/Error404'
import Loading from './Loading'

const School = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState('')
    const [logo, setLogo] = useState('')
    const [location, setLocation] = useState('')

    const MAX_COMPANIES = 3
    const EMPTY_COMPANY_ENTRY = null
    const [maxCompanies, setMaxCompanies] = useState([])

    // if routed company changes:
    useEffect(() => {
        ;(async () => {
            await getSchoolData(id)
        })()
    }, [id])

    // get company data helper
    const getSchoolData = async (id) => {
        setLoading(true)

        try {
            const data = await fetchWithAuth({
                url: `${HOST}/api/school/get/${id}`,
                method: 'GET',
            })

            // Assuming data.error is a way the API indicates a logical error (not HTTP error)
            if (data.error) {
                setName(null)
                setLoading(false)
                return
            }

            setName(data.name)
            setLogo(data.logo)
            setLocation(data.alpha_two_code)

            // get MAX_COMPANIES companies
            const filteredSchoolTally = filterSchoolTally(data.schoolTally)
            const maxCompanies = await getMaxCompanies(
                filteredSchoolTally,
                MAX_COMPANIES
            )
            setMaxCompanies(maxCompanies)
        } catch (error) {
            console.error('Error:', error.message)
            // Handle fetch or logical errors
            resetSchoolData()
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    // Function to filter schoolTally object to include only tallies with count > 1
    function filterSchoolTally(schoolTally) {
        return Object.fromEntries(
            // eslint-disable-next-line no-unused-vars
            Object.entries(schoolTally || {}).filter(([_, count]) => count > 1)
        )
    }

    const resetSchoolData = () => {
        setName(null)
        setLogo('')
        setLocation('')
        setMaxCompanies([])
    }

    // Function to retrieve company information by array of IDs
    async function getCompaniesByIds(ids) {
        try {
            // Make a batch GET request to retrieve company information by IDs
            const companies = await Promise.all(
                ids.map(async (id) => {
                    const company = await fetchWithAuth({
                        url: `${HOST}/api/company/getid/${id}`,
                        method: 'GET',
                    })
                    return company
                })
            )
            return companies
        } catch (error) {
            console.error(`Failed to retrieve companies with IDs ${ids}`)
            return Array(ids.length).fill(EMPTY_COMPANY_ENTRY) // Return an array of null values if any request fails
        }
    }

    // Function to get the maximum K companies
    async function getMaxCompanies(schoolTally, k) {
        // edge case, empty schoolTally
        if (!schoolTally || Object.entries(schoolTally).length === 0) {
            return Array(k).fill(EMPTY_COMPANY_ENTRY)
        }

        const compareCompanyCount = (c1, c2) => c2[1] - c1[1] // Sorting in descending order

        // Convert the object into an array of [key, value] pairs and sort it
        const tallyArray = Object.entries(schoolTally || []).sort(
            compareCompanyCount
        )

        // Extract the K most frequent companies' IDs
        const companyIds = tallyArray.slice(0, k).map(([id]) => id)

        // Retrieve company information for the K most frequent companies
        const companies = await getCompaniesByIds(companyIds)

        return companies
    }

    // table components
    const tableElem = (rank, company) => {
        if (!company || company.name === null) {
            return (
                <tr className="h-20 divide-y divide-gray-200 border-b border-t border-gray-200">
                    <div className="avatar"></div>
                    <td>{'No data available.'}</td>
                </tr>
            )
        }
        return (
            <tr
                className="w-full divide-y divide-gray-200 border-b border-t border-gray-200 transition duration-500 hover:cursor-pointer hover:bg-pipeline-blue-200"
                onClick={() => {
                    navigate(`/company/${company.name}`)
                }}
            >
                <div className="avatar p-2">
                    <div className="mask h-16 w-16 bg-slate-100 object-contain">
                        <img className="w-min" src={company.logo} />
                    </div>
                </div>
                <td className="w-full">
                    {`(#${rank + 1}): ` + company.displayName}
                </td>
            </tr>
        )
    }

    const companyTable = () => {
        return (
            <div className="overflow-x-auto">
                <table className="table min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th></th>
                            <th>Company Name</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 border-b border-t border-gray-200">
                        {maxCompanies.map((elem, idx) => {
                            return tableElem(idx, elem)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    const schoolInfo = () => {
        return (
            <div className="flex-col p-8">
                <div className="hero-content flex-col rounded-lg bg-opacity-0 lg:flex-row">
                    <div className="min-h-4/5 min-w-1/4 mt-24 flex flex-col gap-5 rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 p-8 py-5 text-pipelines-gray-100 md:flex-row md:px-16 md:py-10 lg:mt-0 ">
                        <div className="card flex-col items-center justify-center md:items-start md:justify-start">
                            <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
                                <img
                                    src={logo}
                                    className="shadow-2x h-24 w-24 max-w-sm rounded-2xl object-contain md:h-48 md:w-48"
                                />

                                <div className="flex w-full flex-row items-center justify-evenly">
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="text-2xl font-bold text-white">
                                            Rank
                                        </h1>
                                        <h1 className="text-lg text-white">
                                            {/* TODO: add rank integration / system */}
                                            N/A
                                        </h1>
                                    </div>

                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="text-2xl font-bold text-white">
                                            Location
                                        </h1>
                                        <h1 className="text-lg text-white">
                                            {location}
                                        </h1>
                                    </div>

                                    {/* <div className="flex flex-col items-center justify-center">
                                        <h1 className="text-2xl font-bold text-white">
                                            Rank
                                        </h1>
                                        <h1 className="text-lg text-white">
                                            N/A
                                        </h1>
                                    </div> */}
                                </div>
                            </div>
                            <div className="flex-row object-center">
                                <h1 className="p-6 text-5xl font-bold text-slate-200">
                                    {name}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="card w-full shadow-xl md:w-1/2">
                        <div className="card-body">
                            <h2 className="card-title text-xl text-slate-200">
                                Most Common Companies
                            </h2>
                            {companyTable()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const error404component = error404(
        'We were unable to find the company you requested!'
    )
    if (loading) {
        return <Loading />
    }

    return loading ? (
        <Loading />
    ) : name === null ? (
        error404component
    ) : (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage: `url("${HOMEPAGE}/CTA.png")`,
            }}
        >
            <div className="max-w-screen hero-overlay rounded-lg"></div>
            {schoolInfo()}
        </div>
    )
}

export default School
