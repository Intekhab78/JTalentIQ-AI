import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Sign In to Platform</h2>
        <p className="text-xs text-slate-400">Access Super Admin or Company Admin portal</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              placeholder="name@company.com"
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

        <button type="submit" className="w-full gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
          Sign In <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="border-t border-slate-800 pt-4 flex flex-col gap-2 text-center text-xs text-slate-400">
        <div>
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register Organization
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
