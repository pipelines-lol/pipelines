import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// context
import { AuthContextProvider } from './context/AuthContext'
import { EarlyAccessContextProvider } from './context/EarlyAccessContext'
import { SessionContextProvider } from './context/SessionContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <SessionContextProvider>
            <EarlyAccessContextProvider>
                <AuthContextProvider>
                    <App />
                </AuthContextProvider>
            </EarlyAccessContextProvider>
        </SessionContextProvider>
    </React.StrictMode>
)
