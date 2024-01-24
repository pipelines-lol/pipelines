import { useEffect, useState } from 'react'
import { ExperienceQuerySearchInput } from './ExperienceQuerySearchInput'
import { TitleQuerySearchInput } from './TitleQuerySearchInput'
import { X } from 'lucide-react'
import BigSmiley from '../static/ratings/BigSmiley.jpg'
import smiley from '../static/ratings/smiley.png'
import neutral from '../static/ratings/neutral.png'
import frown from '../static/ratings/frown.png'
import demon from '../static/ratings/demon.jpeg'

export const ExperienceForm = ({
    experience,
    index,
    updateExperience,
    removeExperience,
    setIsValid,
}) => {
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isIndefinite, setIsIndefinite] = useState(false)
    const [rating, setRating] = useState(0)
    const [selectedOption, setSelectedOption] = useState(1)
    const [ratingBox, setRatingBox] = useState(false)

    const options = [
        {
            id: 1000,
            value: 20,
            img: demon,
        },
        {
            id: 2000,
            value: 40,
            img: frown,
        },
        {
            id: 3000,
            value: 60,
            img: neutral,
        },
        {
            id: 4000,
            value: 80,
            img: smiley,
        },
        {
            id: 5000,
            value: 100,
            img: BigSmiley,
        },
    ]

    // initialize experience if one exists
    useEffect(() => {
        if (experience) {
            setCompany(experience.company)
            setTitle(experience.title)

            let start, end

            // Check if date property exists and is not empty
            if (experience.date && experience.date !== '') {
                ;[start, end] = experience.date.split('-')

                start = start.trim()
                end = end.trim()
            } else {
                // Set default values if date is empty or undefined
                ;[start, end] = ['', '']
            }

            setStartDate(convertDateFormat(start))
            setEndDate(convertDateFormat(end))
        }
    }, [experience])

    useEffect(() => {
        // Validation logic here
        if (endDate < startDate) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }, [endDate, startDate, setIsValid])

    function flipDateFormat(inputDate) {
        // Parse the input date string
        const [year, month] = inputDate.split('-')

        // Convert the month from numeric to textual representation
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        const monthText = monthNames[parseInt(month, 10) - 1]

        // Combine the month and year into the desired format
        const outputDate = `${monthText} ${year}`

        return outputDate
    }

    function convertDateFormat(inputDate) {
        // edge case: blank date
        if (inputDate === '') {
            return ''
        }

        // Split the input date string into month and year
        const [month, year] = inputDate.split(' ')

        // Convert the month from textual to numeric representation
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        const monthNumeric = monthNames.indexOf(month) + 1

        // Pad the month with a leading zero if needed
        const paddedMonth =
            monthNumeric < 10 ? `0${monthNumeric}` : `${monthNumeric}`

        // Combine the month and year into the desired format
        const outputDate = `${year}-${paddedMonth}`

        return outputDate
    }

    const handleExperienceChange = (e, field) => {
        const value = e.target.value

        if (field === 'startDate') {
            setStartDate(value)

            const newExperience = {
                company,
                title,
                date: `${flipDateFormat(value)} - ${
                    isIndefinite ? 'Indefinite' : flipDateFormat(endDate)
                }`,
            }

            updateExperience(newExperience, index)
        } else if (field === 'endDate') {
            setEndDate(value)

            const newExperience = {
                company,
                title,
                date: `${flipDateFormat(startDate)} - ${flipDateFormat(value)}`,
            }

            updateExperience(newExperience, index)
        }
    }

    const handleCompanyChange = async (value) => {
        setCompany(value)

        const newExperience = {
            company: value,
            title,
            date: `${flipDateFormat(value)} - ${flipDateFormat(endDate)}`,
        }

        updateExperience(newExperience, index)
    }

    const handleRatingClick = (id, value) => {
        setRating(value)
        setSelectedOption(id)
        console.log(rating)
    }

    const handleRatingBox = () => {
        setRating(0)
        setRatingBox(!ratingBox)
    }

    const handleTitleChange = async (value) => {
        setTitle(value)

        const newExperience = {
            company,
            title: value,
            date: `${flipDateFormat(startDate)} - ${flipDateFormat(endDate)}`,
        }

        updateExperience(newExperience, index)
    }

    const handleIndefiniteCheckboxChange = (e) => {
        setIsIndefinite(e.target.checked)

        const newExperience = {
            company,
            title,
            date: `${flipDateFormat(startDate)} - ${!isIndefinite ? 'Indefinite' : flipDateFormat(endDate)}`,
        }

        updateExperience(newExperience, index)
    }

    return (
        <>
            <div className="flex h-auto w-auto flex-col items-center justify-center gap-4 overflow-y-hidden rounded-lg bg-white bg-opacity-20 p-10 shadow-lg backdrop-blur-xl backdrop-filter">
                <button
                    className="self-start"
                    onClick={() => removeExperience(index)}
                >
                    <X
                        size={20}
                        className="-translate-x-5 text-pipelines-gray-100"
                    />
                </button>
                <div className="flex flex-col items-center justify-center gap-3">
                    <label className="text-light text-pipelines-gray-100">
                        Company
                    </label>
                    <ExperienceQuerySearchInput
                        value={company}
                        handleSearch={handleCompanyChange}
                    />
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                    <label className="text-light text-pipelines-gray-100">
                        Title
                    </label>
                    <TitleQuerySearchInput
                        value={title}
                        handleSearch={handleTitleChange}
                    />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <label className="text-medium text-white">
                        Rate your experience
                    </label>
                    {!ratingBox ? (
                        <div className="flex space-x-4 bg-gray-200">
                            {options.map(({ id, value, img }) => (
                                <button
                                    key={id}
                                    onClick={() => handleRatingClick(id, value)}
                                    className={`border px-4 py-2 ${
                                        selectedOption === id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-black'
                                    } cursor-pointer transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white`}
                                >
                                    <img
                                        className="h-[30px] w-[30px]"
                                        src={img}
                                        alt="rating"
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex flex-col md:flex-row">
                        <label className="text-medium ml-2 pr-2 text-white">
                            N/A
                        </label>
                        <input
                            type="checkbox"
                            checked={ratingBox}
                            onChange={() => handleRatingBox()}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                    <label className="text-light text-pipelines-gray-100">
                        Date
                    </label>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <input
                            className="rounded-full bg-gray-100/60 px-4 py-2 text-gray-800 outline-none"
                            placeholder="September 2020 - September 2021"
                            value={startDate}
                            type="month"
                            pattern="\d{4}-\d{2}"
                            onChange={(e) =>
                                handleExperienceChange(e, 'startDate')
                            }
                        />

                        {!isIndefinite ? (
                            <input
                                className="rounded-full bg-gray-100 px-4 py-2 text-gray-800 outline-none"
                                placeholder="September 2020 - September 2021"
                                value={endDate}
                                type="month"
                                pattern="\d{4}-\d{2}"
                                onChange={(e) =>
                                    handleExperienceChange(e, 'endDate')
                                }
                            />
                        ) : (
                            <div></div>
                        )}
                        <div className="flex flex-row md:flex-col">
                            <label className="medium ml-2 pr-2 text-white">
                                Indefinite
                            </label>
                            <input
                                type="checkbox"
                                checked={isIndefinite}
                                onChange={handleIndefiniteCheckboxChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
