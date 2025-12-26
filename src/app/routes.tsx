import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loader from '../components/common/Loader';

// Layouts
const PublicLayout = lazy(() => import('../layouts/PublicLayout'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

// Public Pages
const Landing = lazy(() => import('../pages/Landing'));
const PlansPage = lazy(() => import('../pages/public/PlansPage'));
const AboutPage = lazy(() => import('../pages/public/AboutPage'));

// Auth Pages
const Register = lazy(() => import('../pages/auth/Register'));

// Investor Pages
const InvestorDashboard = lazy(() => import('../pages/investor/Dashboard'));
const InvestmentPlans = lazy(() => import('../pages/investor/InvestmentPlans'));
const CompleteInvestment = lazy(() => import('../pages/investor/CompleteInvestment'));
const MyInvestments = lazy(() => import('../pages/investor/MyInvestments'));
const InvestorBonds = lazy(() => import('../pages/investor/Bonds'));
const Profile = lazy(() => import('../pages/investor/Profile'));

// Admin Pages
// Core Admin
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminOverview = lazy(() => import('../pages/admin/Overview'));
const AdminInvestors = lazy(() => import('../pages/admin/Investors'));
const AdminInvestments = lazy(() => import('../pages/admin/Investments'));
const AdminBonds = lazy(() => import('../pages/admin/Bonds'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));

const AppRoutes: React.FC = () => {
    const { user } = useAppContext();

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/plans" element={<PlansPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="register" element={<Register />} />
                </Route>


                {/* New Admin Routes (Unprotected for demo purposes as requested for development) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" />} />
                    <Route path="dashboard" element={<AdminOverview />} />
                    <Route path="investors" element={<AdminInvestors />} />
                    <Route path="investments" element={<AdminInvestments />} />
                    <Route path="bonds" element={<AdminBonds />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="notifications" element={<div style={{ padding: '24px' }}>Notifications Panel Coming Soon</div>} />
                    <Route path="payments" element={<div style={{ padding: '24px' }}>Payments Panel Coming Soon</div>} />
                </Route>

                {/* Dashboard Routes (Original) */}
                <Route
                    path="/dashboard"
                    element={user ? <DashboardLayout /> : <Navigate to="/" />}
                >
                    {user?.role === 'admin' ? (
                        <>
                            <Route index element={<Navigate to="/admin/dashboard" />} />
                            <Route path="overview" element={<AdminOverview />} />
                            <Route path="investors" element={<AdminInvestors />} />
                            <Route path="investments" element={<AdminInvestments />} />
                            <Route path="bonds" element={<AdminBonds />} />
                            <Route path="reports" element={<AdminReports />} />
                        </>
                    ) : (
                        <>
                            <Route index element={<InvestorDashboard />} />
                            <Route path="plans" element={<InvestmentPlans />} />
                            <Route path="complete-investment/:planId" element={<CompleteInvestment />} />
                            <Route path="bonds" element={<InvestorBonds />} />
                            <Route path="my-investments" element={<MyInvestments />} />
                            <Route path="profile" element={<Profile />} />
                        </>
                    )}
                </Route>

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
