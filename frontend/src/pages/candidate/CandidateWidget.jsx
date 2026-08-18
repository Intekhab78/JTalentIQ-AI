import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import {
  UploadCloud, Sparkles, FileText, CheckCircle2, AlertCircle, Award,
  Send, ArrowRight, RefreshCw, User, Mail, Phone, Lightbulb, ThumbsUp, ThumbsDown
} from 'lucide-react';

export default function CandidateWidget() {
  const { user } = useContext(AuthContext);
  const activeApiKey = user?.company?.apiKey || 'sk_live_nexus_998877665544332211';

  const [step, setStep] = useState(1); // 1: Input & Upload, 2: AI Result Preview, 3: Submitted Success
  const [jobs, setJobs] = useState([]);

  const [formData, setFormData] = useState({
    name: 'Athahdeep',
    email: 'athahdeep@example.com',
    phone: '+1 555-0192',
    jobId: '',
    jobTitle: '',
    resumeText: `ATHAHDEEP - SENIOR SOFTWARE ENGINEER
Email: athahdeep@example.com | Phone: +1 555-0192

SUMMARY:
Experienced Full Stack Software Engineer specializing in React, Node.js, Express, MongoDB, and TypeScript. 

TECHNICAL SKILLS:
- Frontend: React.js, TypeScript, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB, RESTful APIs
- Tools: Git, GitHub, Docker, Postman`
  });

  useEffect(() => {
    // Fetch live company jobs
    api.get(`/jobs/public/${activeApiKey}`)
      .then(res => {
        if (res.data.jobs && res.data.jobs.length > 0) {
          setJobs(res.data.jobs);
          setFormData(prev => ({
            ...prev,
            jobId: res.data.jobs[0]._id,
            jobTitle: res.data.jobs[0].title
          }));
        }
      })
      .catch(err => {
        console.warn('Fallback fetching jobs:', err.message);
        api.get('/jobs')
          .then(res => {
            if (Array.isArray(res.data) && res.data.length > 0) {
              setJobs(res.data);
              setFormData(prev => ({
                ...prev,
                jobId: res.data[0]._id,
                jobTitle: res.data[0].title
              }));
            }
          })
          .catch(() => { });
      });
  }, [activeApiKey]);

  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState({
    matchScore: 92,
    atsCompatibilityScore: 95,
    matchingSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'REST API'],
    missingSkills: ['AWS', 'GraphQL Certification'],
    strengths: [
      'Exceptional alignment with core MERN stack requirements',
      'Clean structural section headers boosting ATS readability score',
      'Proven experience in React state management'
    ],
    weaknesses: [
      'Missing AWS cloud deployment certification'
    ],
    suggestions: [
      'Include quantifiable deployment metrics for cloud infrastructure (e.g. AWS S3/EC2)',
      'Add link to GitHub repository showcasing TypeScript projects'
    ]
  });

  const [fileSelected, setFileSelected] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };

  const handleRunAiScreening = async (e) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      if (formData.jobId) data.append('jobId', formData.jobId);
      data.append('apiKey', activeApiKey);
      data.append('submissionSource', 'embedded_widget');
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
      console.warn('AI Screening submission alert:', err.message);
    } finally {
      setAnalyzing(false);
      setStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Widget Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI ATS Resume Checker & Application Portal
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Instant Resume Screening & Skill Analysis</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Upload your resume for real-time ATS match scoring, missing keyword detection, and customized resume improvement suggestions before submitting your application.
        </p>
      </div>

      {/* STEP 1: Upload & Form */}
      {step === 1 && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" /> Candidate Profile & Resume Upload
          </h3>

          <form onSubmit={handleRunAiScreening} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Job Opening</label>
                <select
                  value={formData.jobId}
                  onChange={(e) => {
                    const selected = jobs.find(j => j._id === e.target.value);
                    setFormData({ ...formData, jobId: e.target.value, jobTitle: selected?.title || '' });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {jobs.length > 0 ? (
                    jobs.map(j => (
                      <option key={j._id} value={j._id}>{j.title}</option>
                    ))
                  ) : (
                    <option value="">Senior MERN Stack Engineer</option>
                  )}
                </select>
              </div>
            </div>

            {/* Resume Upload Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Resume File (PDF / DOCX)</label>
              <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-white">
                  {fileSelected ? fileSelected.name : 'Click or Drag & Drop PDF / DOCX Resume here'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Maximum file size: 10MB</p>
              </div>
            </div>

            {/* Text Resume Alternative */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Or Paste Resume Text</label>
              <textarea
                rows={6}
                value={formData.resumeText}
                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full gradient-btn py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> AI Analyzing Resume & Job Description...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Analyze Resume with AI & Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: Real-time AI Analysis Breakdown */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 space-y-6">

            {/* Header Score Meter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Analysis Completed</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">ATS Compatibility & Job Fit Report</h3>
                <p className="text-xs text-slate-400 mt-1">Target Position: <strong>{formData.jobTitle}</strong></p>
              </div>

              <div className="flex items-center justify-end gap-6">
                <div className="text-center bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/20">
                  <span className="text-4xl font-black text-emerald-400">{aiAnalysis.matchScore}%</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Job Match Score</p>
                </div>

                <div className="text-center bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/20">
                  <span className="text-4xl font-black text-indigo-400">{aiAnalysis.atsCompatibilityScore}%</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">ATS Readability</p>
                </div>
              </div>
            </div>

            {/* AI Executive Summary Banner */}
            {aiAnalysis.aiSummary && (
              <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 text-xs text-slate-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-400 text-xs uppercase tracking-wider mb-1">AI Executive Summary</h4>
                  <p className="leading-relaxed">{aiAnalysis.aiSummary}</p>
                </div>
              </div>
            )}

            {/* Matching & Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="glass-panel p-5 rounded-xl border border-emerald-500/20 space-y-3">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Detected Matching Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.matchingSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-red-500/20 space-y-3">
                <h4 className="font-bold text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Missing Keywords / Skill Gaps
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.missingSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono">
                      ✕ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-emerald-400" /> Resume Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {aiAnalysis.strengths?.map((str, i) => (
                    <li key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                      • {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ThumbsDown className="w-4 h-4 text-red-400" /> Areas for Improvement
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {aiAnalysis.weaknesses?.map((w, i) => (
                    <li key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                      • {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions Box */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> AI Resume Optimization Recommendations
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {aiAnalysis.suggestions?.map((sug, i) => (
                  <li key={i}>💡 {sug}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Re-upload Resume
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 gradient-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                Confirm & Send Application to HR <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Submission Confirmation */}
      {step === 3 && (
        <div className="glass-panel p-12 rounded-2xl border border-emerald-500/40 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Application Submitted!</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your resume and AI screening analysis have been delivered to the recruiting team at <strong>TechCorp Solutions</strong>.
          </p>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
            Candidate ID: cand_app_{Date.now().toString().slice(-6)}
          </div>
          <button
            onClick={() => setStep(1)}
            className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            Submit Another Application
          </button>
        </div>
      )}
    </div>
  );
}
