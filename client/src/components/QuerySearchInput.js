import { useState } from "react";
import { companies } from "../data/companyData"

export const QuerySearchInput = ({ handleSearch }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    let hasResults = results.length > 0;

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setQuery(inputValue);

        // make sure theres an input before querying
        if (inputValue.length > 0) {
            const filteredCompanies = companies.filter((company) =>
                company.name.toLowerCase().startsWith(inputValue.toLowerCase())
            );
            setResults(filteredCompanies);
        } else {
            setResults([]);
        }
    };

    const handleCompanyButtonClick = async (company) => {
        // reset text input
        setQuery("");
        setResults([]);

        await handleSearch(company.name);
    }

    return (
        <>
        
            <form
                className={`flex flex-col justify-center items-center w-full ${hasResults ? "relative" : ""}`}
                onSubmit={(e) => e.preventDefault()} // Prevent form submission
            >
                <input
                    className={`w-1/2 h-20 z-20 bg-white rounded-2xl text-xl p-10`}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search companies..."
                />
                <div className={`bg-white w-1/2 max-h-96 z-10 -translate-y-2 overflow-y-scroll shadow-md ${hasResults ? "absolute top-full" : ""}`}>
                    {hasResults && results.map((company) => (
                        <div 
                            key={`${company.name}_result`}
                            className="flex flex-row justify-center items-center px-5 py-2 hover:bg-gray-100"
                        >
                            <img 
                                className="w-10 h-10 rounded-lg" 
                                src={`logos/${company.logo}`} 
                                alt={`logo_${company.name}`}
                            />
                            <button
                                key={company.id} // Add a unique key for each button
                                className="w-full h-16 p-5 text-start"
                                onClick={() => handleCompanyButtonClick(company)}
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