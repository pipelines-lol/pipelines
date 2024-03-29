import { useEffect, useState } from 'react'

import { HOST } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

export const ExperienceQuerySearchInput = ({ value, handleSearch }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const hasResults = results.length > 0

    // initialize company if one exists
    useEffect(() => {
        // reset query before checking if theres a previous value
        setQuery('')

        // check if there was a previous value
        // if there was, set query to it
        if (value) {
            setQuery(value.companyName)
        }
    }, [value])

    const handleInputChange = async (event) => {
        const inputValue = event.target.value
        setQuery(inputValue.name)

        // make sure theres an input before querying
        if (inputValue.length > 0) {
            try {
                const data = await fetchWithAuth({
                    url: `${HOST}/api/company/get/companies/${inputValue.toLowerCase()}`,
                    method: 'GET',
                })
                setResults(data)
            } catch (error) {
                console.error(error.message)
            }
        } else {
            setResults([])

            await handleSearch('')
        }
    }

    const handleCompanyButtonClick = async (company) => {
        // reset text input
        setQuery(company.displayName)
        setResults([])

        await handleSearch(company)
    }

    return (
        <>
            <form
                className={`flex w-full flex-col items-center justify-center ${hasResults ? 'relative' : ''}`}
                onSubmit={(e) => e.preventDefault()} // Prevent form submission
            >
                <input
                    className={
                        'z-20 w-full rounded-2xl bg-gray-100/60 px-4 py-2 text-black outline-none placeholder:text-gray-950/30'
                    }
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="i.e. Google"
                />
                <div
                    className={`z-30 max-h-44 w-full translate-y-1 overflow-y-scroll bg-slate-200 text-gray-800 shadow-md ${hasResults ? 'absolute top-full' : ''}`}
                >
                    {hasResults &&
                        results.map((company) => (
                            <div
                                key={`${company.name}_result`}
                                className="flex flex-row items-center justify-center px-5 py-2 transition-all duration-500 hover:bg-pipeline-blue-200 hover:text-white"
                            >
                                <img
                                    className="h-10 w-10 rounded-lg object-contain"
                                    src={`${company.logo}`}
                                    alt={`logo_${company.displayName}`}
                                />
                                <button
                                    key={company.id} // Add a unique key for each button
                                    className="flex h-16 w-full items-center p-5 text-start"
                                    onClick={() =>
                                        handleCompanyButtonClick(company)
                                    }
                                >
                                    <h1>{company.displayName}</h1>
                                </button>
                            </div>
                        ))}
                </div>
            </form>
        </>
    )
}
