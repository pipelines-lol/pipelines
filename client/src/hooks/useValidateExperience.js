import { useState, useEffect } from 'react'

const useValidateExperience = (experience) => {
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isIndefinite, setIsIndefinite] = useState(false)
    const [rating, setRating] = useState(0)
    const [selectedOption, setSelectedOption] = useState(1)
    const [companyId, setCompanyId] = useState('')
    const [first, setFirst] = useState(true)
    const [globalId, setId] = useState(0)

    // initialize experience if one exists
    useEffect(() => {
        if (experience) {
            setCompany(experience.companyName)
            setTitle(experience.title)
            setCompanyId(experience.companyId)
            setRating(experience.rating)
            setSelectedOption(experience.rating / 20)
            setIsIndefinite(experience.isIndefinite)

            if (experience.id) {
                setId(experience.id)
            } else {
                setId(0)
            }

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

    return {
        globalId,
        company,
        companyId,
        title,
        startDate,
        endDate,
        isIndefinite,
        rating,
        selectedOption,
        first,
        setCompany,
        setCompanyId,
        setTitle,
        setIsIndefinite,
        setSelectedOption,
        setRating,
        setFirst,
        setStartDate,
        setEndDate,
        setId,
    }
}

export default useValidateExperience
