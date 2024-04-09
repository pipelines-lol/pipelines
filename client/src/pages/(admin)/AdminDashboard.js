import { useState } from 'react'

// dashboards
import { CompanyPage } from './pages/CompanyDashboard'
import { EmailPage } from './pages/EmailDashboard'

function AdminDashboard() {
    const [page, setPage] = useState('company')

    return (
        <div
            className="flex min-h-screen flex-row bg-gray-100"
            style={{
                backgroundImage: 'url("/hero.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                borderTop: '1px solid rgba(2, 101, 172, 0.3)',
            }}
        >
            {/* Sidenav */}
            <div className="flex min-h-full w-full flex-col bg-gray-800 text-white sm:w-1/5">
                <div className="px-5 py-10">
                    <h1 className="text-lg font-bold">Admin Dashboard</h1>
                </div>
                <ul className="flex flex-col items-start gap-2 px-5">
                    <button onClick={() => setPage('company')}>
                        <li>Companies</li>
                    </button>
                    <button onClick={() => setPage('email')}>
                        <li>Emails</li>
                    </button>
                    {/* Add more navigation links here */}
                </ul>
            </div>

            {/* Main Dashboard Content */}
            <div
                className="flex-1 flex-col items-center justify-center bg-gray-100 p-10"
                style={{
                    borderBottom: '1px solid rgba(2, 101, 172, 0.2)',
                    borderTop: '1px solid rgba(2, 101, 172, 0.3)',
                }}
            >
                {page === 'company' ? (
                    <CompanyPage />
                ) : page === 'email' ? (
                    <EmailPage />
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
