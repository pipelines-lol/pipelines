import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { HOST } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

// components
import Loading from './Loading'
import { PipelineDisplay } from '../components/PipelineDisplay'
import { PipelineCard } from '../components/PipelineCard'
import { QuerySearchInput } from '../components/QuerySearchInput'

// assets
import { LayoutGrid, Rows3 } from 'lucide-react'

const ERROR_MESSAGE = {
    NO_USERS: 'No users on this site for this company :/',
    NO_COMPANY_FOUND: 'No company on this site with that name :/',
}

function Search() {
    const [query, setQuery] = useState('')
    const [profiles, setProfiles] = useState([])
    const [company, setCompany] = useState(null)

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [viewMode, setViewMode] = useState('grid')

    const [searchParams, setSearchParams] = useSearchParams() // eslint-disable-line no-unused-vars

    const fetchCompanies = async (company) => {
        try {
            const encodedQuery = encodeURIComponent(company)
            const profileData = await fetchWithAuth({
                url: `${HOST}/api/pipeline/search/company/${encodedQuery}`,
                method: 'GET',
            })

            const companyData = await fetchWithAuth({
                url: `${HOST}/api/company/get/${encodedQuery}`,
                method: 'GET',
            })

            // Assuming fetchWithAuth throws for non-OK responses, including 404
            setErrorMessage('') // If the fetch was successful, there's no 404, so we assume some results were found
            setProfiles([...profileData]) // Update the profiles state with the fetched data

            // only calculate the company rating if there are employees that rated it
            const companyRating =
                companyData.ratedEmployees.length !== 0
                    ? Math.floor(
                          companyData.rating /
                              companyData.ratedEmployees.length /
                              20
                      )
                    : null
            setCompany({
                id: companyData.name,
                name: companyData.displayName,
                logo: companyData.logo,
                info: companyData.description,
                rating: companyRating,
            }) // fetch company data to display in card
        } catch (err) {
            throw new Error(err)
        }
    }

    const handleSearch = useCallback(async (query) => {
        // loading state to load query
        setLoading(true)

        try {
            setLoading(true)

            // set the URL query params
            setQuery(query.name)
            const params = { company: query.name }
            setSearchParams(params)

            await fetchCompanies(query.name)
        } catch (error) {
            console.error(error.message)

            // clear the profiles
            setProfiles([])

            // Handle specific conditions like 404 Not Found
            if (error.message.includes('No profiles found.')) {
                setErrorMessage(ERROR_MESSAGE.NO_USERS)
            }
        } finally {
            setLoading(false)
        }
    }, [])

    const resetSearch = () => {
        setQuery('')
        setProfiles([])
        setErrorMessage('')
        setCompany(null)
    }

    useEffect(() => {
        const fetchSearchParamCompanies = async () => {
            const company = searchParams.get('company')

            // edge case: no search params given
            if (!company) {
                resetSearch()
                return
            }

            // if params preset, refetch companies and set query to company in URL
            if (company !== query) {
                setLoading(true)

                try {
                    await fetchCompanies(company)
                    setQuery(company)
                } catch (error) {
                    console.error(error.message)

                    // clear the profiles
                    setProfiles([])

                    // Handle specific conditions like 404 Not Found
                    if (error.message.includes('No profiles found.')) {
                        setErrorMessage(ERROR_MESSAGE.NO_USERS)
                    } else {
                        setErrorMessage(ERROR_MESSAGE.NO_COMPANY_FOUND)
                    }
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchSearchParamCompanies()
    }, [searchParams])

    if (loading) {
        return <Loading />
    }

    const gridView = (
        <div className="my-4 grid grid-cols-2 gap-1 pb-12 sm:gap-2 md:grid-cols-4 md:gap-4">
            {errorMessage ? (
                <div className="col-span-full mt-9 text-center text-3xl font-bold text-pipelines-gray-500">
                    {errorMessage}
                </div>
            ) : (
                profiles.map((profile) => (
                    <PipelineCard
                        key={`pipeline_${profile._id}`}
                        profileId={profile._id}
                        name={profile.firstName + ' ' + profile.lastName}
                        pfp={profile.pfp}
                        anonymous={profile.anonymous}
                        pipeline={profile.pipeline}
                    />
                ))
            )}
        </div>
    )

    const pipelineView = (
        <div className="my-4 flex flex-col gap-16 pb-12">
            {errorMessage ? (
                <div className="col-span-full mt-9 text-center text-3xl font-bold text-pipelines-gray-500">
                    {errorMessage}
                </div>
            ) : (
                profiles.map((profile) => (
                    <PipelineDisplay
                        key={`pipeline_${profile._id}`}
                        profileId={profile._id}
                        name={profile.firstName + ' ' + profile.lastName}
                        pfp={profile.pfp}
                        anonymous={profile.anonymous}
                        pipeline={profile.pipeline}
                    />
                ))
            )}
        </div>
    )

    const ViewButtons = () => (
        <div className="hidden items-center justify-center gap-5 md:flex md:flex-row">
            <button
                className={`rounded-lg p-1 ${viewMode === 'grid' ? 'bg-white bg-opacity-30' : 'transition-all duration-300 hover:bg-white hover:bg-opacity-30'}`}
                onClick={() => setViewMode('grid')}
            >
                <LayoutGrid />
            </button>

            <button
                className={`rounded-lg p-1 ${viewMode === 'pipeline' ? 'bg-white bg-opacity-30' : 'transition-all duration-300 hover:bg-white hover:bg-opacity-30'}`}
                onClick={() => setViewMode('pipeline')}
            >
                <Rows3 />
            </button>
        </div>
    )

    return (
        <>
            <div className="flex min-h-[90vh] w-full flex-col items-center justify-center gap-12 bg-black/20 pt-24">
                <div
                    className="flex w-full flex-col items-center justify-center gap-5 bg-pipeline-blue-200/20 text-center"
                    style={{
                        backgroundImage: 'url("hero.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '50dvh',
                        borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                        borderTop: '1px solid rgba(2, 101, 172, 0.3)',
                    }}
                >
                    <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
                        <h1 className="text-4xl font-light text-pipelines-gray-100 md:text-6xl">
                            Find Your{' '}
                            <span className="text-pipeline-blue-200">
                                Pipeline
                            </span>
                        </h1>
                        <p className="text-xl font-light text-pipelines-gray-100/80">
                            See where you were. Find where you are. <br />{' '}
                            Search where you can be.
                        </p>
                    </div>
                    <QuerySearchInput handleSearch={handleSearch} />
                    <ViewButtons />
                </div>
                {company && <SearchCompanyCard company={company} />}
                {viewMode === 'grid' ? gridView : pipelineView}
            </div>
        </>
    )
}

// assets
import BigSmiley from '../static/ratings/BigSmiley.png'
import smiley from '../static/ratings/smiley.png'
import neutral from '../static/ratings/neutral.png'
import frown from '../static/ratings/frown.png'
import demon from '../static/ratings/demon.png'

const SearchCompanyCard = ({ company }) => {
    const options = [demon, frown, neutral, smiley, BigSmiley]

    const navigate = useNavigate()

    return (
        <button onClick={() => navigate(`/company/${company.id}`)}>
            <div className="min-h-4/5 min-w-1/4 flex flex-col gap-0 rounded-2xl border-2 border-transparent bg-pipeline-blue-200/20 p-4 py-2 text-pipelines-gray-100 md:flex-row md:gap-5 md:px-8 md:py-5 lg:mt-0 ">
                <div className="card flex-col items-center justify-center">
                    <img
                        src={company.logo}
                        className="shadow-2x mt-4 h-24 w-24 max-w-sm rounded-lg object-contain transition-all duration-300 hover:scale-110 hover:cursor-pointer md:mt-0 md:h-32 md:w-32"
                    />
                    <div className="flex-row object-center">
                        <h1 className="p-6 text-5xl font-bold text-slate-200">
                            {company.name}
                        </h1>
                    </div>
                </div>
                <div className="w-full flex-col p-2 md:ml-4 md:w-min md:object-center">
                    <p className="text-md mb-2 w-72 p-2 text-center md:text-left">
                        {company.info}
                    </p>
                    {company.rating !== null ? (
                        <div className="card w-min flex-row	bg-gray-900 bg-opacity-60 p-3 shadow-xl">
                            <p className="mr-2 p-2 text-lg font-bold text-slate-200">
                                Rating:
                            </p>
                            <div
                                className="tooltip"
                                data-tip={company.rating + '/5'}
                            >
                                <div className="avatar mr-2 h-12 w-12 rounded-full">
                                    <img
                                        src={
                                            options[
                                                Math.ceil(company.rating) - 1
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
        </button>
    )
}

export default Search
