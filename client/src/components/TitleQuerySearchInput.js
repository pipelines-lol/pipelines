import { useEffect, useState } from 'react'
import { titles } from '../data/companyData'

export const TitleQuerySearchInput = ({ value, handleSearch }) => {
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
            setQuery(value)
        }
    }, [value])

    const handleInputChange = async (event) => {
        const inputValue = event.target.value
        setQuery(inputValue)

        // make sure theres an input before querying
        if (inputValue.length > 0) {
            const filteredCompanies = titles.filter((title) =>
                title.toLowerCase().startsWith(inputValue.toLowerCase())
            )
            setResults(filteredCompanies)
        } else {
            setResults([])
        }

        await handleSearch(inputValue)
    }

    const handleTitleButtonClick = async (title) => {
        // reset text input
        setQuery(title)
        setResults([])

        await handleSearch(title)
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
                    placeholder="i.e. Software Engineer"
                />
                <div
                    className={`z-30 max-h-44 w-full translate-y-1 overflow-y-scroll bg-gray-200 shadow-md ${hasResults ? 'absolute top-full' : ''}`}
                >
                    {hasResults &&
                        results.map((title) => (
                            <div
                                key={`${title}_result`}
                                className="flex flex-row items-center justify-center px-5 py-2 hover:bg-gray-100"
                            >
                                <button
                                    key={title} // Add a unique key for each button
                                    className="flex h-auto w-full items-center text-start"
                                    onClick={() =>
                                        handleTitleButtonClick(title)
                                    }
                                >
                                    <h1>{title}</h1>
                                </button>
                            </div>
                        ))}
                </div>
            </form>
        </>
    )
}
