import React, { useState, useRef } from 'react';
import {
  Complaint,
  SLARule,
  NotificationItem,
  UserSession,
  LanguageCode,
  KeywordMapping,
} from '../types';
import { EmblemOfIndia } from './EmblemOfIndia';
import { AutoRoutingPreview } from './AutoRoutingPreview';
import { CitizenAIAssistant } from './CitizenAIAssistant';
import { ADMINISTRATIVE_WARDS } from '../data/initialData';
import { DEPARTMENTS, routeTextToDepartments } from '../data/departmentsAndKeywords';
import { ALL_INDIAN_LANGUAGES, getTranslation } from '../data/languages';
import {
  Menu,
  X,
  PlusCircle,
  FileSearch,
  History,
  Activity,
  Bell,
  LogOut,
  MapPin,
  Mic,
  MicOff,
  Image as ImageIcon,
  Upload,
  Send,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Building,
  Filter,
  Check,
  Tag,
  Paperclip,
  Share2,
} from 'lucide-react';

interface CitizenDashboardProps {
  session: UserSession;
  complaints: Complaint[];
  slaRules: SLARule[];
  notifications: NotificationItem[];
  keywordsDatabase: KeywordMapping[];
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onAddComplaint: (newComplaint: Complaint) => void;
  onSignOut: () => void;
  onMarkNotificationRead: (id: string) => void;
}

type CitizenTab = 'FILE_COMPLAINT' | 'SLA_RULES' | 'HISTORY' | 'TRACK_STATUS' | 'NOTIFICATIONS';

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  session,
  complaints,
  slaRules,
  notifications,
  keywordsDatabase,
  language,
  onLanguageChange,
  onAddComplaint,
  onSignOut,
  onMarkNotificationRead,
}) => {
  const [activeTab, setActiveTab] = useState<CitizenTab>('FILE_COMPLAINT');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trackingId, setTrackingId] = useState<string>('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form State for "File Citizen Complaint"
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [administrativeWard, setAdministrativeWard] = useState('Ward-03');
  const [citizenContact, setCitizenContact] = useState(session.identifier || '+91 98765 43210');
  const [citizenEmail, setCitizenEmail] = useState('citizen@example.com');
  const [locationAddress, setLocationAddress] = useState('Karol Bagh Metro Junction, New Delhi');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6514,
    lng: 77.1907,
  });
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // SLA search state
  const [slaSearchQuery, setSlaSearchQuery] = useState('');
  const [slaDeptFilter, setSlaDeptFilter] = useState<string>('ALL');

  // Voice recording timer
  const voiceIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(language);

  // Auto-detect location
  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
          setLocationAddress(`GPS Detected: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)} (Ward Area Verified)`);
          setDetectingLocation(false);
        },
        () => {
          // Fallback simulation
          setLocationCoords({ lat: 28.6315, lng: 77.2167 });
          setLocationAddress('Ward 1 - Connaught Sector (Auto-located via Network Geolocation)');
          setDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocationAddress('Ward 1 - Connaught Sector (Auto-located via Network)');
      setDetectingLocation(false);
    }
  };

  // Voice dictation toggle
  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      clearInterval(voiceIntervalRef.current);
      setIsRecordingVoice(false);
      setHasVoiceNote(true);
      // Append voice transcript simulation if description is light
      if (!description.includes('Voice Note Transcribed:')) {
        setDescription(
          (prev) =>
            (prev ? prev + ' ' : '') +
            'Pothole on main road causing severe traffic backup AND broken street light blinking since yesterday AND uncollected garbage bins overflow.'
        );
      }
    } else {
      setIsRecordingVoice(true);
      setVoiceDuration(0);
      voiceIntervalRef.current = setInterval(() => {
        setVoiceDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  // File upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFilePreview(null);
      }
    }
  };

  // Handle Complaint Submission
  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out both the complaint title and description.');
      return;
    }

    setSubmitting(true);

    const combinedText = `${title} ${description}`;
    const routedDepts = routeTextToDepartments(combinedText, keywordsDatabase);

    // If no keyword match, route to Municipal Corporation by default
    const finalRouted =
      routedDepts.length > 0
        ? routedDepts
        : [
            {
              departmentId: 'MUNICIPAL' as const,
              matchedKeywords: ['general civic inquiry'],
              status: 'PENDING' as const,
              updatedAt: new Date().toISOString(),
            },
          ];

    const newId = `LOK-2026-CMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint: Complaint = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      administrativeWard,
      citizenName: session.name,
      citizenContact,
      citizenEmail,
      location: {
        lat: locationCoords.lat,
        lng: locationCoords.lng,
        address: locationAddress,
      },
      routedDepartments: finalRouted,
      overallStatus: 'ROUTED',
      priority: finalRouted.length >= 3 ? 'HIGH' : 'ROUTINE',
      slaHours: Math.min(...finalRouted.map((d) => 24)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileName: uploadedFileName || undefined,
      fileUrl: uploadedFilePreview || undefined,
      voiceNoteDuration: hasVoiceNote ? voiceDuration : undefined,
    };

    setTimeout(() => {
      onAddComplaint(newComplaint);
      setSubmitting(false);
      setSubmissionSuccess(newId);
      setTitle('');
      setDescription('');
      setUploadedFileName(null);
      setUploadedFilePreview(null);
      setHasVoiceNote(false);
    }, 600);
  };

  // Filtered SLA Rules
  const filteredSlaRules = slaRules.filter((rule) => {
    const matchesQuery =
      rule.issueCategory.toLowerCase().includes(slaSearchQuery.toLowerCase()) ||
      rule.escalationOfficer.toLowerCase().includes(slaSearchQuery.toLowerCase()) ||
      rule.penaltyClause.toLowerCase().includes(slaSearchQuery.toLowerCase());
    const matchesDept = slaDeptFilter === 'ALL' || rule.departmentId === slaDeptFilter;
    return matchesQuery && matchesDept;
  });

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const departmentsMap = new Map(DEPARTMENTS.map((d) => [d.id, d]));

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Hamburger menu on left top corner */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              id="citizen-hamburger-menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Emblem and Title */}
            <div className="flex items-center space-x-2.5">
              <EmblemOfIndia size="sm" showText={false} />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
                  Citizen Grievance Portal
                </h1>
                <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                  Citizen Services • Multi-Department Auto-Routing
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions: Multi-language selection, Notifications, User */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Multi-language selection (all official languages used in India) */}
            <div className="flex items-center space-x-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <span className="text-xs font-semibold text-stone-600 hidden md:inline">Language:</span>
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-bold text-stone-800 focus:outline-hidden cursor-pointer"
                id="citizen-language-select"
                aria-label="Select Indian Language"
              >
                {ALL_INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              id="citizen-notifications-bell"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Citizen User Badge */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-stone-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                {session.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-bold text-stone-900 leading-none">{session.name}</div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">{session.identifier}</div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors"
              title="Sign Out"
              id="citizen-signout-btn"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar for Instant Access */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar space-x-1 py-1.5">
          <button
            onClick={() => setActiveTab('FILE_COMPLAINT')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'FILE_COMPLAINT'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-file-complaint"
          >
            <PlusCircle className="w-4 h-4" />
            <span>1. {t.fileComplaint}</span>
          </button>

          <button
            onClick={() => setActiveTab('SLA_RULES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'SLA_RULES'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-sla-rules"
          >
            <Shield className="w-4 h-4" />
            <span>2. {t.slaRules}</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-complaint-history"
          >
            <History className="w-4 h-4" />
            <span>3. {t.complaintHistory}</span>
          </button>

          <button
            onClick={() => setActiveTab('TRACK_STATUS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'TRACK_STATUS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-track-status"
          >
            <Activity className="w-4 h-4" />
            <span>4. {t.trackStatus}</span>
          </button>

          <button
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'NOTIFICATIONS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-notifications"
          >
            <Bell className="w-4 h-4" />
            <span>5. {t.notifications}</span>
            {unreadNotifsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hamburger Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center space-x-2">
                  <EmblemOfIndia size="sm" showText={false} />
                  <div>
                    <h2 className="font-extrabold text-sm text-stone-900">
                      Citizen Services Menu
                    </h2>
                    <p className="text-[11px] text-stone-500">Navigation & Portals</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:bg-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="p-3 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('FILE_COMPLAINT');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    activeTab === 'FILE_COMPLAINT'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>1. File Citizen Complaint</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('SLA_RULES');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    activeTab === 'SLA_RULES'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>2. Service Level Agreement (SLA)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('HISTORY');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    activeTab === 'HISTORY'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>3. Complaint History</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('TRACK_STATUS');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    activeTab === 'TRACK_STATUS'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>4. Track Status of Process</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('NOTIFICATIONS');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    activeTab === 'NOTIFICATIONS'
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>5. Notifications ({unreadNotifsCount})</span>
                </button>
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onSignOut();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span>6. Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* =================================================================== */}
        {/* TAB 1: FILE CITIZEN COMPLAINT */}
        {/* =================================================================== */}
        {activeTab === 'FILE_COMPLAINT' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white mb-2">
                  <Share2 className="w-3 h-3" />
                  Multi-Issue Single Submission
                </span>
                <h2 className="text-xl font-extrabold tracking-tight">
                  File a Multi-Department Grievance
                </h2>
                <p className="text-xs text-amber-100 mt-1 max-w-2xl">
                  Citizens can file complaints describing multiple issues in a single submission (e.g., a pothole AND a broken street light AND garbage piling up). Our live engine auto-routes each issue to the appropriate department.
                </p>
              </div>

              {/* Sample auto-fill button */}
              <button
                type="button"
                onClick={() => {
                  setTitle('Deep Pothole, Broken Street Light, and Garbage Piling up on Footpath');
                  setDescription(
                    'There is a hazardous deep pothole causing vehicle damage near school crossing, along with a broken street light dark for 3 nights, and unattended garbage piling up near the tea stall attracting stray animals.'
                  );
                  setAdministrativeWard('Ward-03');
                }}
                className="px-3.5 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-amber-50 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Try Multi-Issue Sample</span>
              </button>
            </div>

            {submissionSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Grievance Successfully Registered & Auto-Routed!</h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Your complaint token is <strong className="font-mono">{submissionSuccess}</strong>. It has been partitioned and transmitted to respective department field officers under guaranteed SLA timelines.
                    </p>
                    <button
                      onClick={() => {
                        setTrackingId(submissionSuccess);
                        setActiveTab('TRACK_STATUS');
                      }}
                      className="mt-2 text-xs font-bold text-emerald-800 underline flex items-center gap-1"
                    >
                      Track this complaint now <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSubmissionSuccess(null)}
                  className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
                <form onSubmit={handleSubmitComplaint} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Complaint Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t.titlePlaceholder}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  {/* Multimodal Detail Description: Text + Image + Voice */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-stone-800">
                        Detailed Description (Text / Voice / Image) <span className="text-rose-500">*</span>
                      </label>

                      {/* Voice Dictation Button */}
                      <button
                        type="button"
                        onClick={toggleVoiceRecording}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          isRecordingVoice
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                        title="Dictate grievance via voice"
                      >
                        {isRecordingVoice ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>Recording ({voiceDuration}s)... Click to Stop</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-amber-600" />
                            <span>{hasVoiceNote ? 'Re-record Voice Note' : 'Record Voice Note'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t.descPlaceholder}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />

                    {hasVoiceNote && (
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Voice Note Attached ({voiceDuration}s) & Auto-Transcribed into Text
                        </span>
                        <button
                          type="button"
                          onClick={() => setHasVoiceNote(false)}
                          className="text-rose-600 hover:underline font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ward Selection & Citizen Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Administrative Ward/Zone */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Administrative Ward / Zone <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <select
                          value={administrativeWard}
                          onChange={(e) => setAdministrativeWard(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                        >
                          {ADMINISTRATIVE_WARDS.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name} ({w.zone})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Citizen Contact */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Citizen Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={citizenContact}
                          onChange={(e) => setCitizenContact(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Location & GPS Detection */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-stone-800">
                        Current Location / Incident Landmark <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={detectingLocation}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{detectingLocation ? 'Locating...' : 'Detect Current GPS'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="Street, Landmark, Sector, Coordinates"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  {/* File / Image Upload (Drag & Drop + Click) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Upload File / Geo-tagged Photo (Optional)
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer bg-stone-50 hover:bg-amber-50/30 transition-colors"
                    >
                      {uploadedFileName ? (
                        <div className="flex items-center justify-center space-x-3">
                          {uploadedFilePreview ? (
                            <img
                              src={uploadedFilePreview}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                            />
                          ) : (
                            <Paperclip className="w-6 h-6 text-amber-600" />
                          )}
                          <div className="text-left">
                            <p className="text-xs font-bold text-stone-800">{uploadedFileName}</p>
                            <p className="text-[10px] text-stone-500">Click to change file</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-stone-400 mb-1" />
                          <p className="text-xs font-semibold text-stone-700">
                            Click to browse or drag & drop photo of pothole, garbage, or leak
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            Supports PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Grievance Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    id="btn-submit-citizen-complaint"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Auto-Routing & Filing...' : t.submitComplaint}</span>
                  </button>
                </form>
              </div>

              {/* Live Auto-Routing Preview as Citizen Types */}
              <div className="lg:col-span-5 space-y-4">
                <AutoRoutingPreview
                  text={`${title} ${description}`}
                  keywordsDatabase={keywordsDatabase}
                  mode="full"
                />

                {/* Helpful Guidance Card */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>How Auto-Routing Works:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 leading-relaxed">
                    <li>
                      You can include <strong>multiple issues</strong> in a single submission (pothole + broken light + garbage).
                    </li>
                    <li>
                      The engine scans <strong>80+ keywords</strong> across 10 government departments simultaneously.
                    </li>
                    <li>
                      Each identified department immediately receives a sub-task and distinct tracking ticket.
                    </li>
                    <li>
                      SLA countdown begins as soon as the complaint is logged into the official registry.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: SERVICE LEVEL AGREEMENT (SLA RULES) */}
        {/* =================================================================== */}
        {activeTab === 'SLA_RULES' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* SLA Header with Search Bar */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    Service Level Agreement (SLA Rules Directory)
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Legally mandated civic resolution timelines under the Citizens Charter & Right to Public Services Act.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                  <span>Total Rules: {filteredSlaRules.length}</span>
                </div>
              </div>

              {/* Search Bar & Department Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={slaSearchQuery}
                    onChange={(e) => setSlaSearchQuery(e.target.value)}
                    placeholder="Search SLA rules by issue (e.g. pothole, streetlight, garbage, water burst)..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    id="input-sla-search"
                  />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={slaDeptFilter}
                    onChange={(e) => setSlaDeptFilter(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                    id="select-sla-dept-filter"
                  >
                    <option value="ALL">All Departments (10)</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SLA Rules Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlaRules.map((rule) => {
                const dept = departmentsMap.get(rule.departmentId);
                const isCritical = rule.priority === 'Critical';

                return (
                  <div
                    key={rule.id}
                    className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {rule.priority} Priority
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {rule.maxResolutionTimeHours} Hours SLA
                        </span>
                      </div>

                      <h4 className="mt-2.5 font-bold text-xs text-stone-900 leading-snug">
                        {rule.issueCategory}
                      </h4>

                      <div className="mt-2 text-[11px] text-stone-600">
                        <span className="text-stone-400">Department: </span>
                        <strong>{dept?.name || rule.departmentId}</strong>
                      </div>

                      <div className="mt-1 text-[11px] text-stone-600">
                        <span className="text-stone-400">Escalation Officer: </span>
                        <span>{rule.escalationOfficer}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10px] text-stone-500 font-medium">
                      <strong className="text-stone-700">Enforcement: </strong>
                      {rule.penaltyClause}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSlaRules.length === 0 && (
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
                <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">No SLA rules found for &quot;{slaSearchQuery}&quot;</p>
                <p className="text-xs mt-1">Try searching for &quot;water&quot;, &quot;road&quot;, &quot;streetlight&quot;, or &quot;garbage&quot;.</p>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: COMPLAINT HISTORY */}
        {/* =================================================================== */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-600" />
                  Your Filed Complaints History
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Showing all multi-department submissions registered with phone {session.identifier}.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('FILE_COMPLAINT')}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 w-fit"
              >
                <PlusCircle className="w-4 h-4" />
                <span>File New Complaint</span>
              </button>
            </div>

            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {c.id}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Filed on {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-600">
                          • {c.administrativeWard}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-stone-900 mt-1.5">{c.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          c.overallStatus === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.overallStatus === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.overallStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">{c.description}</p>

                  {/* Multi-department routing split indicators */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                      Multi-Department Routing Status ({c.routedDepartments.length} Departments):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {c.routedDepartments.map((rd, i) => {
                        const dept = departmentsMap.get(rd.departmentId);
                        return (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 text-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-stone-800">
                              <span>{dept?.code || rd.departmentId}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                  rd.status === 'RESOLVED'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : rd.status === 'IN_PROGRESS'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {rd.status}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 mt-1">
                              Keywords: {rd.matchedKeywords.join(', ')}
                            </div>
                            {rd.notes && (
                              <div className="text-[10px] text-stone-700 font-medium mt-1 pt-1 border-t border-stone-200">
                                Note: {rd.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs pt-2">
                    <span className="text-stone-500 text-[11px]">
                      Location: {c.location.address}
                    </span>
                    <button
                      onClick={() => {
                        setTrackingId(c.id);
                        setActiveTab('TRACK_STATUS');
                      }}
                      className="font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                    >
                      <span>Track Full Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: TRACK STATUS OF PROCESS */}
        {/* =================================================================== */}
        {activeTab === 'TRACK_STATUS' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search Box */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                Track Status of Process
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 mb-4">
                Enter your Complaint Token (e.g. LOK-2026-CMP-8492) or choose from your recent submissions.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Complaint Token (e.g. LOK-2026-CMP-8492)..."
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono font-semibold uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    const match = complaints.find(
                      (c) => c.id.toLowerCase() === trackingId.trim().toLowerCase()
                    );
                    setSelectedComplaint(match || null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
                >
                  Verify & Track
                </button>
              </div>

              {/* Quick links to existing complaints */}
              <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
                <span className="text-stone-400 text-[11px]">Quick Track:</span>
                {complaints.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setTrackingId(c.id);
                      setSelectedComplaint(c);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-mono text-[11px] font-semibold transition-colors"
                  >
                    {c.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking Result View */}
            {selectedComplaint ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-stone-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {selectedComplaint.id}
                      </span>
                      <span className="text-xs text-stone-500">
                        {selectedComplaint.administrativeWard}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-stone-900 mt-1">
                      {selectedComplaint.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Status: {selectedComplaint.overallStatus}
                    </span>
                    <p className="text-[10px] text-stone-400 mt-1">
                      SLA Target: {selectedComplaint.slaHours} Hours
                    </p>
                  </div>
                </div>

                {/* Overall Step-by-Step Process Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                    Lifecycle Timeline Stages:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[
                      { step: '1', title: 'Submitted', done: true, time: 'T+0h' },
                      { step: '2', title: 'Auto-Routed', done: true, time: 'T+2min' },
                      {
                        step: '3',
                        title: 'Dept Accepted',
                        done: selectedComplaint.overallStatus !== 'SUBMITTED',
                        time: 'T+1h',
                      },
                      {
                        step: '4',
                        title: 'Field In-Progress',
                        done: ['IN_PROGRESS', 'RESOLVED'].includes(selectedComplaint.overallStatus),
                        time: 'T+4h',
                      },
                      {
                        step: '5',
                        title: 'Resolved & Closed',
                        done: selectedComplaint.overallStatus === 'RESOLVED',
                        time: 'Verified',
                      },
                    ].map((st, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-center relative ${
                          st.done
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-stone-50 border-stone-200 text-stone-400'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center font-bold text-xs mb-1.5 ${
                            st.done ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-white'
                          }`}
                        >
                          {st.done ? '✓' : st.step}
                        </div>
                        <div className="text-xs font-bold">{st.title}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{st.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Per-Department Parallel Execution Split */}
                <div className="pt-4 border-t border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                    Per-Department Action Queue & Officer Remarks:
                  </h4>

                  <div className="space-y-3">
                    {selectedComplaint.routedDepartments.map((rd, i) => {
                      const dept = departmentsMap.get(rd.departmentId);
                      return (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700">
                              <Building className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-stone-900">
                                {dept?.name || rd.departmentId}
                              </div>
                              <div className="text-[11px] text-stone-500">
                                Triggered by keywords:{' '}
                                <strong>{rd.matchedKeywords.join(', ')}</strong>
                              </div>
                              {rd.assignedOfficer && (
                                <div className="text-[11px] text-stone-600 mt-0.5">
                                  Assigned Officer: <strong>{rd.assignedOfficer}</strong>
                                </div>
                              )}
                              {rd.notes && (
                                <div className="text-xs text-stone-800 bg-white p-2 rounded-lg border border-stone-200 mt-1.5">
                                  Officer Remarks: &quot;{rd.notes}&quot;
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                rd.status === 'RESOLVED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : rd.status === 'IN_PROGRESS'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {rd.status}
                            </span>
                            <div className="text-[10px] text-stone-400 mt-1">
                              Last updated: {new Date(rd.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
                <FileSearch className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="font-bold text-sm text-stone-700">Select or enter a complaint token to inspect live progress</p>
                <p className="text-xs text-stone-500 mt-1">
                  You can click any of the tokens in the quick track list above or from your Complaint History tab.
                </p>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: NOTIFICATION */}
        {/* =================================================================== */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  Citizen Notification Feed
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Automated SMS, Email, and Department Dispatch alerts for your grievances.
                </p>
              </div>

              <span className="text-xs font-semibold text-stone-500">
                {unreadNotifsCount} Unread
              </span>
            </div>

            <div className="space-y-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkNotificationRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    notif.read
                      ? 'bg-white border-stone-200 text-stone-700'
                      : 'bg-amber-50/70 border-amber-300 text-stone-900 font-semibold'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        notif.type === 'complaint'
                          ? 'bg-amber-100 text-amber-700'
                          : notif.type === 'order'
                          ? 'bg-blue-100 text-blue-700'
                          : notif.type === 'sla'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{notif.title}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Citizen AI Assistant Floating Icon on bottom-right corner */}
      <CitizenAIAssistant
        language={language}
        citizenName={session.name}
        activeWard={administrativeWard}
      />
    </div>
  );
};
