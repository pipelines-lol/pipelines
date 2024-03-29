import { useEffect, useState } from 'react'

import { HOST } from '../util/apiRoutes'
import { fetchWithAuth } from '../util/fetchUtils'

export const SchoolQuerySearch = ({ value, handleSearch }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const hasResults = results.length > 0 && query !== ''

    const [timerId, setTimerId] = useState(null)
    const TIMER_DELAY = 100 // milliseconds

    useEffect(() => {
        // Cleanup the timer on component unmount
        return () => {
            if (timerId) {
                clearTimeout(timerId)
            }
        }
    }, [timerId])

    // initialize school if one exists
    useEffect(() => {
        value ? setQuery(value) : setQuery('')
    }, [value])

    const fetchSchools = async (query) => {
        // edge case: empty query
        if (query === '') return

        try {
            const data = await fetchWithAuth({
                url: `${HOST}/api/school?name=${query}`,
                method: 'GET',
            })

            // Remove duplicates based on the "name" property
            const uniqueResults = data.reduce((unique, school) => {
                if (!unique.some((item) => item.name === school.name)) {
                    unique.push(school)
                }
                return unique
            }, [])

            setResults(uniqueResults)
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleInputChange = (event) => {
        const newQuery = event.target.value

        // Clear the existing timer
        if (timerId) {
            clearTimeout(timerId)
        }

        // edge case: empty query
        if (newQuery === '') {
            setQuery('')
            setResults([])

            // clear current search
            handleSearch('')
            return
        }

        // Set a new timer to fetch schools after a certain delay
        const newTimerId = setTimeout(() => {
            fetchSchools(newQuery)
        }, TIMER_DELAY) // Adjust the delay time as needed (in milliseconds)

        // Update the state with the new query and timer ID
        setQuery(newQuery)
        setTimerId(newTimerId)
    }

    const handleSchoolButtonClick = (school) => {
        // clear results
        setQuery(school.name)
        setResults([])

        // Handle the school button click
        handleSearch(school.name)
    }

    return (
        <>
            <form
                className={`relative mx-auto flex w-full flex-col items-center justify-center gap-6 transition-all duration-500 ease-in-out ${hasResults ? 'visible mb-44' : ''}`}
                onSubmit={(e) => e.preventDefault()} // Prevent form submission
            >
                <label className="text-light text-pipelines-gray-100">
                    Education
                </label>
                <input
                    className={
                        'z-30 w-full rounded-full border-2 border-transparent bg-pipeline-blue-200/20 px-4 py-2 text-pipelines-gray-100 outline-none focus:bg-pipeline-blue-200/40 focus:ring-1 focus:ring-blue-300/40'
                    }
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Harvard University"
                />
                <div
                    className={`z-20 max-h-36 w-full overflow-y-scroll bg-white shadow-md ${hasResults ? 'absolute top-full mt-2 rounded-lg' : 'hidden'}`}
                >
                    {hasResults &&
                        results.map((school) => (
                            <div
                                key={`${school.name}_result`}
                                className="flex flex-row items-center justify-center bg-white px-5 py-2 hover:bg-pipeline-blue-200/10"
                            >
                                <button
                                    key={`school_button_${school.name}`}
                                    className="h-16 w-full p-5 text-start"
                                    type="button"
                                    onClick={() =>
                                        handleSchoolButtonClick(school)
                                    }
                                >
                                    <h1>{school.name}</h1>
                                </button>
                            </div>
                        ))}
                </div>
            </form>
        </>
    )
}
