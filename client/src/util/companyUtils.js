import { companies } from '../data/companyData'

// capitalizes the title of a company
// lower case name -> display name
export function capitalizeCompanyTitle(str) {
    // shoutout bobdagoat
    if (typeof str !== 'string' || str.trim() === '') {
        // bad input
        return str
    }

    const formattedCompany = companies.find(
        (company) => company.name.toLowerCase() === str.toLowerCase()
    )

    if (formattedCompany) {
        return formattedCompany.name
    }

    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
