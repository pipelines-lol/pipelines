import { useEffect, useState } from 'react'
import { HOST } from '../../../util/apiRoutes'
import { fetchWithAuth } from '../../../util/fetchUtils'

export const CompanyPage = () => {
    const [companies, setCompanies] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalCompanyInfo, setModalCompanyInfo] = useState({})

    // Function to fetch companies based on the search term
    const fetchCompanies = async (query) => {
        let url = `${HOST}/api/company/get/companies`

        // Append query to the URL if it's not empty
        if (query) {
            url += `/${query}`
        }

        try {
            // Use fetchWithAuth instead of fetch
            const data = await fetchWithAuth({
                url: url,
                method: 'GET', // Assuming it's a GET request
            })

            // Update state with fetched companies
            setCompanies(data)
        } catch (error) {
            console.error('Failed to fetch companies:', error)
            // Handle errors or set state accordingly
        }
    }

    // useEffect to fetch companies in database
    useEffect(() => {
        fetchCompanies('')
    }, [])

    // Handler for deleting a company
    const handleDelete = async (company) => {
        const { name, displayName } = company

        // Confirm before deleting
        if (
            window.confirm(
                `Are you sure you want to delete the company: "${displayName}"?`
            )
        ) {
            try {
                // Use fetchWithAuth instead of fetch
                await fetchWithAuth({
                    url: `${HOST}/api/company/delete/${name}`,
                    method: 'DELETE',
                })

                // Remove the company from the local state to update the UI
                setCompanies(
                    companies.filter((company) => company.name !== name)
                )
            } catch (error) {
                console.error('Error deleting company:', error)
                // Handle errors
            }
        }
    }

    // Handler for editing a company
    const handleEdit = async (company) => {
        setIsModalOpen(true)
        setModalCompanyInfo(company)
    }

    // Handler for search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault() // Prevent form submission from reloading the page
        fetchCompanies(searchQuery) // Fetch companies based on the search term
    }

    return (
        <div className="flex flex-col items-center gap-5 space-y-8 overflow-hidden rounded-2xl border-2 border-transparent px-4 py-12 text-pipelines-gray-100 md:px-8">
            <h2 className="text-2xl font-medium text-black">
                Company Dashboard
            </h2>

            {/* Search form */}
            <form
                onSubmit={handleSearchSubmit}
                className="flex w-full max-w-sm space-x-3"
            >
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="focus:shadow-outline flex-1 appearance-none rounded border bg-white px-4 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                />
                <button
                    type="submit"
                    className="focus:shadow-outline rounded border-blue-500 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                >
                    Search
                </button>
            </form>

            {/* Main Company table */}
            <div className="w-full overflow-x-auto md:overflow-visible">
                <table className="min-w-full text-left text-sm text-gray-500">
                    <thead className="sticky bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Display Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Logo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Rating
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tenure
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>

                    {/* Scrollable tbody */}
                    <tbody
                        className="divide-y divide-gray-200 overflow-y-auto"
                        style={{ maxHeight: 'calc(100% - 40px)' }}
                    >
                        {/* Add company row */}
                        <tr className="bg-white">
                            <td colSpan="8" className="px-6 py-4 text-right">
                                {/* Adjust colSpan based on the number of columns */}
                                <button
                                    type="button"
                                    className="rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Add
                                </button>
                            </td>
                        </tr>

                        <CompanyModal
                            isOpen={isModalOpen}
                            onClose={() => {
                                setIsModalOpen(false)
                                setModalCompanyInfo({})

                                fetchCompanies()
                            }}
                            companyData={modalCompanyInfo}
                        />

                        {/* Existing company rows */}
                        {companies.map((company) => (
                            <tr key={company._id} className="bg-white">
                                <td className="px-6 py-4">{company.name}</td>
                                <td className="px-6 py-4">
                                    {company.displayName}
                                </td>
                                <td className="px-6 py-4">
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} Logo`}
                                        className="h-10 w-10 object-fill"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    {company.description}
                                </td>
                                <td className="px-6 py-4">{company.rating}</td>
                                <td className="px-6 py-4">{company.tenure}</td>

                                {/* Edit Button */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEdit(company)}
                                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                                    >
                                        Edit
                                    </button>
                                </td>

                                {/* Delete Button */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(company)}
                                        className="focus:shadow-outline rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function CompanyModal({ isOpen, onClose, companyData: initialCompanyData }) {
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [logo, setLogo] = useState('')
    const [description, setDescription] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    // Reset form states when opening modal to add a new company
    // Populate for when initial company exists
    useEffect(() => {
        if (isOpen) {
            if (!initialCompanyData?._id) {
                resetForm()
            } else {
                populateForm()
            }
        }
    }, [isOpen, initialCompanyData])

    const resetForm = () => {
        setId('')
        setName('')
        setDisplayName('')
        setLogo('')
        setDescription('')
        setErrorMessage('')
    }

    const populateForm = () => {
        setId(initialCompanyData?._id)
        setName(initialCompanyData?.name)
        setDisplayName(initialCompanyData?.displayName)
        setLogo(initialCompanyData?.logo)
        setDescription(initialCompanyData?.description)
    }

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()

        const companyData = { name, displayName, logo, description }

        // Determine the endpoint and method based on the presence of an ID
        const endpoint = id
            ? `${HOST}/api/company/update/${name}`
            : `${HOST}/api/company/create`
        const method = id ? 'PATCH' : 'POST'

        try {
            const response = await fetchWithAuth({
                url: endpoint, // Assuming endpoint is defined elsewhere
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: companyData,
            })
            console.log(response)
            resetForm()
            onClose() // Close the modal upon successful operation
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}
        >
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            <div className="relative m-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h1>{id ? 'Update' : 'Add'} Company</h1>
                    <div>
                        <label className="block">Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full bg-gray-200 px-4 py-2 disabled:select-none disabled:bg-gray-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={
                                id !== null && id !== undefined && id !== ''
                            }
                        />
                    </div>
                    <div>
                        <label className="block">Display Name</label>
                        <input
                            name="displayName"
                            type="text"
                            required
                            className="w-full bg-gray-200 px-4 py-2"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block">Logo URL</label>
                        <input
                            name="logo"
                            type="url"
                            className="w-full bg-gray-200 px-4 py-2"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block">Description</label>
                        <textarea
                            name="description"
                            className="w-full bg-gray-200 px-4 py-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                    )}
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            {id ? 'Update' : 'Submit'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-gray-300 px-4 py-2 text-black"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
