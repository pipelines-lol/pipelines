import React, { useState } from "react";

const Suggestions = () => {
  const [suggestionType, setSuggestionType] = useState("");

  const handleDropdown = (event) => {
    setSuggestionType(event.target.value);
  };

  return (
    <div className="flex justify-center items-center w-full h-[90vh] bg-gray-100">
      <div className="flex flex-col justify-center items-center w-96 h-2/3 bg-white shadow-md py-10 gap-10">
        <h1 className="text-black font-semibold text-2xl tracking-wide uppercase">
          Suggestions
        </h1>

        <div className="flex flex-col gap-3 w-full px-4">
          <select
            value={suggestionType}
            onChange={handleDropdown}
            className="mb-3 px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none w-full" // Adjusted the class to match the input style
          >
            <option value="" disabled hidden>
              {" "}
              Suggestion Type
            </option>
            <option value="company">Company</option>
            <option value="website issues">Bugs/Issues</option>
            <option value="other">Other</option>
          </select>

          <form action="/" method="POST">
            <input
              className="mt-7 mb-4 px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none w-full"
              placeholder="You guys smell"
            />

            <div className="flex justify-center">
              <button
                className="mt-7 bg-black px-12 py-2 rounded-full"

              >
                <h1 className="text-white">Submit Suggestion</h1>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
