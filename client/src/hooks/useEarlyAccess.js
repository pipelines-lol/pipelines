import { EarlyAccessContext } from '../context/EarlyAccessContext'
import { useContext } from 'react'

export const useEarlyAccess = () => {
    const context = useContext(EarlyAccessContext)

    if (!context) {
        throw Error(
            'useEarlyAccessContext must be used inside an EarlyAccessContextProvider'
        )
    }

    return context
}
