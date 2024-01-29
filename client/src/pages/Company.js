import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { HOMEPAGE } from '../util/apiRoutes'
import { companies } from '../data/companyData'
import { error404 } from '../components/Error404'

const Company = () => {
    const { id } = useParams()
    const [name, setName] = useState('')
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
    }, [])

    const error404component = error404(
        'We were unable to find the company you requested!'
    )

    return name === null ? (
        error404component
    ) : (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <img src={logo} className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                    <h1 className="text-5xl font-bold">{name}</h1>
                    <p className="py-6">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut
                        assumenda excepturi exercitationem quasi. In deleniti
                        eaque aut repudiandae et a id nisi.
                    </p>
                    <button className="btn btn-primary">Get Started</button>
                </div>
            </div>
        </div>
    )
}

export default Company
