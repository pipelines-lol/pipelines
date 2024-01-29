import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { HOMEPAGE } from '../util/apiRoutes'
import { companies } from '../data/companyData'
import { error404 } from '../components/Error404'

const Company = () => {
    const { id } = useParams()
    const [name, setName] = useState('')
    const [info, setInfo] = useState('')
    const [logo, setLogo] = useState('')
    const getLogoByName = (companyName) => {
        const foundCompany = companies.find(
            (company) => company.name.toLowerCase() === companyName
        )
        setName(foundCompany?.name || null)
        return foundCompany ? foundCompany.logo : null
    }

    useEffect(() => {
        setLogo(`${HOMEPAGE}/logos/${getLogoByName(id)}`)
        setInfo(
            'Bloomberg is a global leader in business and financial information, delivering trusted data, news, and insights that bring transparency, efficiency, and fairness to markets. The company helps connect influential communities across the global financial ecosystem via reliable technology solutions that enable our customers to make more informed decisions and foster better collaboration.'
        )
    }, [])

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
                        <tr className="hover">
                            <div className="avatar">
                                <div className="mask mask-squircle m-2 h-12 w-12">
                                    <img src={logo} />
                                </div>
                            </div>
                            <td>Cy Ganderton</td>
                        </tr>
                        <tr className="hover">
                            <div className="avatar">
                                <div className="mask mask-squircle m-2 h-12 w-12">
                                    <img src={logo} />
                                </div>
                            </div>
                            <td>Hart Hagerty</td>
                        </tr>
                        <tr className="hover">
                            <div className="avatar">
                                <div className="mask mask-squircle m-2 h-12 w-12">
                                    <img src={logo} />
                                </div>
                            </div>
                            <td>Brice Swyre</td>
                        </tr>
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
                        <tr className="hover">
                            <div className="avatar">
                                <div className="mask mask-squircle m-2 h-12 w-12">
                                    <img src={logo} />
                                </div>
                            </div>
                            <td>Cy Ganderton</td>
                        </tr>
                        <tr className="hover">
                            <div className="avatar">
                                <div className="mask mask-squircle m-2 h-12 w-12">
                                    <img src={logo} />
                                </div>
                            </div>
                            <td>Hart Hagerty</td>
                        </tr>
                        <tr className="hover">
                            <div className="avatar">
                                <div className="mask mask-squircle m-2 h-12 w-12">
                                    <img src={logo} />
                                </div>
                            </div>
                            <td>Brice Swyre</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const companyInfo = () => {
        return (
            <div className="flex-col p-8">
                <div className="hero-content flex-col rounded-lg bg-slate-500 bg-opacity-50 lg:flex-row">
                    <div className="card m-4 w-min flex-col bg-sky-950 object-center shadow-2xl">
                        <div className="card flex-row">
                            <img
                                src={logo}
                                className="shadow-2x w-48 max-w-sm rounded-lg p-4"
                            />
                            <h1 className="mt-10 p-6 pr-10 text-5xl font-bold">
                                {name}
                            </h1>
                        </div>

                        <p className="w-fit p-6 text-xs">{info}</p>
                        <div className="stat">
                            <div className="stat-title">Employees</div>
                            <div className="stat-description">31,000</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Headquarters</div>
                            <div className="stat-description">
                                San Francisco, CA
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Founded</div>
                            <div className="stat-description">2016</div>
                        </div>
                    </div>
                    <div className="card mb-5 w-full bg-slate-600 object-center shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xl">
                                Previous Companies
                            </h2>
                            {previousTable()}
                        </div>
                    </div>
                    <div className="card mb-5  w-full bg-slate-600 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-xl">
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

    return name === null ? (
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
