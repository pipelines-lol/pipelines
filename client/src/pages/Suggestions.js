import React from 'react';
import { useState } from 'react';

const Suggestions = () =>{

    const [suggestionType, setSuggestionType] = useState('')

    const handleDropdown = (event) => {
        setSuggestionType(event.target.value)
    }

    

    return ( 
        
        <div className = "flex flex-col justify-center items-start text-center w-full h-[50vh] gap-8">
            <div className = "w-full flex justify-center"> 
                <select
                    value = {suggestionType}
                    onChange = {handleDropdown}
                    className = "dropdown-class"
                >
                    <option value ="" disabled hidden > Suggestion Type</option>
                    <option value ="company"> Company </option>
                    <option value ="website issues"> Bugs/Issues </option>
                    <option value ="other"> Other </option>
                    
                
                </select>
            </div>
        </div>
    )
}

export default Suggestions;