import { useEffect, useState, useRef } from 'react'
import Datepicker from 'tailwind-datepicker-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const options = {
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: 'Clear',
    maxDate: new Date('2030-01-01'),
    minDate: new Date('1950-01-01'),
    theme: {
        background: 'bg-gray-700',
        todayBtn: '',
        clearBtn: '',
        icons: 'bg-gray-700 text-white hover:bg-opacity-20',
        text: 'text-white hover:bg-opacity-20',
        disabledText: '',
        input: '',
        inputIcon: '',
        selected: 'bg-pipeline-blue-200 hover:bg-opacity-80',
    },
    icons: {
        // () => ReactElement | JSX.Element
        prev: () => <ArrowLeft />,
        next: () => <ArrowRight />,
    },
    datepickerClassNames: 'top-32 right-10',
    language: 'en',
    disabledDates: [],
    inputNameProp: 'date',
    inputIdProp: 'date',
    inputPlaceholderProp: 'Select Date ',
    inputDateFormatProp: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    },
}

export const DatePicker = ({ value, onChange }) => {
    const [date, setDate] = useState(value ? new Date(value) : new Date())
    const [show, setShow] = useState(false)
    const wrapperRef = useRef(null)

    const handleChange = (selectedDate) => {
        setDate(selectedDate)
        onChange(selectedDate)
    }
    const handleClose = (state) => {
        setShow(state)
    }

    useEffect(() => {
        if (value) {
            const newDate = new Date(value)
            setDate(newDate)
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setShow(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [wrapperRef])

    return (
        <div ref={wrapperRef}>
            <Datepicker
                value={date}
                options={options}
                onChange={handleChange}
                show={show}
                setShow={handleClose}
            >
                <input
                    type="text"
                    className="z-20 w-full rounded-2xl bg-gray-100/60 px-4 py-2 text-black outline-none placeholder:text-gray-950/30"
                    placeholder="Select Date"
                    value={
                        date
                            ? date.toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                              })
                            : ''
                    }
                    onFocus={() => setShow(true)}
                    readOnly
                />
            </Datepicker>
        </div>
    )
}
