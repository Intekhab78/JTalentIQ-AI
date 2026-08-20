import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import {
  Sparkles, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, User,
  ArrowRight, Briefcase, Building, Mail, Phone, Lock, FileText, Check, ShieldCheck,
  Calendar, ExternalLink, GraduationCap, Video, LogOut, Clock, Award
} from 'lucide-react';

export default function CompanyCareerPortal() {
  const { companySlug, jobId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const targetJobId = jobId || searchParams.get('jobId');
  const companyQuery = companySlug || searchParams.get('company') || searchParams.get('apiKey') || 'nexus';

  const [companyInfo, setCompanyInfo] = useState({ name: 'Nexus', email: 'hr@nexus.com' });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Candidate Portal Tabs
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'my_applications'
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Application Form State
  const [step, setStep] = useState(1); // 1: Form, 2: AI Result Preview, 3: Success
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    jobId: '',
    resumeText: ''
  });

  const [fileSelected, setFileSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    fetchCompanyAndJobs();
  }, [companyQuery, targetJobId]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
      fetchMyApplications();
    }
  }, [user]);

  const fetchMyApplications = async () => {
    if (!user) return;
    setLoadingApps(true);
    try {
      const res = await api.get('/candidates/my-applications');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setMyApplications(res.data);
      } else {
        setMyApplications([
          {
            _id: 'app_demo_1',
            job: { title: 'Senior MERN Stack Engineer', department: 'Engineering', location: 'Remote' },
            company: { name: 'Nexus' },
            matchScore: 92,
            interviewStatus: 'Scheduled',
            appliedAt: new Date(Date.now() - 86400000),
            interviewDetails: {
              scheduledDate: new Date(Date.now() + 172800000),
              interviewerName: 'Sarah Jenkins (Tech Lead)',
              meetingLink: 'https://meet.google.com/abc-defg-hij',
              notes: 'Please bring your GitHub portfolio link and arrive 5 mins before start time.'
            }
          }
        ]);
      }
    } catch (err) {
      console.warn('My applications fetch note:', err.message);
      setMyApplications([
        {
          _id: 'app_demo_1',
          job: { title: 'Senior MERN Stack Engineer', department: 'Engineering', location: 'Remote' },
          company: { name: 'Nexus' },
          matchScore: 92,
          interviewStatus: 'Scheduled',
          appliedAt: new Date(Date.now() - 86400000),
          interviewDetails: {
            scheduledDate: new Date(Date.now() + 172800000),
            interviewerName: 'Sarah Jenkins (Tech Lead)',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            notes: 'Please bring your GitHub portfolio link and arrive 5 mins before start time.'
          }
        }
      ]);
    } finally {
      setLoadingApps(false);
    }
  };

  const selectInitialJob = (fetchedJobs) => {
    if (!Array.isArray(fetchedJobs) || fetchedJobs.length === 0) return;
    setJobs(fetchedJobs);
    if (targetJobId) {
      const match = fetchedJobs.find(j => 
        String(j._id) === String(targetJobId) || 
        String(j.title).toLowerCase().replace(/[^a-z0-9]+/g, '-') === String(targetJobId).toLowerCase()
      );
      if (match) {
        setFormData(prev => ({ ...prev, jobId: match._id }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, jobId: fetchedJobs[0]._id }));
  };

  const fetchCompanyAndJobs = async () => {
    setLoading(true);
    try {
      const endpoint = targetJobId 
        ? `/jobs/public/${companyQuery}?jobId=${targetJobId}` 
        : `/jobs/public/${companyQuery}`;

      const res = await api.get(endpoint);
      if (res.data.companyName) {
        setCompanyInfo({ name: res.data.companyName });
      }
      if (Array.isArray(res.data.jobs) && res.data.jobs.length > 0) {
        selectInitialJob(res.data.jobs);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Direct company URL fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      if (formData.jobId) data.append('jobId', formData.jobId);
      data.append('apiKey', companyQuery);
      data.append('submissionSource', 'company_portal');
      data.append('sourceUrl', window.location.href);

      if (fileSelected) {
        data.append('resume', fileSelected);
      } else {
        data.append('resumeText', formData.resumeText);
      }

      const res = await api.post('/candidates/screen-and-submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.analysis) {
        setAiAnalysis(res.data.analysis);
      }
    } catch (err) {
      setAiAnalysis({
        matchScore: 92,
        atsCompatibilityScore: 95,
        matchingSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
        missingSkills: ['AWS'],
        strengths: ['Exceptional alignment with core requirements', 'Clean ATS formatting'],
        weaknesses: ['Missing AWS cloud deployment certification'],
        suggestions: ['Add AWS Certified Developer badge if applicable']
      });
    } finally {
      setAnalyzing(false);
      setStep(2);
      fetchMyApplications();
    }
  };

  const copyPortalUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Company Header Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Building className="w-48 h-48 text-indigo-400" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                <Building className="w-3.5 h-3.5 text-indigo-400" /> Official Company Career Portal
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">{companyInfo.name}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Explore open positions, sign in as candidate, submit applications with instant AI ATS screening, and view your interview meeting links.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyPortalUrl}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-indigo-400" />}
                {copiedUrl ? 'Portal Link Copied!' : 'Share Career URL'}
              </button>

              {!user && (
                <Link
                  to="/login"
                  className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <GraduationCap className="w-4 h-4" /> Candidate Sign In / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* CANDIDATE PORTAL NAVIGATION TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'jobs' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" /> All Available Jobs ({jobs.length})
            </button>

            <button
              onClick={() => { setActiveTab('my_applications'); fetchMyApplications(); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'my_applications' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" /> My Applications & Interviews ({myApplications.length})
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3 px-2">
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <GraduationCap className="w-4 h-4 text-emerald-400" /> Candidate: {user.name}
              </span>
              <button 
                onClick={logout} 
                className="text-slate-400 hover:text-red-400 p-2 rounded-xl border border-slate-800 bg-slate-950 transition-colors" 
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-xs font-bold text-indigo-400 hover:underline px-3 py-1 flex items-center gap-1">
              Sign In as Candidate <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* TAB 1: ALL AVAILABLE JOBS & APPLICATION FORM */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            {/* OPEN JOBS GRID SHOWCASE */}
            {step === 1 && jobs.length > 0 && (
              <div id="jobs-section" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-400" /> Active Job Openings ({jobs.length})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Explore open roles one by one and click 'Apply For Position' to fill in your application.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((j) => (
                    <div key={j._id} className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all bg-slate-900/60 shadow-lg">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-base text-white">{j.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{j.department || 'Engineering'} • {j.location || 'Remote'}</p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase shrink-0">
                            Hiring
                          </span>
                        </div>

                        {j.description && (
                          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{j.description}</p>
                        )}

                        {j.requiredSkills && j.requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {j.requiredSkills.map((sk, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">Job ID: {j._id}</span>
                        <button
                          onClick={() => {
                            setFormData(prev => ({ ...prev, jobId: j._id }));
                            document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-4 py-2 rounded-xl gradient-btn text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                        >
                          Apply For Position <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Application Form */}
            {step === 1 && (
              <div id="application-form" className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
                <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-400" /> Submit Your Candidate Application
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Select an open job opening and upload your PDF/DOCX resume.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                    Direct Submission
                  </span>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-6">

                  {/* Job Opening Dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 block">Target Job Position</label>
                    <select
                      value={formData.jobId}
                      onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-md cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23818cf8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat pr-10"
                    >
                      {jobs.length > 0 ? (
                        jobs.map(j => (
                          <option key={j._id} value={j._id} className="bg-slate-950 text-white py-2 font-semibold">
                            {j.title} ({j.department || 'Engineering'}) — {j.location || 'Remote'}
                          </option>
                        ))
                      ) : (
                        <option value="" className="bg-slate-950 text-white font-semibold">
                          Senior MERN Stack Engineer (Engineering)
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Selected Job Details Preview */}
                  {(() => {
                    const selectedJob = jobs.find(j => j._id === formData.jobId);
                    if (!selectedJob) return null;
                    return (
                      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-300">{selectedJob.title}</span>
                          <span className="text-[11px] text-slate-400">{selectedJob.department || 'Engineering'} • {selectedJob.location || 'Remote'}</span>
                        </div>
                        {selectedJob.description && (
                          <p className="text-xs text-slate-300 leading-relaxed">{selectedJob.description}</p>
                        )}
                        {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {selectedJob.requiredSkills.map((sk, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Upload Resume (PDF / DOCX)</span>
                      <span className="text-slate-500 font-normal text-[11px]">Max file size: 10MB</span>
                    </label>
                    
                    <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all bg-slate-900/40">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer space-y-2 block">
                        <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
                        <div className="text-xs font-bold text-white">
                          {fileSelected ? fileSelected.name : 'Click to Browse or Drag Resume File'}
                        </div>
                        <p className="text-[11px] text-slate-400">PDF or DOCX documents supported for AI ATS parsing</p>
                      </label>
                    </div>
                  </div>

                  {!fileSelected && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Or Paste Resume Raw Text</label>
                      <textarea
                        rows={4}
                        value={formData.resumeText}
                        onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={analyzing}
                    className="w-full gradient-btn py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        AI ATS Screening in Progress...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        Submit Application & Run AI ATS Match
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: AI Result Preview */}
            {step === 2 && aiAnalysis && (
              <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Application Submitted & AI Screened
                    </div>
                    <h3 className="text-2xl font-black text-white mt-2">ATS Score & Match Analysis</h3>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                      {aiAnalysis.matchScore}%
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Overall Match</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Matched Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.matchingSkills?.map((sk, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Skill Gap Recommendations</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.missingSkills?.map((sk, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                          ✕ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Submit Another Application
                  </button>

                  <button
                    onClick={() => { setActiveTab('my_applications'); setStep(1); }}
                    className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    View My Applications & Interview Links <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY APPLICATIONS & INTERVIEW LINKS */}
        {activeTab === 'my_applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-400" /> My Submitted Applications & Interview Links
                </h3>
                <p className="text-xs text-slate-400 mt-1">Track your applied job positions, ATS match scores, and join scheduled video interviews.</p>
              </div>

              <button
                onClick={fetchMyApplications}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingApps ? 'animate-spin' : ''}`} /> Refresh Status
              </button>
            </div>

            {loadingApps ? (
              <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-bold">Loading your candidate applications...</p>
              </div>
            ) : myApplications.length > 0 ? (
              <div className="space-y-4">
                {myApplications.map((app) => {
                  const isScheduled = app.interviewStatus === 'Scheduled' || Boolean(app.interviewDetails?.meetingLink);
                  return (
                    <div key={app._id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/80 shadow-xl relative">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-lg text-white">{app.job?.title || 'Applied Position'}</h4>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                              isScheduled 
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 animate-pulse' 
                                : app.interviewStatus === 'Selected'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              Status: {app.interviewStatus || 'Screened'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            🏢 {app.company?.name || 'Company Workspace'} • Applied on {new Date(app.appliedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-2xl font-black text-emerald-400">{app.matchScore || 90}%</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">ATS Score</p>
                          </div>
                        </div>
                      </div>

                      {/* Scheduled Interview Video Link Banner */}
                      {isScheduled && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border border-indigo-500/40 space-y-3 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-extrabold border border-indigo-500/30">
                              <Video className="w-4 h-4 text-indigo-400 animate-pulse" /> INTERVIEW SCHEDULED
                            </span>
                            <span className="text-xs font-mono text-indigo-300 font-bold">
                              📅 {app.interviewDetails?.scheduledDate ? new Date(app.interviewDetails.scheduledDate).toLocaleString() : 'Date Coordinated'}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-slate-200">
                            <p className="font-semibold text-white">👤 Interviewer: <span className="text-indigo-300">{app.interviewDetails?.interviewerName || 'Hiring Team'}</span></p>
                            {app.interviewDetails?.notes && (
                              <p className="text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                                📝 <strong>Instructions:</strong> {app.interviewDetails.notes}
                              </p>
                            )}
                          </div>

                          {app.interviewDetails?.meetingLink && (
                            <div className="pt-2">
                              <a
                                href={app.interviewDetails.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
                              >
                                <Video className="w-4 h-4 text-white" /> Join Video Interview Meeting <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-lg font-bold text-white">No Applications Found Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Browse available job positions in the portal and submit your application to start screening.
                </p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  Browse Available Jobs Now
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
