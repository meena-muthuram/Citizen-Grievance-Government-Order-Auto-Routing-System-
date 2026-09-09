import React, { useState } from 'react';
import { UserSession, DepartmentId, LanguageCode } from '../types';
import { EmblemOfIndia } from './EmblemOfIndia';
import { ALL_INDIAN_LANGUAGES } from '../data/languages';
import { DEPARTMENTS } from '../data/departmentsAndKeywords';
import indianFlagEmblemBg from '../assets/images/indian_flag_emblem_bg_1788972790117.jpg';
import {
  User,
  Phone,
  KeyRound,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Globe2,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PortalLoginProps {
  onLogin: (session: UserSession) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({
  onLogin,
  currentLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'CITIZEN' | 'OFFICIAL'>('CITIZEN');

  // Citizen Form State
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenMpin, setCitizenMpin] = useState('');
  const [citizenError, setCitizenError] = useState('');

  // Official Form State
  const [officialId, setOfficialId] = useState('');
  const [officialPassword, setOfficialPassword] = useState('');
  const [officialDept, setOfficialDept] = useState<DepartmentId | 'ALL'>('ALL');
  const [officialDesignation, setOfficialDesignation] = useState('District Collector & Magistrate');
  const [officialError, setOfficialError] = useState('');

  // Handle Citizen Login
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim()) {
      setCitizenError('Please enter your full name');
      return;
    }
    if (!citizenPhone.trim() || citizenPhone.length < 10) {
      setCitizenError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!citizenMpin || citizenMpin.length < 4) {
      setCitizenError('Please enter a 4-digit security MPIN');
      return;
    }

    setCitizenError('');
    onLogin({
      role: 'CITIZEN',
      name: citizenName,
      identifier: citizenPhone,
    });
  };

  // Quick Demo Citizen Auto-fill
  const fillDemoCitizen = (name: string, phone: string, mpin: string) => {
    setCitizenName(name);
    setCitizenPhone(phone);
    setCitizenMpin(mpin);
    setCitizenError('');
  };

  // Handle Official Login
  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialId.trim()) {
      setOfficialError('Please enter your Official Service ID or Email');
      return;
    }
    if (!officialPassword.trim()) {
      setOfficialError('Please enter your Secure Password / PIN');
      return;
    }

    setOfficialError('');
    onLogin({
      role: 'OFFICIAL',
      name: officialId.includes('ias') ? 'Smt. Vandana Rao, IAS' : 'Official Officer',
      identifier: officialId,
      officialDepartmentId: officialDept,
      designation: officialDesignation,
    });
  };

  // Quick Demo Official Auto-fill
  const fillDemoOfficial = (
    id: string,
    dept: DepartmentId | 'ALL',
    designation: string
  ) => {
    setOfficialId(id);
    setOfficialPassword('GovPass@2026');
    setOfficialDept(dept);
    setOfficialDesignation(designation);
    setOfficialError('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-3 sm:p-6">
      {/* Top Bar with Language Selector */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 px-4 mb-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-stone-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>National Grievance Redressal & Auto-Routing System (NG-CPGRAMS 2.0)</span>
        </div>

        <div className="flex items-center space-x-2">
          <Globe2 className="w-4 h-4 text-stone-500" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-stone-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
            aria-label="Portal Language Selection"
          >
            {ALL_INDIAN_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Indian Flag and Emblem Symbol in Dignified National Background */}
        <div className="w-full md:w-5/12 relative bg-stone-900 flex flex-col justify-between overflow-hidden min-h-[360px] md:min-h-[640px]">
          {/* Background image: Indian Flag & Ashoka Lion Emblem */}
          <div className="absolute inset-0 z-0">
            <img
              src={indianFlagEmblemBg}
              alt="Indian National Flag and Emblem"
              className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient overlay for typography readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-stone-900/40 backdrop-blur-[0.5px]" />
          </div>

          {/* Top badge on image */}
          <div className="relative z-10 p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              National Emblem & Flag • Republic of India
            </div>
          </div>

          {/* Bottom highlights over Flag and Emblem */}
          <div className="relative z-10 p-6 text-white">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-md leading-snug">
              AI-powered routing that sends every complaint or government order to the right department automatically.
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-[11px]">80+ Live Keywords</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-[11px]">Strict SLA Monitoring</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-[11px]">Govt Order Routing</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-semibold text-[11px]">Citizen AI Assistant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Portal Login & Top-Centre Emblem of India */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white">
          {/* Top-Centre Alignment of Emblem of India Logo & Bold Highlighted Letters */}
          <div className="flex flex-col items-center justify-center text-center pb-5 border-b border-stone-100">
            <EmblemOfIndia size="lg" showText={true} hideHindi={true} highlightGovOfIndia={true} />
            <h1 className="mt-3 text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Citizen Grievance & Auto-Routing Portal
            </h1>
            <p className="text-xs sm:text-sm text-stone-800 font-bold mt-1 tracking-wide">
              One Complaint .Right department .Fast Action
            </p>
            <p className="text-[11px] sm:text-xs text-amber-700 font-semibold mt-0.5">
              Government order auto routing system
            </p>
          </div>

          {/* 2 Login Tabs: Citizen Login vs Government Officials */}
          <div className="mt-6">
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('CITIZEN')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'CITIZEN'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                id="tab-citizen-login"
              >
                <User className="w-3.5 h-3.5" />
                Citizen Portal
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('OFFICIAL')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'OFFICIAL'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                id="tab-official-login"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Government Officials
              </button>
            </div>

            {/* CITIZEN LOGIN FORM */}
            {activeTab === 'CITIZEN' && (
              <form onSubmit={handleCitizenSubmit} className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    Citizen Access Credentials
                  </span>
                  <span className="text-[11px] text-stone-500">
                    No password required • Secure MPIN
                  </span>
                </div>

                {citizenError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {citizenError}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Citizen Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra / Priya Sharma"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Phone Number (10 digits)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-stone-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-11 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* MPIN */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    4-Digit Security MPIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={citizenMpin}
                      onChange={(e) => setCitizenMpin(e.target.value)}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 tracking-widest focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  id="btn-citizen-enter"
                >
                  <span>Enter Citizen Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Demo Quick Fill for Instant Testing */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-stone-500 mb-1.5 flex items-center justify-between">
                    <span>Instant Demo Accounts:</span>
                    <span className="text-[10px] text-amber-700 font-mono">1-click login</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCitizen('Aarav Sharma', '9876543210', '1234')}
                      className="text-left p-2 rounded-lg bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors text-[11px]"
                    >
                      <div className="font-bold text-stone-800">Aarav Sharma</div>
                      <div className="text-stone-500">9876543210 (MPIN 1234)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCitizen('Priya Narayanan', '9811234567', '5678')}
                      className="text-left p-2 rounded-lg bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors text-[11px]"
                    >
                      <div className="font-bold text-stone-800">Priya Narayanan</div>
                      <div className="text-stone-500">9811234567 (MPIN 5678)</div>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* GOVERNMENT OFFICIALS LOGIN FORM */}
            {activeTab === 'OFFICIAL' && (
              <form onSubmit={handleOfficialSubmit} className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    Official Administrative Login
                  </span>
                  <span className="text-[11px] text-stone-500">
                    District Collectorate & Depts
                  </span>
                </div>

                {officialError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {officialError}
                  </div>
                )}

                {/* Official ID */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Official ID / Government Email
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={officialId}
                      onChange={(e) => setOfficialId(e.target.value)}
                      placeholder="e.g. collector.central@gov.in or pwd.ce@gov.in"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-700"
                      required
                    />
                  </div>
                </div>

                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Assigned Department / Jurisdiction
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <select
                      value={officialDept}
                      onChange={(e) => setOfficialDept(e.target.value as DepartmentId | 'ALL')}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-700 font-medium"
                    >
                      <option value="ALL">
                        District Collectorate (All 10 Departments & Orders)
                      </option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Official Password */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Security Password / Gov Passkey
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={officialPassword}
                      onChange={(e) => setOfficialPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-700"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  id="btn-official-enter"
                >
                  <span>Enter Officials Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Demo Quick Fill for Government Roles */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-stone-500 mb-1.5 flex items-center justify-between">
                    <span>Quick Switch Official Roles:</span>
                    <span className="text-[10px] text-stone-700 font-mono">1-click demo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        fillDemoOfficial(
                          'collector.ias@gov.in',
                          'ALL',
                          'District Collector & Magistrate'
                        )
                      }
                      className="text-left p-2 rounded-lg bg-stone-50 border border-stone-200 hover:border-stone-500 hover:bg-stone-100 transition-colors text-[11px]"
                    >
                      <div className="font-bold text-stone-900">District Collector</div>
                      <div className="text-stone-500">Issue GOs & All Depts</div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        fillDemoOfficial(
                          'pwd.chief@gov.in',
                          'PWD',
                          'Chief Engineer (Roads & Bridges)'
                        )
                      }
                      className="text-left p-2 rounded-lg bg-stone-50 border border-stone-200 hover:border-stone-500 hover:bg-stone-100 transition-colors text-[11px]"
                    >
                      <div className="font-bold text-stone-900">PWD Chief Engineer</div>
                      <div className="text-stone-500">Roads & Pothole Queue</div>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Powered by National Informatics Centre (NIC) Standards</span>
            <span className="font-mono">v2.4-SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
