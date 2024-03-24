import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HOST } from '../util/apiRoutes'
import { HOMEPAGE } from '../util/apiRoutes'
import { error404 } from '../components/Error404'
import { companies } from '../data/companyData'
import Loading from './Loading'
import { useNavigate } from 'react-router-dom'
import BigSmiley from '../static/ratings/BigSmiley.png'
import smiley from '../static/ratings/smiley.png'
import neutral from '../static/ratings/neutral.png'
import frown from '../static/ratings/frown.png'
import demon from '../static/ratings/demon.png'

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

    const options = [demon, frown, neutral, smiley, BigSmiley]

    // if routed company changes:
    useEffect(() => {
        ;(async () => {
            await getCompanyData(id)
        })()
    }, [id])

    // get company data helper
    const getCompanyData = async (id) => {
        setLoading(true)
        const res = await fetch(`${HOST}/api/company/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
        })
        const data = await res.json()
        console.log('data: ', data)
        if (data.error) {
            setName(null)
            setLoading(false)
            return
        }
        setEmployeeCount(data.Employees.length)
        setName(data.displayName)
        setLogo(data.logo)
        setInfo(data.description)
        if (data.rating) {
            setRating(Math.floor(data.rating / data.ratedEmployees.length / 20))
        }
        await setPrevAndPost(data)
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
        const top5Prev = []
        for (let i = 0; i < 3; i++) {
            if (i >= prevEntries.length) {
                top5Prev.push({
                    name: 'No data!',
                })
            } else {
                const res = await fetch(
                    `${HOST}/api/company/get/${prevEntries[i][0].toLowerCase()}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json', // Specify the content type as JSON
                        },
                    }
                )
                top5Prev.push(await res.json())
            }
        }
        const top5Post = []
        for (let i = 0; i < 3; i++) {
            if (i >= postEntries.length) {
                top5Post.push({
                    name: 'No data!',
                })
            } else {
                const res = await fetch(
                    `${HOST}/api/company/get/${postEntries[i][0].toLowerCase()}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json', // Specify the content type as JSON
                        },
                    }
                )
                top5Post.push(await res.json())
            }
        }
        setPrevCompanies([...top5Prev])
        setPostCompanies([...top5Post])
        setLoading(false)
    }

    // capitalize helper
    function capitalize(str) {
        // shoutout bobdagoat
        if (typeof str !== 'string' || str.trim() === '') {
            // bad input
            return str
        }

        const formattedCompany = companies.find(
            (company) => company.name.toLowerCase() === str.toLowerCase()
        )

        if (formattedCompany) {
            return formattedCompany.name
        }

        return str
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const navigate = useNavigate()

    const tableElem = (rank, company) => {
        if (company.name === null || employeeCount < 5) {
            return (
                <tr className="h-20">
                    <div className="avatar"></div>
                    <td>{'No data available.'}</td>
                </tr>
            )
        }
        return (
            <tr
                className="w-full transition duration-500 hover:cursor-pointer hover:bg-pipeline-blue-200"
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
                    {`(#${rank + 1}): ` + capitalize(company.name)}
                </td>
            </tr>
        )
    }

    const previousTable = () => {
        return (
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Company Name</th>
                        </tr>
                    </thead>

                    <tbody>
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
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Company Name</th>
                        </tr>
                    </thead>
                    <tbody>
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
                    <div className="card w-min flex-row bg-sky-900 object-center p-4 shadow-2xl">
                        <div className="card flex-col">
                            <img
                                src={logo}
                                className="shadow-2x h-64 w-64 max-w-sm rounded-lg bg-slate-100 object-contain"
                            />
                            <div className="flex-row bg-sky-900 object-center">
                                <h1 className="p-6 text-5xl font-bold text-slate-200">
                                    {name}
                                </h1>
                            </div>
                        </div>
                        <div className="ml-4 w-min flex-col bg-sky-900 object-center p-2">
                            <p className="mb-2 w-72 p-2 text-lg">{info}</p>
                            {rating !== null ? (
                                <div className="card w-min flex-row	bg-gray-900 bg-opacity-60 p-3 shadow-xl">
                                    <p className="mr-2 p-2 text-lg font-bold text-slate-200">
                                        Rating:
                                    </p>
                                    <div
                                        className="tooltip"
                                        data-tip={rating + '/5'}
                                    >
                                        <div className="avatar mr-2 h-12 w-12 rounded-full">
                                            <img
                                                src={
                                                    options[
                                                        Math.ceil(rating) - 1
                                                    ]
                                                }
                                                alt="rating"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    <div className="card w-full bg-sky-900 object-center shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xl text-slate-200">
                                Prior Companies
                            </h2>
                            {previousTable()}
                        </div>
                    </div>
                    <div className="card w-full bg-sky-900 shadow-xl">
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
            <div className="hero-overlay rounded-lg"></div>
            {companyInfo()}
        </div>
    )
}

export default Company
