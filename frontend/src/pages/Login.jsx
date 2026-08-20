import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, UserCheck, Building2, GraduationCap } from 'lucide-react';

export default function Login() {
  const [authTab, setAuthTab] = useState('candidate'); // 'candidate' or 'employer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser, loginCandidate, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authTab === 'candidate') {
      const res = await loginCandidate(email, password);
      if (res.success) {
        switchRole('candidate');
        navigate('/apply');
      } else {
        setError(res.message || 'Invalid candidate login credentials');
      }
    } else {
      const res = await loginUser(email, password);
      if (res.success) {
        if (email.includes('admin@platform.com')) {
          switchRole('super_admin');
          navigate('/superadmin');
        } else {
          switchRole('company_admin');
          navigate('/company');
        }
      } else {
        setError(res.message || 'Invalid email or password');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => { setAuthTab('candidate'); setError(''); }}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            authTab === 'candidate' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Candidate Login
        </button>

        <button
          type="button"
          onClick={() => { setAuthTab('employer'); setError(''); }}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            authTab === 'employer' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Recruiter / HR
        </button>
      </div>

      <div className="text-center space-y-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
          authTab === 'candidate' ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-teal-500/20' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-purple-500/20'
        }`}>
          {authTab === 'candidate' ? <GraduationCap className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          {authTab === 'candidate' ? 'Candidate Portal Sign In' : 'Recruiter & HR Sign In'}
        </h2>
        <p className="text-xs text-slate-400">
          {authTab === 'candidate' 
            ? 'Access all open job positions, track applications & join interview links' 
            : 'Access Super Admin or Company HR Dashboard'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            {authTab === 'candidate' ? 'Student / Candidate Email' : 'Work Email Address'}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              placeholder={authTab === 'candidate' ? "candidate@university.edu" : "hr@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
            authTab === 'candidate' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-teal-500/20' : 'gradient-btn text-white'
          }`}
        >
          {authTab === 'candidate' ? 'Sign In to Candidate Portal' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="border-t border-slate-800 pt-4 flex flex-col gap-2.5 text-center text-xs text-slate-400">
        <div>
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Create Candidate or Company Account
          </Link>
        </div>
        <div>
          System Administrator?{' '}
          <Link to="/superadmin/login" className="text-purple-400 font-semibold hover:underline">
            Access Super Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
