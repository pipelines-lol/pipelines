import { Routes, Route } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

import { useAdminContext } from '../../hooks/useAdminContext'

import { error404 } from '../../components/Error404'

const Admin = () => {
    const { admin } = useAdminContext()

    return (
        <Routes>
            <Route path="/" element={<AdminLogin />} />
            {
                <Route
                    path="dashboard"
                    element={
                        admin ? (
                            <AdminDashboard />
                        ) : (
                            error404(
                                'You do not have permission to view this page.'
                            )
                        )
                    }
                />
                // Add more admin routes here
            }
        </Routes>
    )
}

export default Admin
