import { useEffect, useState } from "react";
import { titles } from "../data/companyData"

export const TitleQuerySearchInput = ({ value, handleSearch }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    let hasResults = results.length > 0;

    // initialize company if one exists
    useEffect(() => {

        // reset query before checking if theres a previous value
        setQuery("");

        // check if there was a previous value
        // if there was, set query to it
        if (value) {
            setQuery(value);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleInputChange = async (event) => {
        const inputValue = event.target.value;
        setQuery(inputValue);

        // make sure theres an input before querying
        if (inputValue.length > 0) {
            const filteredCompanies = titles.filter((title) =>
                title.toLowerCase().startsWith(inputValue.toLowerCase())
            );
            setResults(filteredCompanies);
        } else {
            setResults([]);
        }

        await handleSearch(inputValue);
    };

    const handleTitleButtonClick = async (title) => {
        // reset text input
        setQuery(title);
        setResults([]);

        await handleSearch(title);
    }

    return (
        <>
        
            <form
                className={`flex flex-col justify-center items-center w-full ${hasResults ? "relative" : ""}`}
                onSubmit={(e) => e.preventDefault()} // Prevent form submission
            >
                <input
                    className={`px-4 py-2 z-20 bg-gray-100 rounded-2xl`}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Software Engineer Intern"
                />
                <div className={`bg-white w-full max-h-44 z-10 -translate-y-2 overflow-y-scroll p-2 shadow-md ${hasResults ? "absolute top-full" : "hidden"}`}>
                    {hasResults && results.map((title) => (
                        <div 
                            key={`${title}_result`}
                            className="flex flex-row justify-center items-center px-5 py-2 hover:bg-gray-100"
                        >
                            <button
                                key={title} // Add a unique key for each button
                                className="flex items-center w-full h-auto text-start"
                                onClick={() => handleTitleButtonClick(title)}
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