import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, FileText, Users, Calendar, Award, Code, Search, Filter, Sparkles, 
  CheckCircle2, AlertCircle, Plus, Copy, Check, Download, Mail, Phone,
  ChevronRight, ChevronLeft, ExternalLink, Clock, UserCheck, Building2, RefreshCw, Cpu, Trash2, Globe,
  BarChart3, Settings, ShieldCheck, Key, LogOut, Bell, Sliders, Briefcase, Play, ArrowUpRight, Palette,
  MoreVertical, CheckSquare, Square, Link2, Share2
} from 'lucide-react';

export default function CompanyDashboard() {
  const { user, logout, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Layout & Theme State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState('mint'); // 'mint' (Image 1 style), 'navy' (Image 2 style), 'slate'
  const [activeTab, setActiveTab] = useState('overview');

  // Metrics State
  const [metrics, setMetrics] = useState({
    totalJobs: 4,
    activeJobs: 3,
    totalCandidates: 14,
    scheduledInterviews: 4,
    avgMatchScore: 86,
    resumesScreenedThisMonth: 423,
    monthlyLimit: 1000
  });

  // Company Details & URL State
  const [companyDetails, setCompanyDetails] = useState({
    name: user?.company?.name || 'Nexus Software Systems',
    slug: user?.company?.slug || 'nexus-software-systems',
    apiKey: user?.company?.apiKey || 'sk_live_nexus_998877665544332211'
  });

  // Candidates State with Submission Sources
  const [candidates, setCandidates] = useState([
    {
      _id: 'cand_1',
      name: 'David Miller',
      email: 'david.m@example.com',
      phone: '+1 555-0192',
      matchScore: 92,
      atsCompatibilityScore: 95,
      job: { title: 'Senior MERN Stack Engineer' },
      matchingSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
      missingSkills: ['AWS'],
      strengths: ['Exceptional alignment with core MERN stack', 'Clean ATS resume formatting', '5+ years experience'],
      weaknesses: ['Missing AWS cloud deployment certification'],
      suggestions: ['Add AWS Certified Developer badge if applicable'],
      interviewStatus: 'Scheduled',
      submissionSource: 'company_portal',
      sourceUrl: 'http://localhost:5173/apply/nexus-software-systems',
      appliedAt: '2026-08-04'
    },
    {
      _id: 'cand_2',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      phone: '+1 555-0144',
      matchScore: 78,
      atsCompatibilityScore: 88,
      job: { title: 'Senior MERN Stack Engineer' },
      matchingSkills: ['React', 'Node.js', 'MongoDB'],
      missingSkills: ['TypeScript', 'Express'],
      strengths: ['Strong React frontend background with state management proficiency'],
      weaknesses: ['Lacks TypeScript and cloud infrastructure experience'],
      suggestions: ['Highlight experience with typed JavaScript'],
      interviewStatus: 'Screened',
      submissionSource: 'embedded_widget',
      sourceUrl: 'http://localhost:5173/widget-embed',
      appliedAt: '2026-08-03'
    },
    {
      _id: 'cand_3',
      name: 'Marcus Vance',
      email: 'marcus.v@example.com',
      phone: '+1 555-0188',
      matchScore: 89,
      atsCompatibilityScore: 90,
      job: { title: 'AI / Machine Learning Engineer' },
      matchingSkills: ['Python', 'PyTorch', 'NLP', 'REST API', 'Docker'],
      missingSkills: ['TensorFlow'],
      strengths: ['Published NLP papers & strong Python data science background'],
      weaknesses: ['Minor skill gap in TensorFlow'],
      suggestions: ['Mention transferability of PyTorch neural models'],
      interviewStatus: 'Selected',
      submissionSource: 'company_portal',
      sourceUrl: 'http://localhost:5173/apply/nexus-software-systems',
      appliedAt: '2026-08-02'
    },
    {
      _id: 'cand_4',
      name: 'Sarah Connor',
      email: 'sarah.c@example.com',
      phone: '+1 555-0199',
      matchScore: 94,
      atsCompatibilityScore: 97,
      job: { title: 'Full Stack Tech Lead' },
      matchingSkills: ['React', 'Node.js', 'System Architecture', 'AWS', 'GraphQL'],
      missingSkills: [],
      strengths: ['10+ years tech leadership', 'Scalable microservices architect'],
      weaknesses: ['None identified'],
      suggestions: ['Prepare senior system design discussion questions'],
      interviewStatus: 'Scheduled',
      submissionSource: 'direct_website',
      sourceUrl: 'http://localhost:5173/',
      appliedAt: '2026-08-05'
    }
  ]);

  // Jobs State
  const [jobs, setJobs] = useState([
    { _id: 'j1', title: 'Senior MERN Stack Engineer', department: 'Engineering', location: 'Remote', description: 'Seeking an experienced Senior MERN Stack Engineer to lead full-stack web application development with React, Node.js, Express, and MongoDB.', requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB'], applicantCount: 8, status: 'active' },
    { _id: 'j2', title: 'AI / Machine Learning Engineer', department: 'AI Research', location: 'New York, NY', description: 'Build LLM pipelines, PyTorch NLP models, and automated resume screening algorithms.', requiredSkills: ['Python', 'PyTorch', 'NLP'], applicantCount: 6, status: 'active' },
    { _id: 'j3', title: 'Full Stack Tech Lead', department: 'Product Tech', location: 'Hybrid / San Francisco', description: 'Drive tech architecture, build cloud microservices, and lead engineering teams on AWS.', requiredSkills: ['React', 'Node.js', 'AWS', 'System Design'], applicantCount: 4, status: 'active' }
  ]);

  // Team Members State
  const [teamMembers, setTeamMembers] = useState([
    { _id: 'tm_1', name: user?.name || 'John Doe', email: user?.email || 'admin@company.com', role: 'Company Admin', status: 'Active' },
    { _id: 'tm_2', name: 'Sarah Jenkins', email: 'sarah.j@company.com', role: 'Senior Recruiter', status: 'Active' },
    { _id: 'tm_3', name: 'Alex Rivera', email: 'alex.r@company.com', role: 'Hiring Manager', status: 'Active' }
  ]);

  // Selection & UI Filters
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Copy Feedback
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [companyUrlCopied, setCompanyUrlCopied] = useState(false);
  const [copiedJobId, setCopiedJobId] = useState(null);

  // Modals
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', department: 'Engineering', location: 'Remote', description: '', requiredSkills: '' });

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ candidateId: '', interviewStatus: 'Scheduled', scheduledDate: '', interviewerName: '', meetingLink: '', notes: '', sendEmail: true });
  const [schedulingSending, setSchedulingSending] = useState(false);
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState('');

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', email: '', role: 'recruiter' });

  // Resume Viewer Modal State
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [viewingResumeCandidate, setViewingResumeCandidate] = useState(null);
  const [resumeBlobUrl, setResumeBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isPdfValid, setIsPdfValid] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!viewingResumeCandidate) {
      setResumeBlobUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    setPdfLoading(true);
    const prepareBlobUrl = async () => {
      try {
        let blob = null;
        let mimeType = viewingResumeCandidate.resumeMimeType || 'application/pdf';
        let validPdf = false;

        if (viewingResumeCandidate.resumeData && viewingResumeCandidate.resumeData.startsWith('data:')) {
          const parts = viewingResumeCandidate.resumeData.split(',');
          const bstr = atob(parts[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          blob = new Blob([u8arr], { type: 'application/pdf' });
          validPdf = true;
        } else if (viewingResumeCandidate._id && !viewingResumeCandidate._id.startsWith('cand_')) {
          const res = await api.get(`/candidates/${viewingResumeCandidate._id}/download-resume?inline=true`, { responseType: 'blob' });
          blob = new Blob([res.data], { type: 'application/pdf' });
          validPdf = true;
        }

        if (!blob && viewingResumeCandidate.parsedText) {
          blob = new Blob([viewingResumeCandidate.parsedText], { type: 'text/plain;charset=utf-8' });
          validPdf = false;
        }

        if (isMounted) {
          setIsPdfValid(validPdf);
          if (blob) {
            const newUrl = URL.createObjectURL(blob);
            setResumeBlobUrl(prev => {
              if (prev) URL.revokeObjectURL(prev);
              return newUrl;
            });
          }
        }
      } catch (err) {
        console.warn('Resume Blob error:', err.message);
        if (isMounted) setIsPdfValid(false);
      } finally {
        if (isMounted) setPdfLoading(false);
      }
    };

    prepareBlobUrl();
    return () => { isMounted = false; };
  }, [viewingResumeCandidate]);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const dashRes = await api.get('/company/dashboard');
      if (dashRes.data.metrics) setMetrics(dashRes.data.metrics);
      if (dashRes.data.company) {
        setCompanyDetails({
          name: dashRes.data.company.name,
          slug: dashRes.data.company.slug || dashRes.data.company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          apiKey: dashRes.data.company.apiKey
        });
      }
      if (Array.isArray(dashRes.data.recentCandidates)) setCandidates(dashRes.data.recentCandidates);

      const jobRes = await api.get('/jobs');
      if (Array.isArray(jobRes.data)) setJobs(jobRes.data);

      const candRes = await api.get('/candidates');
      if (Array.isArray(candRes.data)) setCandidates(candRes.data);
    } catch (err) {
      console.warn('Company live API sync note:', err.message);
    }
  };

  const apiKey = companyDetails.apiKey || 'sk_live_nexus_998877665544332211';
  const companySlug = companyDetails.slug || 'nexus-software-systems';
  const companyCareerUrl = `${window.location.origin}/apply/${companySlug}`;
  const embedSnippet = `<script src="${window.location.origin}/widget.js" data-api-key="${apiKey}"></script>`;

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const copyEmbedSnippet = () => {
    navigator.clipboard.writeText(embedSnippet);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const copyCompanyCareerUrl = () => {
    navigator.clipboard.writeText(companyCareerUrl);
    setCompanyUrlCopied(true);
    setTimeout(() => setCompanyUrlCopied(false), 2000);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/jobs', jobForm);
      setJobs([res.data, ...jobs]);
      setJobModalOpen(false);
      setJobForm({ title: '', department: 'Engineering', location: 'Remote', description: '', requiredSkills: '' });
    } catch (err) {
      const newJob = {
        _id: 'j_' + Date.now(),
        title: jobForm.title,
        department: jobForm.department,
        location: jobForm.location,
        description: jobForm.description,
        requiredSkills: typeof jobForm.requiredSkills === 'string' ? jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : jobForm.requiredSkills,
        applicantCount: 0,
        status: 'active'
      };
      setJobs([newJob, ...jobs]);
      setJobModalOpen(false);
      setJobForm({ title: '', department: 'Engineering', location: 'Remote', description: '', requiredSkills: '' });
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    setSchedulingSending(true);
    setScheduleSuccessMsg('');
    try {
      let res;
      try {
        if (scheduleForm.candidateId && !scheduleForm.candidateId.startsWith('cand_')) {
          res = await api.put(`/candidates/${scheduleForm.candidateId}/status`, scheduleForm);
        } else {
          res = await api.post('/candidates/schedule-interview', scheduleForm);
        }
      } catch (innerErr) {
        res = await api.post('/candidates/schedule-interview', scheduleForm);
      }

      setCandidates(prev => prev.map(c => {
        if (c._id === scheduleForm.candidateId) {
          return {
            ...c,
            interviewStatus: scheduleForm.interviewStatus,
            interviewDetails: {
              scheduledDate: scheduleForm.scheduledDate,
              interviewerName: scheduleForm.interviewerName,
              meetingLink: scheduleForm.meetingLink,
              notes: scheduleForm.notes
            }
          };
        }
        return c;
      }));

      setScheduleSuccessMsg(res.data?.message || 'Interview scheduled & notification processed!');
      setTimeout(() => {
        setScheduleModalOpen(false);
        setSchedulingSending(false);
        setScheduleSuccessMsg('');
      }, 1600);
    } catch (err) {
      setCandidates(prev => prev.map(c => {
        if (c._id === scheduleForm.candidateId) {
          return {
            ...c,
            interviewStatus: scheduleForm.interviewStatus,
            interviewDetails: {
              scheduledDate: scheduleForm.scheduledDate,
              interviewerName: scheduleForm.interviewerName,
              meetingLink: scheduleForm.meetingLink,
              notes: scheduleForm.notes
            }
          };
        }
        return c;
      }));
      setScheduleSuccessMsg(`Interview updated to ${scheduleForm.interviewStatus}!`);
      setTimeout(() => {
        setScheduleModalOpen(false);
        setSchedulingSending(false);
        setScheduleSuccessMsg('');
      }, 1400);
    }
  };

  const handleDownloadResume = async (cand) => {
    if (!cand) return;
    if (cand._id && !cand._id.startsWith('cand_')) {
      try {
        const response = await api.get(`/candidates/${cand._id}/download-resume`, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = cand.resumeOriginalName || `${cand.name.replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      } catch (err) {
        console.warn('Backend download fallback:', err.message);
      }
    }
    const textContent = cand.parsedText || `${cand.name}\n\nEmail: ${cand.email}\nPhone: ${cand.phone}\n\nResume Details:\n${cand.parsedText || ''}`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cand.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleAddTeamMember = (e) => {
    e.preventDefault();
    const newMember = {
      _id: 'tm_' + Date.now(),
      name: teamForm.name,
      email: teamForm.email,
      role: teamForm.role === 'admin' ? 'Company Admin' : teamForm.role === 'recruiter' ? 'Senior Recruiter' : 'Hiring Manager',
      status: 'Active'
    };
    setTeamMembers([...teamMembers, newMember]);
    setTeamModalOpen(false);
    setTeamForm({ name: '', email: '', role: 'recruiter' });
  };

  // Filtered Candidates
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (cand.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesScore = true;
    if (scoreFilter === 'high') matchesScore = cand.matchScore >= 85;
    else if (scoreFilter === 'medium') matchesScore = cand.matchScore >= 70 && cand.matchScore < 85;
    else if (scoreFilter === 'low') matchesScore = cand.matchScore < 70;

    let matchesStatus = true;
    if (statusFilter !== 'all') matchesStatus = cand.interviewStatus === statusFilter;

    let matchesSource = true;
    if (sourceFilter !== 'all') matchesSource = cand.submissionSource === sourceFilter;

    return matchesSearch && matchesScore && matchesStatus && matchesSource;
  });

  const toggleSelectCandidate = (id) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c._id));
    }
  };

  // Export CSV Action
  const handleExportCSV = () => {
    const headers = 'Name,Email,Phone,Position,Match Score,ATS Score,Status,Submission Source,Source URL,Applied Date\n';
    const rows = filteredCandidates.map(c => 
      `"${c.name}","${c.email}","${c.phone}","${c.job?.title || 'Engineer'}",${c.matchScore},${c.atsCompatibilityScore},"${c.interviewStatus}","${c.submissionSource || 'company_portal'}","${c.sourceUrl || ''}","${c.appliedAt}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Candidates_Report_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper function to render submission source badge
  const renderSourceBadge = (source) => {
    if (source === 'embedded_widget') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-600 border border-teal-500/30 flex items-center gap-1">
          ⚡ Embedded Widget
        </span>
      );
    }
    if (source === 'direct_website') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-600 border border-purple-500/30 flex items-center gap-1">
          🌐 Direct Website
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-600 border border-indigo-500/30 flex items-center gap-1">
        🏢 Company Portal
      </span>
    );
  };

  // Dynamic Theme Classes
  const getThemeWrapperClass = () => {
    if (themeMode === 'mint') return 'bg-[#f4fbf7] text-[#064e3b]';
    if (themeMode === 'navy') return 'bg-[#060b17] text-[#f8fafc]';
    return 'bg-[#090d16] text-[#f1f5f9]';
  };

  const getSidebarClass = () => {
    if (themeMode === 'mint') return 'bg-[#e6f7ef] border-[#c3f0d8] text-[#164e63]';
    if (themeMode === 'navy') return 'bg-[#091122] border-[#1e293b] text-[#94a3b8]';
    return 'bg-[#0f172a] border-[#1e293b] text-[#94a3b8]';
  };

  const getSidebarActivePill = () => {
    if (themeMode === 'mint') return 'bg-[#10b981] text-white shadow-md shadow-emerald-500/20';
    if (themeMode === 'navy') return 'bg-[#0284c7] text-white shadow-md shadow-sky-500/20';
    return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md';
  };

  const getCardBg = () => {
    if (themeMode === 'mint') return 'bg-white border-[#d1fae5] shadow-sm';
    if (themeMode === 'navy') return 'bg-[#0f172a] border-[#1e293b] shadow-xl';
    return 'bg-[#0f172a]/90 border-[#1e293b] shadow-xl';
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${getThemeWrapperClass()}`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`sticky top-0 h-screen transition-all duration-300 border-r flex flex-col justify-between z-40 ${getSidebarClass()} ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div>
          {/* Sidebar Header / Brand */}
          <div className="p-4 flex items-center justify-between border-b border-emerald-500/10">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className="font-extrabold text-base tracking-tight leading-none text-emerald-900 dark:text-white">
                    ResuMatch <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono ml-1">PRO</span>
                  </h2>
                  <p className="text-[11px] opacity-70 mt-1">Company Admin</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4 opacity-70" />
              </button>
            )}
          </div>

          {sidebarCollapsed && (
            <button 
              onClick={() => setSidebarCollapsed(false)}
              className="w-full py-2 flex justify-center hover:bg-emerald-500/10 transition-colors border-b border-emerald-500/10"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          )}

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'pipeline', label: 'Candidates Pipeline', icon: Users, badge: candidates.length },
              { id: 'jobs', label: 'Job Postings', icon: Briefcase, badge: jobs.length },
              { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
              { id: 'widget', label: 'Widget & API Keys', icon: Code },
              { id: 'team', label: 'Team & Permissions', icon: ShieldCheck },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive ? getSidebarActivePill() : 'hover:bg-emerald-500/10 opacity-80 hover:opacity-100'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Theme Toggle */}
        <div className="p-3 border-t border-emerald-500/10 space-y-2">
          {!sidebarCollapsed && (
            <div className="px-2 py-1 flex items-center justify-between text-xs opacity-70">
              <span className="flex items-center gap-1 font-semibold">
                <Palette className="w-3.5 h-3.5 text-emerald-500" /> Theme Accent
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setThemeMode('mint')} 
                  className={`w-4 h-4 rounded-full bg-emerald-500 border ${themeMode === 'mint' ? 'ring-2 ring-emerald-400' : ''}`}
                  title="Mint Light Theme"
                />
                <button 
                  onClick={() => setThemeMode('navy')} 
                  className={`w-4 h-4 rounded-full bg-sky-600 border ${themeMode === 'navy' ? 'ring-2 ring-sky-400' : ''}`}
                  title="Navy Dark Theme"
                />
                <button 
                  onClick={() => setThemeMode('slate')} 
                  className={`w-4 h-4 rounded-full bg-indigo-600 border ${themeMode === 'slate' ? 'ring-2 ring-indigo-400' : ''}`}
                  title="Slate Cyber Theme"
                />
              </div>
            </div>
          )}

          {/* User Profile Info Card */}
          <div className={`p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between ${sidebarCollapsed ? 'flex-col gap-2' : ''}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {user?.name ? user.name.charAt(0) : 'N'}
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate leading-tight">{user?.name || 'Nexus Admin'}</p>
                  <p className="text-[10px] opacity-70 truncate">{user?.email || 'admin@nexus.com'}</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-30 px-6 py-4 border-b backdrop-blur-md border-emerald-500/10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              Admin Panel
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {companyDetails.name}
              </span>
            </h1>
            <p className="text-xs opacity-70 mt-0.5">
              Welcome back, <span className="font-semibold">{user?.name || 'Nexus Admin'}</span> 👋 — How's your recruitment pipeline today?
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
              <input
                type="text"
                placeholder="Search candidates, skills, jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-emerald-500/20 bg-emerald-500/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Quick Post Job Button */}
            <button
              onClick={() => setJobModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Post Job
            </button>

            {/* Copy Dedicated Company Career URL */}
            <button
              onClick={copyCompanyCareerUrl}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 flex items-center gap-1.5 transition-all"
              title="Copy your company's unique candidate portal URL"
            >
              {companyUrlCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5 text-indigo-500" />}
              {companyUrlCopied ? 'URL Copied!' : 'Copy Company URL'}
            </button>

            {/* Notifications Button */}
            <button className="p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 relative transition-colors">
              <Bell className="w-4 h-4 opacity-80" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT VIEWS */}
        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto animate-fade-in">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* WELCOME BANNER */}
              <div className={`p-6 rounded-2xl border relative overflow-hidden ${getCardBg()}`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold flex items-center gap-2">
                      Welcome back, {user?.name || 'Nexus Admin'} 👋
                    </h2>
                    <p className="text-sm opacity-70 mt-1">
                      Here is what's happening with your company's resume screening & recruitment pipeline today.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-emerald-500/30 hover:bg-emerald-500/10 flex items-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4 text-emerald-500" /> Export Candidates CSV
                    </button>
                    <button
                      onClick={() => setActiveTab('pipeline')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      View All Candidates <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* STAT METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border flex items-center justify-between ${getCardBg()}`}>
                  <div>
                    <p className="text-xs font-medium opacity-70">Resumes Screened</p>
                    <h3 className="text-3xl font-extrabold mt-1">{metrics.resumesScreenedThisMonth}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> +18.4%
                      </span>
                      <span className="text-[11px] opacity-60">vs last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex items-center justify-between ${getCardBg()}`}>
                  <div>
                    <p className="text-xs font-medium opacity-70">Active Candidates</p>
                    <h3 className="text-3xl font-extrabold mt-1">{metrics.totalCandidates}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                        1243 Total
                      </span>
                      <span className="text-[11px] opacity-60">in talent pool</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex items-center justify-between ${getCardBg()}`}>
                  <div>
                    <p className="text-xs font-medium opacity-70">Scheduled Interviews</p>
                    <h3 className="text-3xl font-extrabold mt-1">{metrics.scheduledInterviews}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                        356 Active
                      </span>
                      <span className="text-[11px] opacity-60">this week</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex items-center justify-between ${getCardBg()}`}>
                  <div>
                    <p className="text-xs font-medium opacity-70">Avg ATS Match Rate</p>
                    <h3 className="text-3xl font-extrabold mt-1">{metrics.avgMatchScore}%</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                        High Fit
                      </span>
                      <span className="text-[11px] opacity-60">AI Verified</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS SECTION */}
              <div className={`p-5 rounded-2xl border ${getCardBg()}`}>
                <h3 className="text-sm font-extrabold tracking-wide uppercase opacity-80 flex items-center gap-2 mb-4">
                  <ChevronRight className="w-4 h-4 text-emerald-500" /> Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <button 
                    onClick={copyCompanyCareerUrl}
                    className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 flex items-center gap-3 transition-all text-left"
                  >
                    <span className="text-xl">🏢</span>
                    <div>
                      <p className="text-xs font-bold">{companyUrlCopied ? 'URL Copied!' : 'Copy Company URL'}</p>
                      <p className="text-[10px] opacity-70">Share link with candidates</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setJobModalOpen(true)}
                    className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 flex items-center gap-3 transition-all text-left"
                  >
                    <span className="text-xl">💼</span>
                    <div>
                      <p className="text-xs font-bold">Post New Job</p>
                      <p className="text-[10px] opacity-70">Create ATS listing</p>
                    </div>
                  </button>

                  <button 
                    onClick={copyApiKey}
                    className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 flex items-center gap-3 transition-all text-left"
                  >
                    <span className="text-xl">🔑</span>
                    <div>
                      <p className="text-xs font-bold">{apiKeyCopied ? 'Key Copied!' : 'Copy API Key'}</p>
                      <p className="text-[10px] opacity-70">Instant integration</p>
                    </div>
                  </button>

                  <button 
                    onClick={copyEmbedSnippet}
                    className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 flex items-center gap-3 transition-all text-left"
                  >
                    <span className="text-xl">⚡</span>
                    <div>
                      <p className="text-xs font-bold">{embedCopied ? 'Code Copied!' : 'Embed Candidate Widget'}</p>
                      <p className="text-[10px] opacity-70">Copy JS Popup snippet</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* RECENT CANDIDATES DATA GRID */}
              <div className={`rounded-2xl border overflow-hidden ${getCardBg()}`}>
                <div className="p-4 border-b border-emerald-500/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base">Recent Screened Applicants</h3>
                    <p className="text-xs opacity-70">Live AI resume matches & candidate submission sources</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('pipeline')}
                    className="text-xs font-bold text-emerald-500 hover:underline"
                  >
                    View All ({candidates.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-emerald-500/5 uppercase font-bold text-[10px] opacity-80 border-b border-emerald-500/10">
                      <tr>
                        <th className="p-3 w-10">
                          <button onClick={toggleSelectAll}>
                            {selectedCandidates.length === filteredCandidates.length ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4 opacity-50" />
                            )}
                          </button>
                        </th>
                        <th className="p-3">Candidate</th>
                        <th className="p-3">Position</th>
                        <th className="p-3">Match Score</th>
                        <th className="p-3">Submission Source</th>
                        <th className="p-3">Interview Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/10">
                      {filteredCandidates.slice(0, 5).map((cand) => (
                        <tr key={cand._id} className="hover:bg-emerald-500/5 transition-colors">
                          <td className="p-3">
                            <button onClick={() => toggleSelectCandidate(cand._id)}>
                              {selectedCandidates.includes(cand._id) ? (
                                <CheckSquare className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Square className="w-4 h-4 opacity-40" />
                              )}
                            </button>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-sm">{cand.name}</p>
                            <p className="text-[10px] opacity-70">{cand.email}</p>
                          </td>
                          <td className="p-3 font-medium">
                            {cand.job?.title || 'Senior MERN Stack Engineer'}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              cand.matchScore >= 85 ? 'bg-emerald-500/20 text-emerald-600' :
                              cand.matchScore >= 70 ? 'bg-amber-500/20 text-amber-600' :
                              'bg-red-500/20 text-red-600'
                            }`}>
                              {cand.matchScore}% Match
                            </span>
                          </td>
                          <td className="p-3">
                            {renderSourceBadge(cand.submissionSource)}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              {cand.interviewStatus || 'Screened'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => { setViewingResumeCandidate(cand); setResumeModalOpen(true); }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-500 transition-all shadow-sm"
                            >
                              View Resume
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANDIDATE PIPELINE MANAGER */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Candidate Talent Pipeline</h2>
                  <p className="text-xs opacity-70">Review, filter by submission source (Company URL vs Direct), and schedule interviews.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-500/30 hover:bg-emerald-500/10 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-500" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${getCardBg()}`}>
                <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 opacity-50" />
                  <input
                    type="text"
                    placeholder="Filter candidate by name, skills, job..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {/* Submission Source Filter */}
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="opacity-70 font-medium">Source:</span>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1 focus:outline-none font-medium"
                    >
                      <option value="all">All Sources</option>
                      <option value="company_portal">🏢 Company Portal URL</option>
                      <option value="embedded_widget">⚡ Embedded Widget</option>
                      <option value="direct_website">🌐 Direct Website</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 opacity-60" />
                    <span className="opacity-70 font-medium">Match:</span>
                    <select
                      value={scoreFilter}
                      onChange={(e) => setScoreFilter(e.target.value)}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="all">All Scores</option>
                      <option value="high">High Match (85%+)</option>
                      <option value="medium">Medium (70-84%)</option>
                      <option value="low">Needs Review (&lt;70%)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Candidates Pipeline Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.map((cand) => (
                  <div key={cand._id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:-translate-y-1 ${getCardBg()}`}>
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-extrabold text-base">{cand.name}</h3>
                          <p className="text-xs opacity-70">{cand.job?.title || 'Software Engineer'}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                          cand.matchScore >= 85 ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30' :
                          cand.matchScore >= 70 ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30' :
                          'bg-red-500/20 text-red-600 border border-red-500/30'
                        }`}>
                          {cand.matchScore}% Match
                        </span>
                      </div>

                      {/* Source Badge */}
                      <div className="mt-2.5">
                        {renderSourceBadge(cand.submissionSource)}
                      </div>

                      {/* Matching Skills Badges */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {cand.matchingSkills?.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {cand.interviewDetails?.scheduledDate && (
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] space-y-1">
                        <p className="font-bold text-emerald-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Scheduled: {new Date(cand.interviewDetails.scheduledDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                        {cand.interviewDetails.meetingLink && (
                          <a href={cand.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[10px] truncate">
                            <ExternalLink className="w-3 h-3 shrink-0 text-sky-400" /> {cand.interviewDetails.meetingLink}
                          </a>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-emerald-500/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => { setViewingResumeCandidate(cand); setResumeModalOpen(true); }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-all flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Resume
                      </button>

                      <button
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          tomorrow.setHours(10, 0, 0, 0);
                          const defaultDt = tomorrow.toISOString().slice(0, 16);

                          setScheduleForm({
                            candidateId: cand._id,
                            candidateName: cand.name,
                            candidateEmail: cand.email,
                            interviewStatus: cand.interviewStatus || 'Scheduled',
                            scheduledDate: cand.interviewDetails?.scheduledDate ? new Date(cand.interviewDetails.scheduledDate).toISOString().slice(0, 16) : defaultDt,
                            interviewerName: cand.interviewDetails?.interviewerName || user?.name || 'Hiring Manager',
                            meetingLink: cand.interviewDetails?.meetingLink || 'https://meet.google.com/abc-defg-hij',
                            notes: cand.interviewDetails?.notes || 'Technical interview round. Please ensure video and audio connection.',
                            sendEmail: true
                          });
                          setScheduleModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-emerald-500/30 font-semibold text-xs hover:bg-emerald-500/10 transition-colors flex items-center gap-1 text-emerald-400"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JOB POSTINGS */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Active Job Listings</h2>
                  <p className="text-xs opacity-70">Manage job postings and AI candidate scoring parameters.</p>
                </div>
                <button
                  onClick={() => setJobModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create New Job Listing
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <div key={job._id} className={`p-5 rounded-2xl border flex flex-col justify-between ${getCardBg()}`}>
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-base">{job.title}</h3>
                          <p className="text-xs opacity-70">{job.department} • {job.location}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 uppercase">
                          {job.status || 'Active'}
                        </span>
                      </div>

                      {job.description && (
                        <div className="mt-2 text-xs opacity-75 line-clamp-2 leading-relaxed">
                          {job.description}
                        </div>
                      )}

                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-semibold opacity-80">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {job.requiredSkills?.map((sk, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Direct Job Application Link */}
                      <div className="mt-4 pt-3 border-t border-emerald-500/10 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold opacity-75">Direct Apply Link:</span>
                          {copiedJobId === job._id && (
                            <span className="text-emerald-500 font-bold animate-pulse flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/apply/${companySlug}/job/${job._id}`}
                            className="flex-1 bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 font-mono select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const directUrl = `${window.location.origin}/apply/${companySlug}/job/${job._id}`;
                              navigator.clipboard.writeText(directUrl);
                              setCopiedJobId(job._id);
                              setTimeout(() => setCopiedJobId(null), 2000);
                            }}
                            title="Copy Direct Link"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 transition-colors flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </button>
                          <a
                            href={`/apply/${companySlug}/job/${job._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open Direct Apply Page"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-emerald-500/10 flex items-center justify-between text-xs">
                      <span className="font-bold">{job.applicantCount || 0} Applicants</span>
                      <button 
                        onClick={() => setActiveTab('pipeline')}
                        className="text-emerald-500 hover:underline font-semibold"
                      >
                        View Candidates →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS & REPORTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Screening Analytics & AI Intelligence</h2>
                  <p className="text-xs opacity-70">Deep breakdown of candidate match rates and submission sources.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${getCardBg()}`}>
                  <h3 className="font-bold text-sm mb-4">Candidate Submission Source Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span>🏢 Dedicated Company Portal URL</span>
                        <span className="text-indigo-500 font-bold">64%</span>
                      </div>
                      <div className="w-full bg-indigo-500/10 h-3 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '64%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span>⚡ Embedded Website Widget</span>
                        <span className="text-teal-500 font-bold">22%</span>
                      </div>
                      <div className="w-full bg-teal-500/10 h-3 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full" style={{ width: '22%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span>🌐 Direct ResuMatch Platform</span>
                        <span className="text-purple-500 font-bold">14%</span>
                      </div>
                      <div className="w-full bg-purple-500/10 h-3 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '14%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border ${getCardBg()}`}>
                  <h3 className="font-bold text-sm mb-4">Monthly Resume Quota Usage</h3>
                  <div className="flex items-center justify-center p-4">
                    <div className="text-center">
                      <h4 className="text-4xl font-extrabold text-emerald-500">
                        {metrics.resumesScreenedThisMonth} / {metrics.monthlyLimit}
                      </h4>
                      <p className="text-xs opacity-70 mt-1">Resumes screened this billing cycle</p>
                      <div className="w-48 bg-emerald-500/10 h-2.5 rounded-full mx-auto mt-4 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${(metrics.resumesScreenedThisMonth / metrics.monthlyLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WIDGET & API KEYS (As featured in screenshot) */}
          {activeTab === 'widget' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Company Career Link & API Integration</h2>
                <p className="text-xs opacity-70">Share your dedicated company URL with candidates or embed the JS widget on your website.</p>
              </div>

              {/* 1. DEDICATED COMPANY CAREER PORTAL URL CARD */}
              <div className={`p-6 rounded-2xl border space-y-4 ${getCardBg()}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2 text-indigo-500">
                      <Link2 className="w-5 h-5 text-indigo-500" /> Your Dedicated Company Career Portal URL
                    </h3>
                    <p className="text-xs opacity-70 mt-1">
                      Give this URL directly to candidates. Every resume uploaded here is automatically tagged as <strong className="text-indigo-400">Company Portal</strong> in MongoDB.
                    </p>
                  </div>
                  <a
                    href={companyCareerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-500/10 flex items-center gap-1 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Test Career Link
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={companyCareerUrl}
                    className="flex-1 px-4 py-2.5 text-xs font-mono rounded-xl bg-indigo-500/5 border border-indigo-500/20 focus:outline-none text-indigo-700 dark:text-indigo-300 font-bold"
                  />
                  <button
                    onClick={copyCompanyCareerUrl}
                    className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    {companyUrlCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {companyUrlCopied ? 'URL Copied!' : 'Copy Company URL'}
                  </button>
                </div>
              </div>

              {/* 2. PRODUCTION API KEY CARD */}
              <div className={`p-6 rounded-2xl border space-y-4 ${getCardBg()}`}>
                <h3 className="font-bold text-sm">Your Production API Key</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 px-4 py-2 text-xs font-mono rounded-xl bg-emerald-500/5 border border-emerald-500/20 focus:outline-none"
                  />
                  <button
                    onClick={copyApiKey}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1.5"
                  >
                    {apiKeyCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {apiKeyCopied ? 'Copied' : 'Copy Key'}
                  </button>
                </div>
              </div>

              {/* 3. EMBED CODE SNIPPET CARD */}
              <div className={`p-6 rounded-2xl border space-y-4 ${getCardBg()}`}>
                <h3 className="font-bold text-sm">Embed Code Snippet</h3>
                <pre className="p-4 text-xs font-mono rounded-xl bg-slate-900 text-emerald-400 overflow-x-auto border border-slate-800">
                  {embedSnippet}
                </pre>
                <button
                  onClick={copyEmbedSnippet}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-emerald-500/30 hover:bg-emerald-500/10 flex items-center gap-1.5"
                >
                  {embedCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {embedCopied ? 'Snippet Copied' : 'Copy JS Snippet'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: TEAM & PERMISSIONS */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Team Members & Access Roles</h2>
                  <p className="text-xs opacity-70">Manage user access permissions for your company dashboard.</p>
                </div>
                <button
                  onClick={() => setTeamModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Team Member
                </button>
              </div>

              <div className={`rounded-2xl border overflow-hidden ${getCardBg()}`}>
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-500/5 uppercase font-bold text-[10px] border-b border-emerald-500/10">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10">
                    {teamMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-emerald-500/5">
                        <td className="p-3 font-bold">
                          {member.name}
                          <p className="text-[10px] font-normal opacity-70">{member.email}</p>
                        </td>
                        <td className="p-3 font-medium">{member.role}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600">
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Company & AI Screening Settings</h2>
                <p className="text-xs opacity-70">Configure ATS matching parameters and AI threshold rules.</p>
              </div>

              <div className={`p-6 rounded-2xl border space-y-4 max-w-xl ${getCardBg()}`}>
                <h3 className="font-bold text-sm">Minimum Match Threshold for Interview Tagging</h3>
                <div>
                  <label className="text-xs opacity-70">Auto-Select Threshold Score: 85%</label>
                  <input type="range" min="50" max="95" defaultValue="85" className="w-full accent-emerald-500 mt-2" />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* CREATE JOB MODAL */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-slate-100 space-y-4">
            <h3 className="text-lg font-bold">Create New Job Listing</h3>
            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-medium">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior MERN Stack Engineer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Department</label>
                <input
                  type="text"
                  placeholder="Engineering"
                  value={jobForm.department}
                  onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <input
                  type="text"
                  placeholder="Remote / New York, NY"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Job Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the job duties, qualifications, and responsibilities..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express, MongoDB"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" /> Schedule Interview & Send Email
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select interview date, time, meeting link, and send email invitation.</p>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white text-base font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Target Candidate Preview Banner */}
            {(() => {
              const cand = candidates.find(c => c._id === scheduleForm.candidateId);
              if (!cand) return null;
              return (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-emerald-400 text-sm">{cand.name}</p>
                    <p className="text-[11px] text-slate-300 opacity-90">{cand.email} • {cand.job?.title || 'Engineer'}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    Match: {cand.matchScore}%
                  </span>
                </div>
              );
            })()}

            <form onSubmit={handleScheduleInterview} className="space-y-3.5 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-slate-300">Interview Status</label>
                <select
                  value={scheduleForm.interviewStatus}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, interviewStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white font-medium"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Screened">Screened</option>
                  <option value="Selected">Selected / Hired</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleForm.scheduledDate || ''}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-slate-300">Interviewer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins (Senior Lead)"
                    value={scheduleForm.interviewerName || ''}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-300">Meeting Link (Google Meet / Zoom / Teams)</label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={scheduleForm.meetingLink || ''}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-300">Instructions / Notes for Candidate</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Technical live coding round. Please ensure video and microphone are working."
                  value={scheduleForm.notes || ''}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleForm.sendEmail !== false}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, sendEmail: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" /> Send automated email invitation to candidate email
                  </span>
                </label>
              </div>

              {scheduleSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> {scheduleSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  disabled={schedulingSending}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schedulingSending}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  {schedulingSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Sending Email...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" /> Schedule & Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESUME VIEWER MODAL */}
      {resumeModalOpen && viewingResumeCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] flex flex-col text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold">{viewingResumeCandidate.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {renderSourceBadge(viewingResumeCandidate.submissionSource)}
                  <span className="text-[10px] text-slate-400">Applied: {viewingResumeCandidate.appliedAt?.slice(0,10)}</span>
                </div>
              </div>
              <button
                onClick={() => setResumeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400">AI Strengths & Skills Match</h4>
                <div className="flex flex-wrap gap-1">
                  {viewingResumeCandidate.matchingSkills?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {resumeBlobUrl && isPdfValid ? (
                <iframe
                  src={resumeBlobUrl}
                  title="Candidate Resume"
                  className="w-full h-96 rounded-xl border border-slate-800"
                />
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono whitespace-pre-wrap">
                  {viewingResumeCandidate.parsedText || 'No text extracted from resume file.'}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDownloadResume(viewingResumeCandidate)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 flex items-center gap-1.5 text-xs"
              >
                <Download className="w-4 h-4" /> Download Resume
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
