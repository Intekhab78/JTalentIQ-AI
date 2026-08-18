import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Sparkles, CheckCircle2, Zap, ShieldCheck, Users, FileText, Code, Building2, 
  ArrowRight, Award, HelpCircle, Mail, Phone, MapPin, Send, Star, Layers, Clock, 
  ChevronRight, Lock, Check, UserCheck, LogIn, UserPlus
} from 'lucide-react';

export default function HomePage() {
  const { user, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    companySize: '1-10 Employees',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Billing Frequency Toggle (Monthly vs Yearly)
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', companySize: '1-10 Employees', message: '' });
      setContactSubmitted(false);
    }, 4000);
  };

  const handlePackageSelect = (pkgName) => {
    if (user) {
      navigate('/company');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="space-y-20 pb-16 animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden text-center md:text-left">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Next-Gen AI Resume Screening & ATS Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Screen Resumes <span className="gradient-text">10x Faster</span> with Precision AI
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Automate candidate evaluations, extract skills, calculate percentage ATS match scores, and embed custom application widgets on your career portal in minutes.
            </p>

            {/* CTA Buttons & Auth Options */}
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center md:justify-start">
              {user ? (
                <Link
                  to="/company"
                  onClick={() => switchRole('company_admin')}
                  className="gradient-btn px-6 py-3.5 text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
                >
                  <Building2 className="w-5 h-5" /> Go to Company Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="gradient-btn px-6 py-3.5 text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
                  >
                    <UserPlus className="w-5 h-5" /> Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="px-6 py-3.5 text-sm font-bold rounded-2xl border border-slate-700 bg-slate-900/90 text-slate-200 hover:text-white hover:border-purple-500/50 hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5 text-purple-400" /> Sign In to Workspace
                  </Link>
                </>
              )}

              <Link
                to="/widget"
                onClick={() => switchRole('candidate')}
                className="px-5 py-3.5 text-sm font-semibold rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" /> Try Candidate Widget
              </Link>
            </div>

            {/* Metrics Pills */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center md:text-left">
              <div>
                <p className="text-2xl font-black text-white">99.4%</p>
                <p className="text-xs text-slate-400">ATS Parsing Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">10x</p>
                <p className="text-xs text-slate-400">Faster Hiring Cycle</p>
              </div>
              <div>
                <p className="text-2xl font-black text-purple-400">50,000+</p>
                <p className="text-xs text-slate-400">Resumes Evaluated</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Preview Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">AI Match Screening</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">LIVE PREVIEW</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-white">David Miller</p>
                      <p className="text-[11px] text-slate-400">Senior MERN Stack Engineer</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      92% Match
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[92%]" />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">✓ React</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">✓ Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">✓ MongoDB</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">✓ TypeScript</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-white">Marcus Vance</p>
                      <p className="text-[11px] text-slate-400">AI / Machine Learning Lead</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      89% Match
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full w-[89%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 2. CORE FEATURES SECTION */}
      <section id="features" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Built for Modern Recruitment Teams
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything You Need to Hire top Talent Fast
          </h2>
          <p className="text-slate-400 text-sm">
            Streamline candidate evaluation with automated ATS scoring, team permissions, and real-time candidate widgets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "AI ATS Matching Engine",
              desc: "Deep semantic analysis comparing candidate resumes against job descriptions, extracting matched & missing skills instantly.",
              color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
            },
            {
              icon: Code,
              title: "Embeddable Candidate Widget",
              desc: "Embed our responsive candidate application popup on your career site with a simple 1-line JavaScript snippet.",
              color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            },
            {
              icon: Users,
              title: "Recruiter Pipeline & Scheduler",
              desc: "Filter candidates by match score thresholds, schedule interviews in one click, and track hiring stages.",
              color: "text-sky-400 bg-sky-500/10 border-sky-500/20"
            },
            {
              icon: ShieldCheck,
              title: "Super Admin Governance",
              desc: "Enterprise platform dashboard to manage company accounts, freeze/activate tenants, assign plans, and track audit logs.",
              color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
            },
            {
              icon: Award,
              title: "Skill Gap & Strength Analytics",
              desc: "Get automated strengths, weaknesses, and actionable resume optimization suggestions for every candidate.",
              color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
            },
            {
              icon: Lock,
              title: "Enterprise Security & APIs",
              desc: "Secure API keys, encrypted candidate data storage, role-based access control, and GDPR/compliance readiness.",
              color: "text-pink-400 bg-pink-500/10 border-pink-500/20"
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl glass-panel-hover space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>


      {/* 3. PRICING PACKAGES SECTION (25 AED, 35 AED, 60 AED) */}
      <section id="pricing" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> Transparent Pricing in AED
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Choose the Right Plan for Your Company
          </h2>
          <p className="text-slate-400 text-sm">
            Scale your recruitment pipeline with flexible monthly packages. No hidden fees.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 relative border border-slate-700 transition-colors"
            >
              <div className={`w-4 h-4 rounded-full bg-purple-500 transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
              Yearly <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* PACKAGE 1: BASIC (25 AED) */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 relative hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Basic Package</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">25</span>
                <span className="text-sm font-bold text-slate-400">AED / month</span>
              </div>
              <p className="text-xs text-slate-400">Ideal for small startups & solo recruiters starting with AI screening.</p>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>150</strong> Resumes Screened / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard ATS Keyword Matcher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Active Job Listing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Single Recruiter User Account</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <Check className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Candidate Embed Widget</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePackageSelect('Basic')}
              className="w-full py-3 rounded-2xl border border-slate-700 bg-slate-900 text-white font-bold text-xs hover:border-purple-500/50 hover:bg-slate-800 transition-all"
            >
              Get Started (25 AED)
            </button>
          </div>

          {/* PACKAGE 2: POPULAR (35 AED) - FEATURED HIGHLIGHT */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-purple-500 bg-gradient-to-b from-purple-950/30 via-slate-900 to-slate-900 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-purple-500/20 transform md:-translate-y-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-black tracking-wider uppercase shadow-md">
              ★ Most Popular
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">Popular Package</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">35</span>
                <span className="text-sm font-bold text-purple-300">AED / month</span>
              </div>
              <p className="text-xs text-slate-300">Perfect for growing companies needing AI matching & candidate widget integration.</p>

              <div className="pt-4 border-t border-purple-500/20 space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>500</strong> Resumes Screened / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced <strong>Gemini AI</strong> Matching Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to <strong>5 Active Job Listings</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Embeddable Candidate Application Widget</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated Interview Scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority Email & WhatsApp Support</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePackageSelect('Popular')}
              className="w-full py-3.5 rounded-2xl gradient-btn text-white font-bold text-xs shadow-lg shadow-purple-600/40 hover:scale-105 transition-all"
            >
              Subscribe Popular (35 AED)
            </button>
          </div>

          {/* PACKAGE 3: ADVANCE (60 AED) */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 relative hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Advance Package</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">60</span>
                <span className="text-sm font-bold text-slate-400">AED / month</span>
              </div>
              <p className="text-xs text-slate-400">Designed for enterprise recruitment teams with high-volume ATS needs.</p>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>2,500</strong> Resumes Screened / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fine-tuned Custom AI Model Prompt Rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited</strong> Active Job Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Live <strong>API Key</strong> Access & Webhooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Team Permissions & User Roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Account Manager & SLA 99.9%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePackageSelect('Advance')}
              className="w-full py-3 rounded-2xl border border-purple-500/40 bg-purple-950/30 text-purple-300 font-bold text-xs hover:bg-purple-900/50 hover:text-white transition-all"
            >
              Go Advance (60 AED)
            </button>
          </div>

        </div>
      </section>


      {/* 4. CONTACT US SECTION */}
      <section id="contact" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" /> We're Here to Help
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Get in Touch with Our UAE Support Team
          </h2>
          <p className="text-slate-400 text-sm">
            Have questions about custom plans, candidate widget integration, or platform demo? Contact us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="font-extrabold text-base text-white">Contact Information</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Email Us</p>
                    <p className="text-slate-400">support@resumatch.ae</p>
                    <p className="text-slate-400">sales@resumatch.ae</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Call / WhatsApp (UAE)</p>
                    <p className="text-slate-400">+971 4 123 4567</p>
                    <p className="text-slate-400">+971 50 987 6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Regional Office</p>
                    <p className="text-slate-400">Internet City, Business Bay Tower 4, Dubai, UAE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Support Online
              </div>
              <p className="text-slate-300">
                Our AI Support Specialists in Dubai are online to help set up your company dashboard and API key.
              </p>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 rounded-3xl border border-slate-800">
              {contactSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out. Our UAE team will review your inquiry and get back to you within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.ae"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="Inquiry about Popular 35 AED Plan"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Size</label>
                      <select
                        value={contactForm.companySize}
                        onChange={(e) => setContactForm({ ...contactForm, companySize: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option>1-10 Employees</option>
                        <option>11-50 Employees</option>
                        <option>51-200 Employees</option>
                        <option>201+ Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">How can we help you?</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your recruitment process, volume of resumes, or integration questions..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl gradient-btn font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-102 transition-all"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
