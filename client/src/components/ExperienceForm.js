import { ExperienceQuerySearchInput } from './ExperienceQuerySearchInput'
import { TitleQuerySearchInput } from './TitleQuerySearchInput'
import { X } from 'lucide-react'
import BigSmiley from '../static/ratings/BigSmiley.png'
import smiley from '../static/ratings/smiley.png'
import neutral from '../static/ratings/neutral.png'
import frown from '../static/ratings/frown.png'
import demon from '../static/ratings/demon.png'
import useValidateExperience from '../hooks/useValidateExperience'
import { DatePicker } from './DatePicker'

export const ExperienceForm = ({
    experience,
    index,
    updateExperience,
    removeExperience,
    updateDateValidity,
}) => {
    const NULL_RATING = 0
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
    const {
        globalId,
        companyName,
        displayName,
        companyId,
        title,
        startDate,
        endDate,
        isIndefinite,
        rating,
        selectedOption,
        first,
        logo,
        setCompanyName,
        setDisplayName,
        setCompanyId,
        setTitle,
        setIsIndefinite,
        setSelectedOption,
        setRating,
        setFirst,
        setStartDate,
        setEndDate,
        setLogo,
    } = useValidateExperience(experience)

    const handleDateChange = (date, field) => {
        setFirst(true)

        if (field === 'startDate') {
            setStartDate(date)
            const newExperience = {
                tempId2: globalId, //Unique experience ID assigned in sorted order
                companyName: companyName, //Company Name of experience
                displayName: displayName, // display name for company
                companyId: companyId, //Comany Id of experience in Company
                logo: logo, // Company Logo
                title: title, //Job title
                startDate: date,
                endDate: endDate,
                isIndefinite: isIndefinite, //is there a set end date or not?
                rating: rating, // Company rating
            }

            if (new Date(endDate).getTime() < date.getTime()) {
                updateDateValidity(false, index)
            } else {
                updateDateValidity(true, index)
            }

            updateExperience(newExperience, index)
        } else if (field === 'endDate') {
            setEndDate(date)
            const newExperience = {
                tempId2: globalId,
                companyName: companyName,
                displayName: displayName,
                companyId: companyId,
                logo: logo,
                title: title,
                startDate: startDate,
                endDate: date,
                isIndefinite: isIndefinite,
                rating: rating,
            }

            if (new Date(date).getTime() < new Date(startDate).getTime()) {
                updateDateValidity(false, index)
            } else {
                updateDateValidity(true, index)
            }

            updateExperience(newExperience, index)
        }
    }

    const handleCompanyChange = async (company) => {
        setCompanyName(company.name)
        setDisplayName(company.displayName)
        setCompanyId(company._id)
        setLogo(company.logo)

        const newExperience = {
            tempId2: globalId,
            companyName: company.name,
            displayName: company.displayName,
            companyId: company._id,
            logo: company.logo,
            title: title,
            endDate: endDate,
            startDate: startDate,
            isIndefinite: isIndefinite,
            rating: rating,
        }

        updateExperience(newExperience, index)
    }

    const handleRatingClick = (id, value) => {
        const deselected = value === rating

        if (deselected) {
            setRating(NULL_RATING)
        } else {
            setRating(value)
        }
        setSelectedOption(id)

        const newExperience = {
            tempId2: globalId,
            companyName: companyName,
            displayName: displayName,
            companyId: companyId,
            logo: logo,
            title: title,
            endDate: endDate,
            startDate: startDate,
            isIndefinite: isIndefinite,
            rating: deselected ? NULL_RATING : value,
        }

        updateExperience(newExperience, index)
    }

    const handleTitleChange = async (value) => {
        setTitle(value)

        const newExperience = {
            tempId2: globalId,
            companyName: companyName,
            displayName: displayName,
            companyId: companyId,
            logo: logo,
            title: value,
            startDate: startDate,
            endDate: endDate,
            isIndefinite: isIndefinite,
            rating: rating,
        }

        updateExperience(newExperience, index)
    }

    const handleIndefiniteCheckboxChange = (e) => {
        setIsIndefinite(e.target.checked)
        setFirst(false)

        const newExperience = {
            tempId2: globalId,
            companyName: companyName,
            displayName: displayName,
            companyId: companyId,
            logo: logo,
            title: title,
            endDate: !isIndefinite
                ? new Date('2200-12-02T00:00:00.000+00:00')
                : '',
            startDate: startDate,
            isIndefinite: e.target.checked,
            rating: rating,
        }

        updateDateValidity(true, index)

        updateExperience(newExperience, index)
    }

    const handleRemoveExperience = (index) => {
        const experienceToRemove = {
            tempId2: globalId,
            companyName: companyName,
            displayName: displayName,
            companyId: companyId,
            isIndefinite: isIndefinite,
            title: title,
            rating: rating,
            endDate: endDate,
            startDate: startDate,
        }

        removeExperience(experienceToRemove, index)
    }

    return (
        <>
            <div className="relative z-0 flex h-auto w-auto flex-col items-center justify-center gap-4 overflow-y-hidden rounded-lg bg-white bg-opacity-20 p-10 shadow-lg backdrop-blur-xl backdrop-filter">
                <button
                    className="self-start"
                    onClick={() => handleRemoveExperience(index)}
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
                        value={experience}
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
                    <div className="flex gap-4">
                        {options.map(({ id, value, img }) => (
                            <button
                                key={id}
                                onClick={() => handleRatingClick(id, value)}
                                className={`px-2 py-2 ${
                                    selectedOption === id
                                        ? 'rounded-full bg-blue-500 bg-opacity-50 text-white'
                                        : 'bg-opacity-0 text-black'
                                } cursor-pointer rounded-full transition duration-300 ease-in-out hover:bg-blue-500 hover:bg-opacity-50 hover:text-white`}
                            >
                                <img
                                    className="h-[30px] w-[30px]"
                                    src={img}
                                    alt="rating"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                    <label className="text-light text-pipelines-gray-100">
                        Start date
                    </label>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <DatePicker
                            value={startDate}
                            onChange={(date) =>
                                handleDateChange(date, 'startDate')
                            }
                        />

                        {!isIndefinite ? (
                            <>
                                <label className="text-light text-pipelines-gray-100">
                                    End date
                                </label>
                                <DatePicker
                                    value={first ? endDate : null}
                                    onChange={(date) =>
                                        handleDateChange(date, 'endDate')
                                    }
                                />
                            </>
                        ) : (
                            <div></div>
                        )}
                        <div className="flex flex-row items-center md:flex-col">
                            <label className="medium ml-2 pr-2 text-white">
                                Current
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
