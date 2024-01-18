import { useState } from "react";

const Suggestions = () => {
  const [suggestionType, setSuggestionType] = useState("");

  const handleDropdown = (event) => {
    setSuggestionType(event.target.value);
  };

  return (
    <div className="flex justify-center items-center w-full h-[90vh] bg-gray-100">
      <div className="flex flex-col justify-center items-center w-1/2 md:w=[28rem] lg:w-[32rem] xl:w-[36rem] h-7/10 bg-white shadow-md py-10 gap-10 mt-20">
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
            <option value="website-issues">Bugs/Issues</option>
            <option value="other">Other</option>
          </select>

          <form
            action="https://getform.io/f/0f9b59be-ed87-4f61-b536-63e11c134c9e"
            method="POST"
          >
            {suggestionType === "company" && (
              <textarea
                type="text"
                name="company"
                className="mt-7 mb-4 px-4 py-4 text-gray-800 bg-gray-100 rounded-md outline-none w-full resize-none"
                placeholder="Can you add Ouckah LLC?"
                rows="4"
                required
              />
            )}

            {suggestionType === "website-issues" && (
              <textarea
                type="text"
                name="website-issues"
                className="mt-7 mb-4 px-4 py-4 text-gray-800 bg-gray-100 rounded-md outline-none w-full resize-none"
                placeholder="Error when I try to add a company"
                rows="4"
                required
              />
            )}
            {suggestionType === "other" && (
              <textarea
                type="text"
                name="other"
                className="mt-7 mb-4 px-4 py-4 text-gray-800 bg-gray-100 rounded-md outline-none w-full resize-none"
                placeholder="You guys smell"
                rows="4"
                required
              />
            )}

            <div className="flex justify-center">
              <button className="mt-7 bg-black px-12 py-2 rounded-full">
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
