import { useEffect, useState } from "react";

export const SchoolQuerySearch = ({ value, handleSearch }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const hasResults = results.length > 0;

  const [timerId, setTimerId] = useState(null);
  const TIMER_DELAY = 500; // milliseconds

  useEffect(() => {
    // Cleanup the timer on component unmount
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  // initialize school if one exists
  useEffect(() => {
    // reset query before checking if theres a previous value
    setQuery("");

    // check if there was a previous value
    // if there was, set query to it
    if (value) {
      setQuery(value);
    }
  }, [value]);

  const fetchSchools = async (query) => {
    // edge case: empty query
    if (query === "") return;

    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        // Check if the response has JSON content
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();
          throw new Error(`${errorData.error}`);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const data = await response.json();

      // Remove duplicates based on the "name" property
      const uniqueResults = data.reduce((unique, school) => {
        if (!unique.find((item) => item.name === school.name)) {
          unique.push(school);
        }
        return unique;
      }, []);

      console.log("data:", data);
      console.log("query:", query);

      setResults(uniqueResults);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (event) => {
    const newQuery = event.target.value;

    // Clear the existing timer
    if (timerId) {
      clearTimeout(timerId);
    }

    // edge case: empty query
    if (newQuery === "") {
      setQuery("");
      setResults([]);

      // clear current search
      handleSearch("");
      return;
    }

    // Set a new timer to fetch schools after a certain delay
    const newTimerId = setTimeout(() => {
      fetchSchools(newQuery);
    }, TIMER_DELAY); // Adjust the delay time as needed (in milliseconds)

    // Update the state with the new query and timer ID
    setQuery(newQuery);
    setTimerId(newTimerId);
  };

  const handleSchoolButtonClick = (school) => {
    // clear results
    setQuery(school.name);
    setResults([]);

    // Handle the school button click
    handleSearch(school.name);
  };

  return (
    <>
      <form
        className={`flex flex-col justify-center items-center w-full ${hasResults ? "relative" : ""}`}
        onSubmit={(e) => e.preventDefault()} // Prevent form submission
      >
        <input
          className={
            "w-full z-20 px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none"
          }
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Harvard University"
        />
        <div
          className={`bg-white w-full max-h-36 z-10 -translate-y-4 overflow-y-scroll shadow-md ${hasResults ? "absolute top-full" : ""}`}
        >
          {hasResults &&
            results.map((school) => (
              <div
                key={`${school.name}_result`}
                className="flex flex-row justify-center items-center px-5 py-2 hover:bg-gray-100"
              >
                {/* <img
                  className="w-10 h-10 rounded-lg object-contain"
                  src={}
                  alt={`school_`}
                /> */}
                <button
                  key={`school_button_${school.name}`} // Add a unique key for each button
                  className="w-full h-16 p-5 text-start"
                  onClick={() => handleSchoolButtonClick(school)}
                >
                  <h1>{school.name}</h1>
                </button>
              </div>
            ))}
        </div>
      </form>
    </>
  );
};
