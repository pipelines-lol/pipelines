import { AdminContext } from '../context/AdminContext'
import { useContext } from 'react'

export const useAdminContext = () => {
    const context = useContext(AdminContext)

    if (!context) {
        throw Error(
            'useAdminContext must be used inside an AdminContextProvider'
        )
    }

    return context
}
