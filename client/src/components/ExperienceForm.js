import { useEffect, useState } from "react"
import { ExperienceQuerySearchInput } from "./ExperienceQuerySearchInput";

export const ExperienceForm = ({ experience, index, updateExperience, removeExperience }) => {
    const [company, setCompany] = useState('');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    // initialize experience if one exists
    useEffect(() => {
        if (experience) {
            setCompany(experience.company);
            setTitle(experience.title);
            setDate(experience.date);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleExperienceChange = (e, field) => {
        const value = e.target.value;

        if (field === "title") {

            setTitle(value);

            const newExperience = {
                company: company,
                title: value,
                date: date
            }

            updateExperience(newExperience, index);
            
        } else if (field === "date") {

            setDate(value);

            const newExperience = {
                company: company,
                title: title,
                date: value
            }

            updateExperience(newExperience, index);
            
        } 
    }

    const handleCompanyChange = async (company) => {
        setCompany(company);

        const newExperience = {
            company: company,
            title: title,
            date: date
        }

        updateExperience(newExperience, index);
    }

    return (
        <>
                                
            <div className="flex flex-col justify-center items-center h-96 bg-gray-200 gap-5 p-10">
                <button 
                    className="self-start" 
                    onClick={() => removeExperience(index)}
                >
                    <h1>X</h1>
                </button>
                <div className="flex flex-col justify-center items-center">
                    <label className="text-medium">Company</label>
                    <ExperienceQuerySearchInput 
                        handleSearch={handleCompanyChange}
                    />
                </div>

                <div className="flex flex-col justify-center items-center">
                    <label className="text-medium">Title</label>
                    <input 
                        className="px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none" 
                        placeholder="Software Engineer"
                        value={title}
                        onChange={(e) => handleExperienceChange(e, "title")}
                    />
                </div>

                <div className="flex flex-col justify-center items-center">
                    <label className="text-medium">Date</label>
                    <input 
                        className="px-4 py-2 text-gray-800 bg-gray-100 rounded-full outline-none" 
                        placeholder="September 2020 - September 2021"
                        value={date}
                        onChange={(e) => handleExperienceChange(e, "date")}
                    />
                </div>
            </div>

        </>
    )
}