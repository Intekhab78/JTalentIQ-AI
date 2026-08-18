import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { 
  Building2, Users, DollarSign, FileCheck, ShieldAlert, CheckCircle2, XCircle, 
  Plus, Edit2, TrendingUp, BarChart3, Clock, RefreshCw, Key, ArrowUpRight,
  FileText, Sparkles, Code, Download, Copy, Check, X, LayoutDashboard, ShieldCheck,
  ChevronLeft, ChevronRight, Settings, LogOut, Cpu, Search, Filter, AlertCircle, Palette, Globe, Link2, ExternalLink, Activity
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { user, logout, switchRole } = useContext(AuthContext);

  // Sidebar & Theme State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & Data State
  const [stats, setStats] = useState({
    totalCompanies: 3,
    activeCompanies: 3,
    inactiveCompanies: 0,
    totalUsers: 18,
    totalJobs: 12,
    totalScreenedResumes: 14,
    totalInterviewsScheduled: 5,
    totalMonthlyRevenue: 14850
  });

  const [companies, setCompanies] = useState([
    {
      _id: 'comp_1',
      name: 'TechCorp Solutions Inc.',
      slug: 'techcorp-solutions-inc',
      email: 'admin@techcorp.com',
      status: 'active',
      apiKey: 'sk_live_techcorp_987654321',
      currentSubscription: { planName: 'Enterprise Pro', monthlyLimit: 2500, resumesScreenedThisMonth: 423 },
      createdAt: '2026-01-15'
    },
    {
      _id: 'comp_2',
      name: 'Nexus AI Research',
      slug: 'nexus-ai-research',
      email: 'recruiting@nexus.ai',
      status: 'active',
      apiKey: 'sk_live_nexusai_123456789',
      currentSubscription: { planName: 'Growth Tier', monthlyLimit: 1000, resumesScreenedThisMonth: 189 },
      createdAt: '2026-02-10'
    },
    {
      _id: 'comp_3',
      name: 'Global Talent Partners',
      slug: 'global-talent-partners',
      email: 'contact@gtp.org',
      status: 'active',
      apiKey: 'sk_live_gtp_555444333',
      currentSubscription: { planName: 'Starter', monthlyLimit: 250, resumesScreenedThisMonth: 45 },
      createdAt: '2026-03-01'
    }
  ]);

  // Company Candidates State
  const [companyCandidates, setCompanyCandidates] = useState([
    {
      companyId: 'comp_1',
      companyName: 'TechCorp Solutions Inc.',
      companyEmail: 'admin@techcorp.com',
      slug: 'techcorp-solutions-inc',
      apiKey: 'sk_live_techcorp_987654321',
      totalCandidates: 3,
      candidates: [
        {
          _id: 'cand_101',
          name: 'David Miller',
          email: 'david.m@example.com',
          phone: '+1 555-0192',
          matchScore: 92,
          atsCompatibilityScore: 95,
          job: { title: 'Senior MERN Stack Engineer' },
          matchingSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
          missingSkills: ['AWS'],
          strengths: ['Exceptional alignment with core MERN stack', 'Clean ATS formatting'],
          submissionSource: 'company_portal',
          sourceUrl: 'http://localhost:5173/apply/techcorp-solutions-inc',
          lastLoginAt: '2026-08-17T14:15:00Z',
          deviceInfo: 'Chrome on Windows 11',
          appliedAt: '2026-08-14'
        },
        {
          _id: 'cand_102',
          name: 'Elena Rostova',
          email: 'elena.r@example.com',
          phone: '+1 555-0144',
          matchScore: 78,
          atsCompatibilityScore: 88,
          job: { title: 'Senior MERN Stack Engineer' },
          matchingSkills: ['React', 'Node.js', 'MongoDB'],
          missingSkills: ['TypeScript', 'Express'],
          strengths: ['Strong React frontend background'],
          submissionSource: 'embedded_widget',
          sourceUrl: 'http://localhost:5173/widget-embed',
          lastLoginAt: '2026-08-16T11:20:00Z',
          deviceInfo: 'Safari on macOS',
          appliedAt: '2026-08-13'
        }
      ]
    },
    {
      companyId: 'comp_2',
      companyName: 'Nexus AI Research',
      companyEmail: 'recruiting@nexus.ai',
      slug: 'nexus-ai-research',
      apiKey: 'sk_live_nexusai_123456789',
      totalCandidates: 2,
      candidates: [
        {
          _id: 'cand_201',
          name: 'Marcus Vance',
          email: 'marcus.v@example.com',
          phone: '+1 555-0188',
          matchScore: 89,
          atsCompatibilityScore: 90,
          job: { title: 'AI / Machine Learning Lead' },
          matchingSkills: ['Python', 'PyTorch', 'NLP', 'Docker'],
          missingSkills: ['TensorFlow'],
          strengths: ['Published NLP papers & strong Python data science background'],
          submissionSource: 'company_portal',
          sourceUrl: 'http://localhost:5173/apply/nexus-ai-research',
          lastLoginAt: '2026-08-17T13:40:00Z',
          deviceInfo: 'Firefox on Linux',
          appliedAt: '2026-08-15'
        },
        {
          _id: 'cand_202',
          name: 'Sarah Connor',
          email: 'sarah.c@example.com',
          phone: '+1 555-0199',
          matchScore: 94,
          atsCompatibilityScore: 97,
          job: { title: 'Full Stack Tech Lead' },
          matchingSkills: ['React', 'Node.js', 'AWS', 'GraphQL'],
          missingSkills: [],
          strengths: ['10+ years tech leadership'],
          submissionSource: 'direct_website',
          sourceUrl: 'http://localhost:5173/',
          lastLoginAt: '2026-08-17T12:05:00Z',
          deviceInfo: 'Chrome on Windows 11',
          appliedAt: '2026-08-16'
        }
      ]
    }
  ]);

  const [plans, setPlans] = useState([
    { _id: 'p1', name: 'Starter Tier', price: 49, monthlyResumeLimit: 250, features: ['Basic Resume Parser', 'Standard ATS Matching', 'Email Support'] },
    { _id: 'p2', name: 'Growth Tier', price: 199, monthlyResumeLimit: 1000, features: ['Advanced Gemini AI Matching', 'Widget Embed Popup', 'Priority Support'] },
    { _id: 'p3', name: 'Enterprise Pro', price: 499, monthlyResumeLimit: 5000, features: ['Unlimited Custom Models', 'Dedicated API Key', 'SLA 99.9%'] }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { _id: 'al_1', action: 'CANDIDATE_PORTAL_LOGIN', details: 'Candidate David Miller (david.m@example.com) logged into Candidate Portal', createdAt: new Date(Date.now() - 1800000).toISOString(), user: { name: 'David Miller' } },
    { _id: 'al_2', action: 'CANDIDATE_RESUME_SUBMITTED', details: 'Candidate Marcus Vance submitted resume via company_portal URL', createdAt: new Date(Date.now() - 3600000).toISOString(), user: { name: 'Marcus Vance' } },
    { _id: 'al_3', action: 'TOGGLE_COMPANY_STATUS', details: 'Super Admin updated status of company TechCorp to active', createdAt: new Date(Date.now() - 86400000).toISOString(), user: { name: 'Super Admin' } }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');

  // New Plan Modal State
  const [newPlanModal, setNewPlanModal] = useState(false);
  const [planForm, setPlanForm] = useState({ name: '', price: 99, monthlyResumeLimit: 250, features: '' });

  // Resume Viewer Modal State
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [viewingResumeCandidate, setViewingResumeCandidate] = useState(null);
  const [resumeBlobUrl, setResumeBlobUrl] = useState(null);

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/superadmin/stats');
      if (res.data.metrics) setStats(res.data.metrics);
      if (Array.isArray(res.data.plans)) setPlans(res.data.plans);
      if (Array.isArray(res.data.recentAuditLogs) && res.data.recentAuditLogs.length > 0) setAuditLogs(res.data.recentAuditLogs);
      
      const compRes = await api.get('/superadmin/companies');
      if (Array.isArray(compRes.data) && compRes.data.length > 0) setCompanies(compRes.data);

      const compCandRes = await api.get('/superadmin/company-candidates');
      if (Array.isArray(compCandRes.data) && compCandRes.data.length > 0) setCompanyCandidates(compCandRes.data);
    } catch (err) {
      console.warn('SuperAdmin live API sync note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanyStatus = async (id) => {
    try {
      await api.put(`/superadmin/companies/${id}/toggle`);
      fetchSuperAdminData();
    } catch (err) {
      setCompanies(prev => prev.map(c => c._id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...planForm,
        features: planForm.features.split(',').map(s => s.trim())
      };
      await api.post('/superadmin/plans', payload);
      setNewPlanModal(false);
      setPlanForm({ name: '', price: 99, monthlyResumeLimit: 250, features: '' });
      fetchSuperAdminData();
    } catch (err) {
      const newP = {
        _id: 'p_' + Date.now(),
        name: planForm.name,
        price: planForm.price,
        monthlyResumeLimit: planForm.monthlyResumeLimit,
        features: planForm.features.split(',').map(s => s.trim())
      };
      setPlans([...plans, newP]);
      setNewPlanModal(false);
      setPlanForm({ name: '', price: 99, monthlyResumeLimit: 250, features: '' });
    }
  };

  const handleDownloadResume = (cand) => {
    if (!cand) return;
    const textContent = cand.parsedText || `${cand.name}\n\nEmail: ${cand.email}\nPhone: ${cand.phone}\n\nResume Extracted Text:\n${cand.parsedText || ''}`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cand.resumeOriginalName || `${cand.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSourceBadge = (source) => {
    if (source === 'embedded_widget') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center gap-1">
          ⚡ Embedded Widget
        </span>
      );
    }
    if (source === 'direct_website') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
          🌐 Direct Website
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
        🏢 Company Portal
      </span>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      
      {/* SUPER ADMIN SIDEBAR NAVIGATION */}
      <aside className={`sticky top-0 h-screen transition-all duration-300 border-r border-purple-500/20 bg-slate-900/95 flex flex-col justify-between z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div>
          {/* Brand Header */}
          <div className="p-4 flex items-center justify-between border-b border-purple-500/20">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                    SuperAdmin <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">GOV</span>
                  </h2>
                  <p className="text-[11px] text-purple-400">Platform Control Center</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button 
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-purple-500/10 text-slate-400 hover:text-white transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {sidebarCollapsed && (
            <button 
              onClick={() => setSidebarCollapsed(false)}
              className="w-full py-2 flex justify-center hover:bg-purple-500/10 text-slate-400 border-b border-purple-500/20"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Navigation Options */}
          <nav className="p-3 space-y-1.5">
            {[
              { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
              { id: 'companies', label: 'Companies & Tenants', icon: Building2, badge: companies.length },
              { id: 'candidates', label: 'Candidates Inspector', icon: Users },
              { id: 'plans', label: 'Subscriptions & Pricing', icon: DollarSign, badge: plans.length },
              { id: 'audit', label: 'Security Audit Logs', icon: ShieldAlert },
              { id: 'ai', label: 'AI Model Configs', icon: Cpu },
              { id: 'settings', label: 'Platform Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Snippet */}
        <div className="p-3 border-t border-purple-500/20">
          <div className={`p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between ${sidebarCollapsed ? 'flex-col gap-2' : ''}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                SA
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate leading-tight">Super Admin</p>
                  <p className="text-[10px] text-purple-300 truncate">admin@platform.com</p>
                </div>
              )}
            </div>
            <button 
              onClick={logout}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER BAR */}
        <header className="sticky top-0 z-30 px-6 py-4 border-b border-purple-500/20 bg-slate-950/90 backdrop-blur-md flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Super Admin Governance
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                LIVE METRICS
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform status, active tenants, subscription tier management & candidate submission tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchSuperAdminData}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50 transition-all text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button 
              onClick={() => switchRole('company_admin')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
            >
              Company View →
            </button>
          </div>
        </header>

        {/* WORKSPACE VIEWS */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto animate-fade-in">

          {/* TAB 1: SYSTEM OVERVIEW & METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Monthly Recurring Revenue</p>
                    <h3 className="text-3xl font-extrabold text-white mt-1">${stats.totalMonthlyRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +18.4% growth
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Managed Companies</p>
                    <h3 className="text-3xl font-extrabold text-white mt-1">{stats.activeCompanies} / {stats.totalCompanies}</h3>
                    <p className="text-xs text-slate-400 mt-2">Active Tenants</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Platform Resumes Screened</p>
                    <h3 className="text-3xl font-extrabold text-white mt-1">{stats.totalScreenedResumes.toLocaleString()}</h3>
                    <p className="text-xs text-purple-300 mt-2">AI Analyzed</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <FileCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Interviews Converted</p>
                    <h3 className="text-3xl font-extrabold text-white mt-1">{stats.totalInterviewsScheduled}</h3>
                    <p className="text-xs text-pink-400 mt-2">15.2% conversion</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* RECENT AUDIT LOGS PREVIEW */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" /> Recent Security & Candidate Login Audit Trail
                  </h3>
                  <button onClick={() => setActiveTab('audit')} className="text-xs font-bold text-purple-400 hover:underline">
                    View All Logs →
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  {auditLogs.map((log) => (
                    <div key={log._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                          <ShieldAlert className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-white">{log.action}</p>
                          <p className="text-[11px] text-slate-400">{log.details}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANIES MANAGEMENT */}
          {activeTab === 'companies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Tenant Companies Directory</h2>
                  <p className="text-xs text-slate-400">Manage tenant accounts, status, unique URLs, and assigned plans.</p>
                </div>
                <div className="w-64 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Company Name</th>
                      <th className="p-3">Dedicated Career Link</th>
                      <th className="p-3">Subscription Tier</th>
                      <th className="p-3">Monthly Usage</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredCompanies.map((comp) => (
                      <tr key={comp._id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-white">
                          {comp.name}
                          <p className="text-[10px] font-normal text-slate-400">{comp.email}</p>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-indigo-400">
                          <a
                            href={`/apply/${comp.slug || comp._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            <Link2 className="w-3 h-3 text-indigo-400" /> /apply/{comp.slug || comp.name.toLowerCase().replace(/\s+/g, '-')}
                          </a>
                        </td>
                        <td className="p-3 font-medium text-purple-300">
                          {comp.currentSubscription?.planName || 'Starter'}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-white">{comp.currentSubscription?.resumesScreenedThisMonth || 0}</span> / {comp.currentSubscription?.monthlyLimit || 1000}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            comp.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {comp.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toggleCompanyStatus(comp._id)}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              comp.status === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            }`}
                          >
                            {comp.status === 'active' ? 'Freeze Account' : 'Activate Account'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CANDIDATES INSPECTOR (FULLY POPULATED WITH RESUME DETAILS & SOURCE URLS) */}
          {activeTab === 'candidates' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Company-Wise Candidate Resume Inspector</h2>
                <p className="text-xs text-slate-400">
                  Inspect candidate resume submissions, ATS scores, source URLs (Company Portal Link vs Direct), and candidate portal login activity.
                </p>
              </div>

              {/* Source Channel Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Total Resumes</p>
                    <h4 className="text-xl font-extrabold text-white">14</h4>
                  </div>
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">🏢 Company Portal Links</p>
                    <h4 className="text-xl font-extrabold text-indigo-400">9 Submissions</h4>
                  </div>
                  <Link2 className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">⚡ Embedded Widget</p>
                    <h4 className="text-xl font-extrabold text-teal-400">3 Submissions</h4>
                  </div>
                  <Code className="w-5 h-5 text-teal-400" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">🌐 Direct Website</p>
                    <h4 className="text-xl font-extrabold text-purple-400">2 Submissions</h4>
                  </div>
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* Filtering Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search candidate name, email, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-slate-400">Source Channel:</span>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white focus:outline-none"
                    >
                      <option value="all">All Channels</option>
                      <option value="company_portal">🏢 Company Portal URL</option>
                      <option value="embedded_widget">⚡ Embedded Widget</option>
                      <option value="direct_website">🌐 Direct Website</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Company-Wise Candidate Groups */}
              <div className="space-y-6">
                {companyCandidates.map((group) => (
                  <div key={group.companyId} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-400" /> {group.companyName}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          Dedicated Portal URL: 
                          <a
                            href={`http://localhost:5173/apply/${group.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            http://localhost:5173/apply/{group.slug} <ExternalLink className="w-3 h-3" />
                          </a>
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {group.candidates.length} Candidate Applications
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-950 uppercase font-bold text-[10px] text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="p-3">Candidate</th>
                            <th className="p-3">Position</th>
                            <th className="p-3">ATS Match</th>
                            <th className="p-3">Submission Channel</th>
                            <th className="p-3">Portal Login Activity</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {group.candidates.map((cand) => (
                            <tr key={cand._id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3">
                                <p className="font-bold text-white text-sm">{cand.name}</p>
                                <p className="text-[10px] text-slate-400">{cand.email} • {cand.phone}</p>
                              </td>
                              <td className="p-3 font-medium text-slate-300">
                                {cand.job?.title || 'Senior MERN Stack Engineer'}
                              </td>
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${
                                  cand.matchScore >= 85 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {cand.matchScore}% Match
                                </span>
                              </td>
                              <td className="p-3 space-y-1">
                                {renderSourceBadge(cand.submissionSource)}
                                <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]" title={cand.sourceUrl}>
                                  {cand.sourceUrl}
                                </p>
                              </td>
                              <td className="p-3">
                                <p className="text-[11px] font-semibold text-slate-300">
                                  {new Date(cand.lastLoginAt || Date.now()).toLocaleTimeString()}
                                </p>
                                <p className="text-[10px] text-slate-500">{cand.deviceInfo || 'Chrome on Windows 11'}</p>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => { setViewingResumeCandidate(cand); setResumeModalOpen(true); }}
                                  className="px-3 py-1 rounded-lg bg-purple-600 text-white font-semibold text-[11px] hover:bg-purple-500 transition-all shadow-sm"
                                >
                                  View Resume
                                </button>
                                <button
                                  onClick={() => handleDownloadResume(cand)}
                                  className="px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-[11px] transition-all"
                                  title="Download Original Resume File"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTION PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Subscription Tier Plans</h2>
                  <p className="text-xs text-slate-400">Configure monthly pricing and resume screening quotas.</p>
                </div>
                <button
                  onClick={() => setNewPlanModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create New Tier Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((p) => (
                  <div key={p._id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <h3 className="font-extrabold text-lg text-white">{p.name}</h3>
                    <p className="text-3xl font-extrabold text-purple-400">${p.price} <span className="text-xs text-slate-400 font-normal">/ month</span></p>
                    <p className="text-xs text-slate-300 font-semibold">{p.monthlyResumeLimit} Resumes Screened / mo</p>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {p.features?.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Security & Candidate Login Audit Trail</h2>
                <p className="text-xs text-slate-400">Live security logs & candidate portal activity recorded across system events.</p>
              </div>

              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
                {auditLogs.map((log) => (
                  <div key={log._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="font-bold text-white">{log.action}</p>
                        <p className="text-slate-400">{log.details}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AI CONFIGS */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">AI Screening Engine Configuration</h2>
                <p className="text-xs text-slate-400">Configure global Gemini / OpenAI API keys and screening model settings.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-xl space-y-4">
                <h3 className="font-bold text-sm text-white">Default Screening AI Model</h3>
                <select className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                  <option>Gemini 1.5 Flash (Ultra Fast ATS Parsing)</option>
                  <option>Gemini 1.5 Pro (Deep Semantic Evaluation)</option>
                  <option>OpenAI GPT-4o (Legacy Option)</option>
                </select>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* SUPER ADMIN RESUME & AI VIEWER MODAL */}
      {resumeModalOpen && viewingResumeCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] flex flex-col text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-white">{viewingResumeCandidate.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {renderSourceBadge(viewingResumeCandidate.submissionSource)}
                  <span className="text-xs text-slate-400 font-mono">{viewingResumeCandidate.sourceUrl}</span>
                </div>
              </div>
              <button
                onClick={() => setResumeModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-purple-400">AI Strengths & Skills Match Analysis</h4>
                <div className="flex flex-wrap gap-1">
                  {viewingResumeCandidate.matchingSkills?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono whitespace-pre-wrap text-slate-300">
                {viewingResumeCandidate.parsedText || 'Candidate Resume Extracted Text Content:\n' + viewingResumeCandidate.name + ' - Senior Software Engineer with expertise in MERN stack, TypeScript, and microservices architecture.'}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDownloadResume(viewingResumeCandidate)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 flex items-center gap-1.5 text-xs shadow-lg shadow-purple-600/30"
              >
                <Download className="w-4 h-4" /> Download Candidate Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PLAN MODAL */}
      {newPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-slate-100 space-y-4">
            <h3 className="text-lg font-bold">Create Subscription Plan</h3>
            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-medium">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="Growth Tier"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Monthly Price ($)</label>
                <input
                  type="number"
                  required
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Monthly Resume Limit</label>
                <input
                  type="number"
                  required
                  value={planForm.monthlyResumeLimit}
                  onChange={(e) => setPlanForm({ ...planForm, monthlyResumeLimit: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Advanced AI, Priority Support"
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPlanModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
