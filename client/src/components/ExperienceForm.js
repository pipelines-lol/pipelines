import { useEffect, useState } from 'react'
import { ExperienceQuerySearchInput } from './ExperienceQuerySearchInput'
import { TitleQuerySearchInput } from './TitleQuerySearchInput'
import { X } from 'lucide-react'
import BigSmiley from '../static/ratings/BigSmiley.jpg'
import smiley from '../static/ratings/smiley.png'
import neutral from '../static/ratings/neutral.png'
import frown from '../static/ratings/frown.png'
import demon from '../static/ratings/demon.jpeg'
import { HOST } from '../util/apiRoutes'

export const ExperienceForm = ({
    experience,
    index,
    updateExperience,
    removeExperience,
    updateDate,
}) => {
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isIndefinite, setIsIndefinite] = useState(false)
    const [rating, setRating] = useState(0)
    const [selectedOption, setSelectedOption] = useState(1)
    const [ratingBox, setRatingBox] = useState(false)
    const [companyId, setCompanyId] = useState('')
    const [first, setFirst] = useState(true)

    const options = [
        {
            id: 1,
            value: 20,
            img: demon,
        },
        {
            id: 2,
            value: 40,
            img: frown,
        },
        {
            id: 3,
            value: 60,
            img: neutral,
        },
        {
            id: 4,
            value: 80,
            img: smiley,
        },
        {
            id: 5,
            value: 100,
            img: BigSmiley,
        },
    ]

    // initialize experience if one exists
    useEffect(() => {
        if (experience) {
            setCompany(experience.companyName)
            setTitle(experience.title)
            setCompanyId(experience.companyId)
            setRating(experience.rating)
            setSelectedOption(experience.rating / 20)
            setIsIndefinite(experience.isIndefinite)

            let start, end

            // Check if date property exists and is not empty
            if (
                experience.startDate &&
                experience.startDate !== '' &&
                experience.endDate &&
                experience.endDate !== '' &&
                !experience.isIndefinite
            ) {
                const startDate = new Date(experience.startDate)

                start = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`

                const endDate = new Date(experience.endDate)

                end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`
            } else if (experience.startDate && experience.startDate !== '') {
                const startDate = new Date(experience.startDate)
                start = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
                end = ''
            } else if (
                experience.endDate &&
                experience.endDate !== '' &&
                !experience.isIndefinite
            ) {
                start = ''
                const endDate = new Date(experience.endDate)
                end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`
            } else if (
                experience.endDate &&
                experience.endDate !== '' &&
                experience.isIndefinite
            ) {
                start = ''
                end = ''
            } else {
                // Set default values if date is empty or undefined
                ;[start, end] = ['', '']
            }
            setStartDate(start)
            setEndDate(end)
        }
    }, [experience])

    function flipDateFormat(inputDate) {
        if (inputDate) {
            const [year, month] = inputDate.split('-')

            // Creating a Date object with the given year and month
            const date = new Date(`${year}-${month}-02T00:00:00.000Z`)
            // Convert the Date object to an ISO string
            const isoDateString = date.toISOString()

            return isoDateString
        } else {
            return ''
        }
    }

    const handleExperienceChange = (e, field) => {
        setFirst(true)
        const value = e.target.value

        if (field === 'startDate') {
            setStartDate(value)
            const newExperience = {
                companyName: company,
                companyId: companyId,
                title: title,
                endDate: flipDateFormat(endDate),
                startDate: flipDateFormat(value),
                isIndefinite: isIndefinite,
                rating: rating,
            }

            if (new Date(endDate).getTime() < new Date(value).getTime()) {
                updateDate(false, index)
            } else {
                updateDate(true, index)
            }

            updateExperience(newExperience, index)
        } else if (field === 'endDate') {
            setEndDate(value)

            const newExperience = {
                companyName: company,
                companyId: companyId,
                title: title,
                endDate: flipDateFormat(value),
                startDate: flipDateFormat(startDate),
                isIndefinite: isIndefinite,
                rating: rating,
            }

            if (new Date(value).getTime() < new Date(startDate).getTime()) {
                updateDate(false, index)
            } else {
                updateDate(true, index)
            }

            updateExperience(newExperience, index)
        }
    }

    const handleCompanyChange = async (value) => {
        setCompany(value)

        const response = await fetch(`${HOST}/api/company/get/${value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
        })
        const data = await response.json()
        setCompanyId(data._id)

        const newExperience = {
            companyName: value,
            companyId: data._id,
            title: title,
            endDate: flipDateFormat(endDate),
            startDate: flipDateFormat(startDate),
            isIndefinite: isIndefinite,
            rating: rating,
        }

        updateExperience(newExperience, index)
    }

    const handleRatingClick = (id, value) => {
        setRating(value)
        setSelectedOption(id)

        const newExperience = {
            companyName: company,
            companyId: companyId,
            title: title,
            endDate: flipDateFormat(endDate),
            startDate: flipDateFormat(startDate),
            isIndefinite: isIndefinite,
            rating: value,
        }

        updateExperience(newExperience, index)
    }

    const handleRatingBox = () => {
        setRating(0)
        setRatingBox(!ratingBox)
    }

    const handleTitleChange = async (value) => {
        setTitle(value)

        const newExperience = {
            companyName: company,
            companyId: companyId,
            title: value,
            startDate: flipDateFormat(startDate),
            endDate: flipDateFormat(endDate),
            isIndefinite: isIndefinite,
            rating: rating,
        }

        updateExperience(newExperience, index)
    }

    const handleIndefiniteCheckboxChange = (e) => {
        setIsIndefinite(e.target.checked)
        setFirst(false)

        const newExperience = {
            companyName: company,
            companyId: companyId,
            title: title,
            endDate: !isIndefinite ? '2200-12-02T00:00:00.000+00:00' : '',
            startDate: flipDateFormat(startDate),
            isIndefinite: e.target.checked,
            rating: rating,
        }

        updateExperience(newExperience, index)
    }

    return (
        <>
            <div className="relative z-0 flex h-auto w-auto flex-col items-center justify-center gap-4 overflow-y-hidden rounded-lg bg-white bg-opacity-20 p-10 shadow-lg backdrop-blur-xl backdrop-filter">
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
                        <div className="flex bg-gray-200">
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
                                value={first ? endDate : ''}
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
