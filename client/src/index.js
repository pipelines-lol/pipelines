import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// context
import { AuthContextProvider } from './context/AuthContext'
import { AdminContextProvider } from './context/AdminContext'
import { EarlyAccessContextProvider } from './context/EarlyAccessContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <EarlyAccessContextProvider>
            <AuthContextProvider>
                <AdminContextProvider>
                    <App />
                </AdminContextProvider>
            </AuthContextProvider>
        </EarlyAccessContextProvider>
    </React.StrictMode>
)
