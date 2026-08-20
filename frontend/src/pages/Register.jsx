import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, Mail, Lock, User, GraduationCap, ArrowRight } from 'lucide-react';

export default function Register() {
  const [authTab, setAuthTab] = useState('candidate'); // 'candidate' or 'company'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    website: ''
  });
  const [error, setError] = useState('');
  const { registerCompany, registerCandidate, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authTab === 'candidate') {
      const res = await registerCandidate(formData.name, formData.email, formData.password);
      if (res.success) {
        switchRole('candidate');
        navigate('/apply');
      } else {
        setError(res.message || 'Candidate registration failed');
      }
    } else {
      const res = await registerCompany(formData);
      if (res.success) {
        switchRole('company_admin');
        navigate('/company');
      } else {
        setError(res.message || 'Company registration failed');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
      {/* Role Selector Tabs */}
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
          <GraduationCap className="w-4 h-4" /> Candidate Sign Up
        </button>

        <button
          type="button"
          onClick={() => { setAuthTab('company'); setError(''); }}
          className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            authTab === 'company' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> Company Sign Up
        </button>
      </div>

      <div className="text-center space-y-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
          authTab === 'candidate' ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-teal-500/20' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-purple-500/20'
        }`}>
          {authTab === 'candidate' ? <GraduationCap className="w-6 h-6 text-white" /> : <Building2 className="w-6 h-6 text-white" />}
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          {authTab === 'candidate' ? 'Create Candidate Account' : 'Register Organization'}
        </h2>
        <p className="text-xs text-slate-400">
          {authTab === 'candidate' 
            ? 'Apply for jobs, track ATS scores & join scheduled interviews' 
            : 'Get your dedicated HR dashboard & screening widget'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {authTab === 'company' && (
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization Name</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Acme Corp"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            {authTab === 'candidate' ? 'Your Full Name' : 'Contact Person Full Name'}
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            {authTab === 'candidate' ? 'Email Address' : 'Work Email Address'}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              placeholder={authTab === 'candidate' ? "student@university.edu" : "hr@company.com"}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Create Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          {authTab === 'candidate' ? 'Create Candidate Account' : 'Register Organization'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-emerald-400 font-bold hover:underline">
          Sign In to Account
        </Link>
      </div>
    </div>
  );
}
