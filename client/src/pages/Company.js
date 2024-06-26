import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { HOST, HOMEPAGE } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

// components
import { error404 } from '../components/Error404'
import Loading from './Loading'
import { CompanyCard } from '../components/CompanyCard'

const Company = () => {
    const { id } = useParams()
    const [name, setName] = useState('')
    const [info, setInfo] = useState('')
    const [logo, setLogo] = useState('')
    const [prevCompanies, setPrevCompanies] = useState([])
    const [postCompanies, setPostCompanies] = useState([])
    const [employeeCount, setEmployeeCount] = useState(0)
    const [rating, setRating] = useState(null)
    const [loading, setLoading] = useState(false)

    // if routed company changes:
    useEffect(() => {
        ;(async () => {
            await getCompanyData(id)
        })()
    }, [id])

    // get company data helper
    const getCompanyData = async (id) => {
        setLoading(true)
        try {
            const data = await fetchWithAuth({
                url: `${HOST}/api/company/get/${id}`,
                method: 'GET',
            })

            // Assuming data.error is a way the API indicates a logical error (not HTTP error)
            if (data.error) {
                setName(null)
                setLoading(false)
                return
            }

            setEmployeeCount(data.Employees.length + data.interns.length)
            setName(data.displayName)
            setLogo(data.logo)
            setInfo(data.description)

            if (data.rating) {
                setRating(
                    Math.floor(data.rating / data.ratedEmployees.length / 20)
                )
            }

            await setPrevAndPost(data)
        } catch (error) {
            console.error('Error:', error.message)
            // Handle fetch or logical errors
            setName(null)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    // set previous and post companies w data fetched
    const setPrevAndPost = async (data) => {
        const prevEntries = Object.entries(data.prevCompanies || {}).sort(
            (entry1, entry2) => {
                return entry2[1] - entry1[1]
            }
        )
        const postEntries = Object.entries(data.postCompanies || {}).sort(
            (entry1, entry2) => {
                return entry2[1] - entry1[1]
            }
        )
        const top3Prev = []
        for (let i = 0; i < 3; i++) {
            if (i >= prevEntries.length) {
                top3Prev.push({
                    name: null,
                })
            } else {
                if (prevEntries[i][1] <= 1) {
                    top3Prev.push({
                        name: null,
                    })
                } else {
                    try {
                        const url = `${HOST}/api/company/get/${prevEntries[i][0]}`

                        // Use fetchWithAuth for the request, specifying the URL and the method.
                        const response = await fetchWithAuth({
                            url,
                            method: 'GET',
                        })

                        top3Prev.push(response)
                    } catch (error) {
                        console.error(error.message)
                    }
                }
            }
        }
        const top3Post = []
        for (let i = 0; i < 3; i++) {
            if (i >= postEntries.length) {
                top3Post.push({
                    name: null,
                })
            } else {
                if (postEntries[i][1] <= 1) {
                    top3Post.push({
                        name: null,
                    })
                } else {
                    try {
                        const data = await fetchWithAuth({
                            url: `${HOST}/api/company/get/${postEntries[i][0]}`,
                            method: 'GET',
                        })
                        top3Post.push(data) // Add the fetched data to the top3Prev array
                    } catch (error) {
                        console.error('Error fetching data:', error)
                    }
                }
            }
        }
        setPrevCompanies([...top3Prev])
        setPostCompanies([...top3Post])
        setLoading(false)
    }

    const navigate = useNavigate()

    const tableElem = (rank, company) => {
        if (company.name === null || employeeCount < 5) {
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
                    navigate(`/company/${company.id}`)
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

    const previousTable = () => {
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
                        {prevCompanies.map((elem, idx) => {
                            return tableElem(idx, elem)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    const nextTable = () => {
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
                        {postCompanies.map((elem, idx) => {
                            return tableElem(idx, elem)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    const companyInfo = () => {
        return (
            <div className="flex-col p-8">
                <div className="hero-content flex-col rounded-lg bg-opacity-0 lg:flex-row">
                    <CompanyCard company={{ name, logo, info, rating }} />
                    <div className="card w-full object-center shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xl text-slate-200">
                                Prior Companies
                            </h2>
                            {previousTable()}
                        </div>
                    </div>
                    <div className="card w-full shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xl text-slate-200">
                                Next Companies
                            </h2>
                            {nextTable()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const error404component = error404(
        'We were unable to find the company you requested!'
    )

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
            {companyInfo()}
        </div>
    )
}

export default Company
