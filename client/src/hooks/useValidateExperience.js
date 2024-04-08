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
    const [logo, setLogo] = useState('')

    // initialize experience if one exists
    useEffect(() => {
        if (experience) {
            console.log(experience)
            // Set basic experience details
            setCompany(experience.companyName)
            setTitle(experience.title)
            setCompanyId(experience.companyId)
            setRating(experience.rating)
            setSelectedOption(experience.rating / 20)
            setIsIndefinite(experience.isIndefinite)

            // Set ID and logo, with default values if not provided
            setId(experience.id || 0)
            setLogo(experience.logo || '')

            // Initialize startDate and endDate
            let startDate = ''
            let endDate = ''

            // Set startDate if provided
            if (experience.startDate) {
                startDate = new Date(experience.startDate)
            }

            // Set endDate if provided and not indefinite
            if (experience.endDate && !experience.isIndefinite) {
                endDate = new Date(experience.endDate)
            }

            // Update state with calculated startDate and endDate
            setStartDate(startDate)
            setEndDate(endDate)
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
        logo,
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
        setLogo,
    }
}

export default useValidateExperience
