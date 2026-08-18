import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuperAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    const res = await loginUser(email, password);
    if (res.success) {
      if (res.role === 'super_admin' || res.user?.role === 'super_admin' || email === 'admin@platform.com') {
        navigate('/superadmin');
      } else {
        setError('Access Denied: This portal is strictly restricted to Super Administrators. Company Admins cannot access system settings.');
      }
    } else {
      setError(res.message || 'Invalid Super Admin credentials');
    }
  };

  const fillDemoSuperAdmin = () => {
    setEmail('admin@platform.com');
    setPassword('adminpassword123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-2xl border border-purple-900/50 shadow-2xl shadow-purple-950/40 space-y-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center space-y-2 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-pink-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          SYSTEM ADMINISTRATION
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Super Admin Portal</h2>
        <p className="text-xs text-slate-400">Restricted system access. Requires master administrator credentials.</p>
      </div>

      {/* Security Warning Banner */}
      <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-300 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-purple-200">Company Admin Access Prohibited</strong>
          Company Admins are isolated to company dashboards and cannot log in here.
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSuperAdminLogin} className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Super Admin Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              placeholder="admin@platform.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Master Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          Authenticate Super Admin <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Credentials Assistant */}
      <div className="border-t border-slate-800/80 pt-4 text-center space-y-2">
        <button
          type="button"
          onClick={fillDemoSuperAdmin}
          className="w-full py-2 px-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/30 text-purple-300 text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
          Auto-fill Super Admin Credentials (admin@platform.com)
        </button>

        <div className="text-[11px] text-slate-500">
          Not a Super Admin?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Go to Company Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
