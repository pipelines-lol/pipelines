import React from 'react';
import { useState } from 'react';

const Suggestions = () =>{

    const [suggestionType, setSuggestionType] = useState('')

    const handleDropdown = (event) => {
        setSuggestionType(event.target.value)
    }

    return ( 
        <div className = "suggestion-page-containter">
            <select
                value = {suggestionType}
                onChange = {handleDropdown}
                className = "dropdown-class"
            >
                <option value =""> Select a suggestion type</option>

            </select>    
        </div>
    )
}

export default Suggestions;