import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CandidateWidget from './pages/candidate/CandidateWidget';
import CandidateEmbedPopup from './pages/candidate/CandidateEmbedPopup';
import CompanyCareerPortal from './pages/candidate/CompanyCareerPortal';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';
import { ShieldCheck } from 'lucide-react';

// Guard component: Blocks Company Admins and unauthenticated users from accessing Super Admin page
function ProtectedSuperAdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = user?.role === 'super_admin' || user?.email === 'admin@platform.com';

  if (!isSuperAdmin) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
}

export default function App() {
  const { user, activeRole, switchRole } = useContext(AuthContext);
  const location = useLocation();

  const isDashboardPage = location.pathname === '/company' || location.pathname === '/superadmin';

  if (isDashboardPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
        <Routes>
          <Route path="/superadmin" element={
            <ProtectedSuperAdminRoute>
              <SuperAdminDashboard />
            </ProtectedSuperAdminRoute>
          } />
          <Route path="/company" element={<CompanyDashboard />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route path="/widget" element={<CandidateWidget />} />
          <Route path="/widget-embed" element={<CandidateEmbedPopup />} />
          <Route path="/apply" element={<CompanyCareerPortal />} />
          <Route path="/apply/:companySlug" element={<CompanyCareerPortal />} />
          <Route path="/apply/:companySlug/job/:jobId" element={<CompanyCareerPortal />} />
          <Route path="/apply/job/:jobId" element={<CompanyCareerPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ResuMatch AI Platform. All rights reserved. Built with ReactJS & Node.js MERN Stack.</p>
          <div className="flex items-center gap-4">
            <Link to="/company" onClick={() => switchRole('company_admin')} className="hover:text-slate-300 transition-colors">
              Company Admin
            </Link>
            <Link to="/widget" onClick={() => switchRole('candidate')} className="hover:text-slate-300 transition-colors">
              Candidate Widget
            </Link>
            <Link to="/superadmin/login" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

