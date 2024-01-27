import { useState } from 'react'
import { companies } from '../data/companyData'
import { useCallback } from 'react'

export const QuerySearchInput = ({ handleSearch }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const hasResults = results.length > 0

    const handleInputChange = useCallback(
        (event) => {
            const inputValue = event.target.value
            setQuery(inputValue)

            // make sure there's an input before querying
            if (inputValue.length > 0) {
                const filteredCompanies = companies.filter((company) =>
                    company.name
                        .toLowerCase()
                        .startsWith(inputValue.toLowerCase())
                )
                setResults(filteredCompanies)
            } else {
                setResults([])
            }
        },
        [companies]
    )

    const handleCompanyButtonClick = useCallback(
        async (company) => {
            // reset text input
            setQuery('')
            setResults([])

            await handleSearch(company.name)
        },
        [setQuery, setResults, handleSearch]
    )

    return (
        <>
            <form
                className={`flex w-full flex-col items-center justify-center ${hasResults ? 'relative' : ''}`}
                onSubmit={(e) => e.preventDefault()} // Prevent form submission
            >
                <input
                    className={
                        'z-20 h-20 w-4/6 rounded-2xl border-2 border-white/5 bg-pipeline-blue-200/10 p-10 text-xl text-white focus:outline-none focus:ring-2 focus:ring-pipeline-blue-200 focus:ring-opacity-50 md:w-1/2'
                    }
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search companies..."
                />
                <div
                    className={`z-10 max-h-96 w-1/2 -translate-y-2 overflow-y-scroll bg-pipeline-blue-200/10 shadow-md ${hasResults ? 'absolute top-full' : ''}`}
                >
                    {hasResults &&
                        results.map((company) => (
                            <div
                                key={`${company.name}_result`}
                                className="flex flex-row items-center justify-center px-5 py-2 hover:bg-pipeline-blue-200"
                            >
                                <img
                                    className="h-10 w-10 rounded-lg object-contain"
                                    src={`logos/${company.logo}`}
                                    alt={`logo_${company.name}`}
                                />
                                <button
                                    key={company.id} // Add a unique key for each button
                                    className="h-16 w-full p-5 text-start text-white"
                                    onClick={() =>
                                        handleCompanyButtonClick(company)
                                    }
                                >
                                    <h1>{company.name}</h1>
                                </button>
                            </div>
                        ))}
                </div>
            </form>
        </>
    )
}
