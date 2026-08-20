import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, ShieldCheck, Building2, UserCheck, LogOut, Award, Briefcase, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const { user, activeRole, switchRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isSuperAdminUser = user?.role === 'super_admin' || user?.email === 'admin@platform.com';
  const isCandidateUser = user?.role === 'candidate';

  return (
    // http://localhost:5173/superadmin/login
    // admin@platform.com
    // adminpassword123
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              ResuMatch <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">AI PRO</span>
            </h1>
            <p className="text-xs text-slate-400">Smart Resume Screening Platform</p>
          </div>
        </Link>

        {/* Section Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <Link to="/apply" className="hover:text-indigo-300 transition-colors flex items-center gap-1.5 font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-full">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Candidate Portal
          </Link>
          <a href="/#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="/#pricing" className="hover:text-purple-400 transition-colors flex items-center gap-1">
            Pricing <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">25-60 AED</span>
          </a>
          <a href="/#contact" className="hover:text-purple-400 transition-colors">Contact Us</a>
          <Link to="/widget" className="hover:text-teal-400 transition-colors flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Candidate Widget
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={isSuperAdminUser ? "/superadmin" : isCandidateUser ? "/apply" : "/company"}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 hover:opacity-90 transition-all ${
                  isCandidateUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                }`}
              >
                {isCandidateUser ? <GraduationCap className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                {isSuperAdminUser ? 'Super Admin Portal' : isCandidateUser ? `Candidate: ${user.name || 'Portal'}` : 'Go to Dashboard'}
              </Link>
              
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="gradient-btn px-4 py-2 text-xs font-semibold rounded-xl">
                Register / Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


