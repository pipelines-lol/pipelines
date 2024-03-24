import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// context
import { AuthContextProvider } from './context/AuthContext'
import { EarlyAccessContextProvider } from './context/EarlyAccessContext'
import { AdminContextProvider } from './context/AdminContext'

// store contexts here
const contextProviders = [
    EarlyAccessContextProvider,
    AuthContextProvider,
    AdminContextProvider,
]

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        {contextProviders.reduceRight(
            (acc, Provider) => {
                return <Provider>{acc}</Provider>
            },
            <App />
        )}
    </React.StrictMode>
)
