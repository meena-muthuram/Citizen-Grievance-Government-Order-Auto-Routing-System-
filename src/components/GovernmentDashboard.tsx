import React, { useState, useMemo } from 'react';
import {
  Complaint,
  GovernmentOrder,
  SLARule,
  NotificationItem,
  UserSession,
  LanguageCode,
  KeywordMapping,
  DepartmentId,
  Department,
  RoutingStatus,
} from '../types';
import { EmblemOfIndia } from './EmblemOfIndia';
import { AutoRoutingPreview } from './AutoRoutingPreview';
import { ADMINISTRATIVE_WARDS, WardInfo } from '../data/initialData';
import { DEPARTMENTS, routeTextToDepartments } from '../data/departmentsAndKeywords';
import { ALL_INDIAN_LANGUAGES, getTranslation } from '../data/languages';
import {
  Menu,
  X,
  FileSignature,
  LayoutDashboard,
  Inbox,
  Layers,
  Settings,
  MapPin,
  Bell,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  Tag,
  Share2,
  Sparkles,
  RefreshCw,
  Building2,
  UserCheck,
  Check,
  XCircle,
  FileText,
  Calendar,
  Shield,
  Activity,
  ArrowRight,
  Flame,
  Droplets,
  Zap,
  Hammer,
  GraduationCap,
  Bus,
  ChevronRight,
} from 'lucide-react';

interface GovernmentDashboardProps {
  session: UserSession;
  complaints: Complaint[];
  orders: GovernmentOrder[];
  slaRules: SLARule[];
  notifications: NotificationItem[];
  keywordsDatabase: KeywordMapping[];
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onAddOrder: (newOrder: GovernmentOrder) => void;
  onUpdateComplaintRoutingStatus: (
    complaintId: string,
    deptId: DepartmentId,
    newStatus: RoutingStatus,
    notes?: string
  ) => void;
  onAddKeyword: (mapping: KeywordMapping) => void;
  onDeleteKeyword: (id: string) => void;
  onAddDepartment: (dept: Department) => void;
  onSignOut: () => void;
}

type GovtTab =
  | 'OVERVIEW'
  | 'ISSUE_ORDER'
  | 'ALL_COMPLAINTS'
  | 'ALL_ORDERS'
  | 'DEPARTMENT_QUEUES'
  | 'ROUTING_ADMIN'
  | 'GRIEVANCE_MAP';

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  session,
  complaints,
  orders,
  slaRules,
  notifications,
  keywordsDatabase,
  language,
  onLanguageChange,
  onAddOrder,
  onUpdateComplaintRoutingStatus,
  onAddKeyword,
  onDeleteKeyword,
  onAddDepartment,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<GovtTab>('OVERVIEW');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Issue Order Form State
  const [orderTitle, setOrderTitle] = useState('');
  const [orderDesc, setOrderDesc] = useState('');
  const [orderUrgency, setOrderUrgency] = useState<'Routine' | 'Priority' | 'Emergency'>('Emergency');
  const [orderTargetDate, setOrderTargetDate] = useState('2026-09-20');
  const [orderWards, setOrderWards] = useState('All Wards (District-Wide Directive)');
  const [orderAuthority, setOrderAuthority] = useState(session.name || 'Smt. Vandana Rao, IAS');
  const [orderDesignation, setOrderDesignation] = useState('District Magistrate & Collector');
  const [orderIssuedSuccess, setOrderIssuedSuccess] = useState<string | null>(null);

  // Department Queue filter state
  const [selectedQueueDept, setSelectedQueueDept] = useState<DepartmentId>(
    (session.officialDepartmentId && session.officialDepartmentId !== 'ALL'
      ? session.officialDepartmentId
      : 'PWD') as DepartmentId
  );
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>('ALL');

  // Search & Filters for All Complaints / All Orders
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintDeptFilter, setComplaintDeptFilter] = useState<string>('ALL');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState<string>('ALL');
  const [selectedComplaintDetail, setSelectedComplaintDetail] = useState<Complaint | null>(null);

  // Action status modal/inline state
  const [actionNotes, setActionNotes] = useState('');

  // Routing Rules Admin state
  const [newKeywordText, setNewKeywordText] = useState('');
  const [newKeywordDept, setNewKeywordDept] = useState<DepartmentId>('PWD');
  const [newKeywordCategory, setNewKeywordCategory] = useState('Roads');
  const [adminSearch, setAdminSearch] = useState('');

  // New Department Form State
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptCategory, setNewDeptCategory] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  // Grievance Map State
  const [selectedWardForMap, setSelectedWardForMap] = useState<WardInfo | null>(ADMINISTRATIVE_WARDS[2]);

  // Smart Re-Routing State
  const [smartReRouteComplaintId, setSmartReRouteComplaintId] = useState('');
  const [smartReRouteTargetDept, setSmartReRouteTargetDept] = useState<DepartmentId>('MUNICIPAL');
  const [smartReRouteReason, setSmartReRouteReason] = useState('Reassigned due to mixed road and drain jurisdiction.');
  const [smartReRouteSuccess, setSmartReRouteSuccess] = useState(false);

  const t = getTranslation(language);

  // Stats Calculations
  const stats = useMemo(() => {
    const totalComplaints = complaints.length;
    const totalOrders = orders.length;

    let pendingRoutings = 0;
    let resolvedItems = 0;

    for (const c of complaints) {
      if (c.overallStatus === 'RESOLVED') resolvedItems++;
      for (const rd of c.routedDepartments) {
        if (rd.status === 'PENDING') pendingRoutings++;
      }
    }

    return {
      totalComplaints,
      totalOrders,
      pendingRoutings,
      resolvedItems,
      slaComplianceRate: '94.2%',
    };
  }, [complaints, orders]);

  // Department Workload Breakdown
  const deptWorkloads = useMemo(() => {
    const counts: Record<DepartmentId, { total: number; resolved: number; pending: number; inProgress: number }> = {
      PWD: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      WATER: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      ELECTRICITY: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      HEALTH: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      MUNICIPAL: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      POLICE: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      EDUCATION: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      REVENUE: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      TRANSPORT: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
      FIRE: { total: 0, resolved: 0, pending: 0, inProgress: 0 },
    };

    for (const c of complaints) {
      for (const rd of c.routedDepartments) {
        if (counts[rd.departmentId]) {
          counts[rd.departmentId].total++;
          if (rd.status === 'RESOLVED') counts[rd.departmentId].resolved++;
          else if (rd.status === 'IN_PROGRESS') counts[rd.departmentId].inProgress++;
          else counts[rd.departmentId].pending++;
        }
      }
    }

    return counts;
  }, [complaints]);

  // Repeated Complaints Detector
  const repeatedComplaintsByWard = useMemo(() => {
    // Check which wards have multiple complaints
    const wardMap: Record<string, Complaint[]> = {};
    for (const c of complaints) {
      if (!wardMap[c.administrativeWard]) wardMap[c.administrativeWard] = [];
      wardMap[c.administrativeWard].push(c);
    }

    const clusters: { wardId: string; count: number; complaints: Complaint[]; reason: string }[] = [];
    for (const [wardId, list] of Object.entries(wardMap)) {
      if (list.length >= 2) {
        clusters.push({
          wardId,
          count: list.length,
          complaints: list,
          reason: `High concentration: ${list.length} civic complaints reported within this administrative zone.`,
        });
      }
    }
    return clusters;
  }, [complaints]);

  // Handle Order Submission with auto-generated order number
  const handleIssueOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle.trim() || !orderDesc.trim()) {
      alert('Please fill order title and directives.');
      return;
    }

    const newOrderNo = `GO/2026/DL-DIST/${Math.floor(1000 + Math.random() * 9000)}`;
    const combined = `${orderTitle} ${orderDesc}`;
    const routed = routeTextToDepartments(combined, keywordsDatabase);

    const finalRouted =
      routed.length > 0
        ? routed
        : [
            {
              departmentId: 'PWD' as const,
              matchedKeywords: ['district directive'],
              status: 'PENDING' as const,
              updatedAt: new Date().toISOString(),
            },
          ];

    const newOrder: GovernmentOrder = {
      id: `GO-2026-DIST-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: newOrderNo,
      title: orderTitle.trim(),
      description: orderDesc.trim(),
      issuingAuthority: orderAuthority,
      designation: orderDesignation,
      targetDate: orderTargetDate,
      urgency: orderUrgency,
      administrativeWard: orderWards,
      routedDepartments: finalRouted,
      status: 'ISSUED',
      createdAt: new Date().toISOString(),
      signatorySeal: 'SEAL_OF_DISTRICT_MAGISTRATE_IAS',
    };

    onAddOrder(newOrder);
    setOrderIssuedSuccess(newOrderNo);
    setOrderTitle('');
    setOrderDesc('');
  };

  // Filtered Complaints for All Complaints Table
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(complaintSearch.toLowerCase());

    const matchesDept =
      complaintDeptFilter === 'ALL' ||
      c.routedDepartments.some((rd) => rd.departmentId === complaintDeptFilter);

    const matchesStatus =
      complaintStatusFilter === 'ALL' || c.overallStatus === complaintStatusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Department Queue Items
  const departmentQueueItems = useMemo(() => {
    const items: { complaint: Complaint; routedDept: any }[] = [];
    for (const c of complaints) {
      for (const rd of c.routedDepartments) {
        if (rd.departmentId === selectedQueueDept) {
          if (queueStatusFilter === 'ALL' || rd.status === queueStatusFilter) {
            items.push({ complaint: c, routedDept: rd });
          }
        }
      }
    }
    return items;
  }, [complaints, selectedQueueDept, queueStatusFilter]);

  // Keyword filter for admin
  const filteredKeywords = keywordsDatabase.filter(
    (kw) =>
      kw.keyword.toLowerCase().includes(adminSearch.toLowerCase()) ||
      kw.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
      kw.departmentId.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const departmentsMap = new Map(DEPARTMENTS.map((d) => [d.id, d]));

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Hamburger menu */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              id="official-hamburger-menu"
              aria-label="Open Officials Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Emblem & Title */}
            <div className="flex items-center space-x-2.5">
              <EmblemOfIndia size="sm" showText={false} theme="dark" />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  LokSeva Officials Command Center
                </h1>
                <p className="text-[11px] text-amber-400 font-medium">
                  {session.designation || 'District Administration & Multi-Department Auto-Routing'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Multi-language selection */}
            <div className="flex items-center space-x-1.5 bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-stone-400 hidden sm:inline">Lang:</span>
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
                id="official-language-select"
                aria-label="Select Indian Language"
              >
                {ALL_INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-stone-900 text-white">
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Officer Badge */}
            <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-stone-800 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-extrabold flex items-center justify-center">
                {session.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-bold text-white leading-none">{session.name}</div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {session.officialDepartmentId === 'ALL'
                    ? 'Collectorate (All 10 Depts)'
                    : `${session.officialDepartmentId} Officer`}
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl text-rose-400 hover:bg-stone-800 transition-colors"
              title="Sign Out"
              id="official-signout-btn"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar for Government Officials */}
      {/* Note: "File Citizen Complaint" has been removed for Government Officials as explicitly requested */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar space-x-1 py-1.5">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-govt-overview"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('ISSUE_ORDER')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ISSUE_ORDER'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-govt-issue-order"
          >
            <FileSignature className="w-4 h-4 text-amber-500" />
            <span>Issue Government Order</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL_COMPLAINTS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ALL_COMPLAINTS'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-govt-all-complaints"
          >
            <Inbox className="w-4 h-4 text-amber-500" />
            <span>All Complaints ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL_ORDERS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ALL_ORDERS'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-govt-all-orders"
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>All Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DEPARTMENT_QUEUES')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'DEPARTMENT_QUEUES'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-govt-department-queues"
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Department Queues</span>
          </button>

          <button
            onClick={() => setActiveTab('GRIEVANCE_MAP')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'GRIEVANCE_MAP'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-govt-grievance-map"
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Grievance Map & Repeat Detector</span>
          </button>

          <button
            onClick={() => setActiveTab('ROUTING_ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ROUTING_ADMIN'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
            id="tab-govt-routing-admin"
          >
            <Settings className="w-4 h-4 text-amber-500" />
            <span>Routing Rules Admin</span>
          </button>
        </div>
      </div>

      {/* Hamburger Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-full bg-stone-900 text-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <EmblemOfIndia size="sm" showText={false} theme="dark" />
                  <div>
                    <h2 className="font-extrabold text-sm text-white">Officials Menu</h2>
                    <p className="text-[11px] text-stone-400">Governance Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3 space-y-1">
                {[
                  { id: 'OVERVIEW', label: 'Dashboard Overview', icon: LayoutDashboard },
                  { id: 'ISSUE_ORDER', label: 'Issue Government Order', icon: FileSignature },
                  { id: 'ALL_COMPLAINTS', label: 'All Complaints', icon: Inbox },
                  { id: 'ALL_ORDERS', label: 'All Government Orders', icon: FileText },
                  { id: 'DEPARTMENT_QUEUES', label: 'Department Queues', icon: Layers },
                  { id: 'GRIEVANCE_MAP', label: 'Grievance Map & Repeat Issues', icon: MapPin },
                  { id: 'ROUTING_ADMIN', label: 'Routing Rules Admin', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as GovtTab);
                        setDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-amber-600 text-white'
                          : 'text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-950">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onSignOut();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-950/50 text-rose-300 font-bold text-xs hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-2 border border-rose-800/50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* =================================================================== */}
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {/* =================================================================== */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Total Complaints
                  </span>
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Inbox className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-stone-900">{stats.totalComplaints}</div>
                <div className="mt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100% Multi-Routed</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Government Orders
                  </span>
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <FileSignature className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-stone-900">{stats.totalOrders}</div>
                <div className="mt-1 text-[11px] text-blue-700 font-semibold">
                  <span>Collectorate Directives</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Pending Routings
                  </span>
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-stone-900">{stats.pendingRoutings}</div>
                <div className="mt-1 text-[11px] text-amber-700 font-semibold">
                  <span>Awaiting Field Acceptance</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Resolved Items
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-stone-900">{stats.resolvedItems}</div>
                <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
                  <span>SLA Adherence: {stats.slaComplianceRate}</span>
                </div>
              </div>
            </div>

            {/* Department Workload Breakdown */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    Department Workload Breakdown (10 Government Departments)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Auto-routing volume distribution based on 80+ civic keyword triggers.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('DEPARTMENT_QUEUES')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>Manage Queues</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {DEPARTMENTS.map((dept) => {
                  const wl = deptWorkloads[dept.id] || { total: 0, resolved: 0, inProgress: 0, pending: 0 };
                  return (
                    <div
                      key={dept.id}
                      onClick={() => {
                        setSelectedQueueDept(dept.id);
                        setActiveTab('DEPARTMENT_QUEUES');
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-xs ${dept.bgColor} ${dept.borderColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-stone-900">{dept.code}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-stone-800 border border-stone-200">
                          {wl.total} Items
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-stone-600 mt-1 truncate">
                        {dept.name.split('(')[0]}
                      </div>

                      {/* Workload Progress Bar */}
                      <div className="mt-2.5 w-full bg-stone-200 h-1.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{
                            width: `${wl.total > 0 ? (wl.resolved / wl.total) * 100 : 0}%`,
                          }}
                          title="Resolved"
                        />
                        <div
                          className="bg-amber-500 h-full"
                          style={{
                            width: `${wl.total > 0 ? (wl.inProgress / wl.total) * 100 : 0}%`,
                          }}
                          title="In Progress"
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500">
                        <span>Res: {wl.resolved}</span>
                        <span>Prog: {wl.inProgress}</span>
                        <span>Pend: {wl.pending}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two Column Grid: Recent Activity Feed & Repeated Complaints Hotspot Alert */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Activity Feed */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-amber-600" />
                  Recent Multi-Routing Activity Feed
                </h3>

                <div className="space-y-3">
                  {complaints.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="font-mono text-amber-700">{c.id}</span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 mt-1">{c.title}</h4>
                      <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                        <span className="text-[10px] text-stone-500">Split to:</span>
                        {c.routedDepartments.map((rd, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white border border-stone-300 text-stone-800"
                          >
                            {rd.departmentId}
                          </span>
                        ))}
                        <span className="ml-auto text-[11px] font-semibold text-stone-600">
                          {c.administrativeWard}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeated Complaints Alert Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Repeated Complaints Radar
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    {repeatedComplaintsByWard.length} Wards Flagged
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Automated cluster detection flags geographic zones where citizens filed repeated complaints for the same infrastructure within 48h.
                </p>

                <div className="space-y-2.5">
                  {repeatedComplaintsByWard.map((cluster, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-rose-200 bg-rose-50/70 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-950">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-600" />
                          {cluster.wardId}
                        </span>
                        <span className="text-rose-700">{cluster.count} Complaints Clustered</span>
                      </div>
                      <p className="text-[11px] text-rose-800 mt-1">{cluster.reason}</p>
                      <button
                        onClick={() => {
                          const w = ADMINISTRATIVE_WARDS.find((item) => item.id === cluster.wardId);
                          if (w) setSelectedWardForMap(w);
                          setActiveTab('GRIEVANCE_MAP');
                        }}
                        className="mt-2 text-[11px] font-bold text-rose-900 underline flex items-center gap-1"
                      >
                        Inspect on Grievance Map <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: ISSUE A GOVERNMENT ORDER */}
        {/* =================================================================== */}
        {activeTab === 'ISSUE_ORDER' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                  <FileSignature className="w-3 h-3" />
                  District Collector Official Directives
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  Issue a Government Order (GO)
                </h2>
                <p className="text-xs text-stone-300 mt-1 max-w-2xl">
                  Official orders automatically receive an official order number and use the same multi-department routing engine — an order mentioning roads, water, and schools splits across three departments automatically!
                </p>
              </div>

              {/* Sample Directives Filler */}
              <button
                type="button"
                onClick={() => {
                  setOrderTitle('Comprehensive Monsoon Readiness & Infrastructure Reinforcement Directive');
                  setOrderDesc(
                    'All concerned executive departments are directed to immediately execute desilting of stormwater drains, repair arterial road potholes, test water pipeline purification tankers, and inspect all government school rooftops ahead of impending heavy rains.'
                  );
                  setOrderUrgency('Emergency');
                  setOrderTargetDate('2026-09-18');
                  setOrderWards('All Wards (Central, East, South Zones)');
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Sample Collector GO</span>
              </button>
            </div>

            {orderIssuedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Official Government Order Issued & Dispatched!</h4>
                    <p className="text-xs text-emerald-900 mt-0.5">
                      Order Number: <strong className="font-mono">{orderIssuedSuccess}</strong>. The order has been partitioned and transmitted to respective Department Heads with executive deadline enforcement.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOrderIssuedSuccess(null)}
                  className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* GO Form */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
                <form onSubmit={handleIssueOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Official Order Title / Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderTitle}
                      onChange={(e) => setOrderTitle(e.target.value)}
                      placeholder="e.g. Monsoon Disaster Prep & Arterial Roads Repair"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Detailed Directives & Department Mandates <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={orderDesc}
                      onChange={(e) => setOrderDesc(e.target.value)}
                      placeholder="Specify executive directives. Mentioning roads, water, schools, garbage, or hospitals will automatically split the order across respective departments with live preview."
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-800"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Urgency */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Urgency Level
                      </label>
                      <select
                        value={orderUrgency}
                        onChange={(e) => setOrderUrgency(e.target.value as any)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-800 font-medium"
                      >
                        <option value="Routine">Routine (General SLA)</option>
                        <option value="Priority">Priority (48h Target)</option>
                        <option value="Emergency">Emergency / Disaster (Immediate)</option>
                      </select>
                    </div>

                    {/* Target Completion Date */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Target Completion Date
                      </label>
                      <input
                        type="date"
                        value={orderTargetDate}
                        onChange={(e) => setOrderTargetDate(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-800"
                        required
                      />
                    </div>

                    {/* Wards Covered */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Applicable Jurisdiction
                      </label>
                      <input
                        type="text"
                        value={orderWards}
                        onChange={(e) => setOrderWards(e.target.value)}
                        placeholder="e.g. All Wards or Ward 3 & 5"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Issuing Authority Signature
                      </label>
                      <input
                        type="text"
                        value={orderAuthority}
                        onChange={(e) => setOrderAuthority(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Official Designation
                      </label>
                      <input
                        type="text"
                        value={orderDesignation}
                        onChange={(e) => setOrderDesignation(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    id="btn-issue-govt-order"
                  >
                    <FileSignature className="w-4 h-4 text-amber-400" />
                    <span>Generate Official Order & Auto-Dispatch</span>
                  </button>
                </form>
              </div>

              {/* Live Auto-Routing Preview for Order */}
              <div className="lg:col-span-5 space-y-4">
                <AutoRoutingPreview
                  text={`${orderTitle} ${orderDesc}`}
                  keywordsDatabase={keywordsDatabase}
                  mode="full"
                />

                <div className="rounded-xl border border-stone-200 bg-white p-4 text-xs text-stone-700 space-y-2 shadow-xs">
                  <div className="font-bold text-stone-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-stone-700" />
                    <span>Executive Order Dispatch Protocol:</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Under the National e-Governance standards, each department receiving a split of this order is held accountable under the Public Service Guarantee framework with automatic weekly compliance reporting to the District Collectorate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: ALL COMPLAINTS */}
        {/* =================================================================== */}
        {activeTab === 'ALL_COMPLAINTS' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-amber-600" />
                    All Registered Complaints ({filteredComplaints.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Searchable repository showing multi-department splits and per-department statuses.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={complaintSearch}
                    onChange={(e) => setComplaintSearch(e.target.value)}
                    placeholder="Search by title, token ID, citizen name, keyword..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-10 pr-3 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-800"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={complaintDeptFilter}
                    onChange={(e) => setComplaintDeptFilter(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900 font-medium"
                  >
                    <option value="ALL">All Routed Depts</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={complaintStatusFilter}
                    onChange={(e) => setComplaintStatusFilter(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-3 text-xs text-stone-900 font-medium"
                  >
                    <option value="ALL">All Overall Statuses</option>
                    <option value="ROUTED">ROUTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-3">
              {filteredComplaints.map((c) => (
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
                        <span className="text-xs font-semibold text-stone-600">
                          {c.administrativeWard}
                        </span>
                        <span className="text-xs text-stone-400">
                          Citizen: <strong>{c.citizenName}</strong> ({c.citizenContact})
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 mt-1">{c.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          c.overallStatus === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.overallStatus}
                      </span>
                      <button
                        onClick={() => setSelectedComplaintDetail(c)}
                        className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors"
                      >
                        Inspect & Update
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-2.5">{c.description}</p>

                  {/* Multi-department breakdown */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Routed Departments:
                    </span>
                    {c.routedDepartments.map((rd, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                      >
                        <span className="font-bold text-stone-800">{rd.departmentId}</span>
                        <span className="text-[10px] text-stone-500">
                          [{rd.matchedKeywords.join(', ')}]
                        </span>
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
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Modal for per-department updates */}
            {selectedComplaintDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-700">
                        {selectedComplaintDetail.id}
                      </span>
                      <h3 className="font-extrabold text-base text-stone-900 mt-0.5">
                        {selectedComplaintDetail.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedComplaintDetail(null)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {selectedComplaintDetail.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Per-Department Status Tracking & Officer Notes:
                    </h4>

                    {selectedComplaintDetail.routedDepartments.map((rd) => {
                      const dept = departmentsMap.get(rd.departmentId);
                      return (
                        <div
                          key={rd.departmentId}
                          className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-stone-900">
                              {dept?.name || rd.departmentId}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-stone-200">
                              Current: {rd.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-500">
                            Matched Keywords: <strong>{rd.matchedKeywords.join(', ')}</strong>
                          </div>

                          {rd.notes && (
                            <div className="text-xs text-stone-700 bg-white p-2 rounded border border-stone-200">
                              Last Note: &quot;{rd.notes}&quot;
                            </div>
                          )}

                          {/* Quick Action Buttons for Department Officers */}
                          <div className="pt-2 border-t border-stone-200 flex flex-wrap gap-1.5">
                            <button
                              onClick={() => {
                                onUpdateComplaintRoutingStatus(
                                  selectedComplaintDetail.id,
                                  rd.departmentId,
                                  'ACCEPTED',
                                  'Department officer acknowledged ticket and assigned field staff.'
                                );
                                setSelectedComplaintDetail(null);
                              }}
                              className="px-2.5 py-1 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                onUpdateComplaintRoutingStatus(
                                  selectedComplaintDetail.id,
                                  rd.departmentId,
                                  'IN_PROGRESS',
                                  'Inspection team on site. Repair operations in progress.'
                                );
                                setSelectedComplaintDetail(null);
                              }}
                              className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            >
                              In Progress
                            </button>
                            <button
                              onClick={() => {
                                onUpdateComplaintRoutingStatus(
                                  selectedComplaintDetail.id,
                                  rd.departmentId,
                                  'RESOLVED',
                                  'Field verification complete. Civic rectification completed successfully.'
                                );
                                setSelectedComplaintDetail(null);
                              }}
                              className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => {
                                onUpdateComplaintRoutingStatus(
                                  selectedComplaintDetail.id,
                                  rd.departmentId,
                                  'REJECTED',
                                  'Outside jurisdictional boundary or duplicate submission.'
                                );
                                setSelectedComplaintDetail(null);
                              }}
                              className="px-2.5 py-1 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 4: ALL ORDERS */}
        {/* =================================================================== */}
        {activeTab === 'ALL_ORDERS' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Official Government Orders Registry ({orders.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Directives issued by District Collectors and Departmental Chief Engineers.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('ISSUE_ORDER')}
                className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New GO</span>
              </button>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">
                          Target: {ord.targetDate}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                            ord.urgency === 'Emergency'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.urgency}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 mt-1">{ord.title}</h3>
                    </div>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{ord.description}</p>

                  <div className="pt-2 border-t border-stone-100">
                    <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                      Executing Departments ({ord.routedDepartments.length}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {ord.routedDepartments.map((rd, i) => {
                        const dept = departmentsMap.get(rd.departmentId);
                        return (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 text-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-stone-900">
                              <span>{dept?.code || rd.departmentId}</span>
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                {rd.status}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 mt-1">
                              Keywords: {rd.matchedKeywords.join(', ')}
                            </div>
                            {rd.notes && (
                              <div className="text-[10px] text-stone-600 mt-1 font-medium">
                                Remark: {rd.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between">
                    <span>
                      Issuing Authority: <strong>{ord.issuingAuthority}</strong> ({ord.designation})
                    </span>
                    <span className="font-mono text-[10px]">{ord.signatorySeal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 5: DEPARTMENT QUEUES */}
        {/* =================================================================== */}
        {activeTab === 'DEPARTMENT_QUEUES' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Department Queue Selector */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  Department Workload Queues
                </h2>
                <p className="text-xs text-stone-500">
                  Select a department to view and manage assigned complaints and orders.
                </p>
              </div>

              {/* Department Pills */}
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedQueueDept(dept.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedQueueDept === dept.id
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{dept.name.split('(')[0]}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20">
                      {deptWorkloads[dept.id]?.total || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Status Filter for Selected Department */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-500 font-semibold">
                  Queue for: <strong className="text-stone-900">{departmentsMap.get(selectedQueueDept)?.name}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400">Filter Status:</span>
                  <select
                    value={queueStatusFilter}
                    onChange={(e) => setQueueStatusFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-800"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Department Queue Items List */}
            <div className="space-y-3">
              {departmentQueueItems.map(({ complaint, routedDept }) => (
                <div
                  key={`${complaint.id}-${routedDept.departmentId}`}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {complaint.id}
                      </span>
                      <span className="text-xs font-semibold text-stone-600">
                        {complaint.administrativeWard}
                      </span>
                      <span className="text-xs text-stone-400">
                        Citizen: {complaint.citizenName}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900">{complaint.title}</h4>
                    <p className="text-xs text-stone-600">{complaint.description}</p>

                    <div className="text-[11px] text-stone-500 pt-1 flex items-center gap-2">
                      <span>Triggered by:</span>
                      {routedDept.matchedKeywords.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-stone-100 font-semibold text-stone-800 border border-stone-200"
                        >
                          &quot;{kw}&quot;
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Status Actions */}
                  <div className="shrink-0 flex flex-col sm:items-end gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        routedDept.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : routedDept.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      Status: {routedDept.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          onUpdateComplaintRoutingStatus(
                            complaint.id,
                            routedDept.departmentId,
                            'IN_PROGRESS',
                            'Work order issued to field maintenance unit.'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() =>
                          onUpdateComplaintRoutingStatus(
                            complaint.id,
                            routedDept.departmentId,
                            'RESOLVED',
                            'Field engineer verified completion with civic photo report.'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {departmentQueueItems.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-sm text-stone-800">No pending items in this queue!</p>
                  <p className="text-xs text-stone-500 mt-1">All tickets for this department have been addressed.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 6: GRIEVANCE MAP & REPEATED COMPLAINTS DETECTOR */}
        {/* =================================================================== */}
        {activeTab === 'GRIEVANCE_MAP' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    Civic Grievance Map & Repeated Complaints Radar
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Spatial visualization across administrative wards with automatic cluster detection for repeated infrastructure failures.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Low (0-3)
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Medium (4-7)
                  </span>
                  <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Hotspot (8+)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive Ward Grid Map */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Interactive Administrative Ward Grid (Click to Inspect)
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">12 Wards Monitored</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ADMINISTRATIVE_WARDS.map((ward) => {
                    const isSelected = selectedWardForMap?.id === ward.id;
                    const isHotspot = ward.activeComplaints >= 7;

                    return (
                      <button
                        key={ward.id}
                        type="button"
                        onClick={() => setSelectedWardForMap(ward)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                            : isHotspot
                            ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {ward.repeatedIssuesCount > 0 && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                            {ward.repeatedIssuesCount} Repeats
                          </span>
                        )}

                        <div className="font-extrabold text-xs text-stone-900 truncate">
                          {ward.name.split('-')[1] || ward.name}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">{ward.zone}</div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-stone-400 font-mono">{ward.id}</span>
                          <span
                            className={`font-extrabold ${
                              isHotspot ? 'text-rose-700' : 'text-stone-700'
                            }`}
                          >
                            {ward.activeComplaints} Active
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Repeated Complaints Detection Banner */}
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                    <span>AI Repeated Complaint Detection Engine:</span>
                  </div>
                  <p className="text-[11px] text-rose-900/90 leading-relaxed">
                    The portal continuously evaluates spatial proximity and keywords. When 2 or more complaints regarding the same defect (such as potholes or sewage leaks) are logged within 300 meters, an automated SLA escalation trigger is notified to the District Collector.
                  </p>
                </div>
              </div>

              {/* Selected Ward Detail Panel */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                {selectedWardForMap ? (
                  <>
                    <div className="border-b border-stone-200 pb-3">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {selectedWardForMap.id}
                      </span>
                      <h3 className="font-extrabold text-sm text-stone-900 mt-1">
                        {selectedWardForMap.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">{selectedWardForMap.zone}</p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">Zonal Councillor:</span>
                        <span className="font-bold text-stone-800">{selectedWardForMap.councillor}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">GPS Coordinates:</span>
                        <span className="font-mono text-stone-800">
                          {selectedWardForMap.lat}, {selectedWardForMap.lng}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">Active Grievances:</span>
                        <span className="font-bold text-stone-900">{selectedWardForMap.activeComplaints}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-500">Repeated Defects:</span>
                        <span className="font-bold text-rose-700">
                          {selectedWardForMap.repeatedIssuesCount} Clusters Detected
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Complaints in this Ward:
                      </h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {complaints
                          .filter((c) => c.administrativeWard === selectedWardForMap.id)
                          .map((c) => (
                            <div key={c.id} className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 text-xs">
                              <div className="font-mono text-[10px] font-bold text-amber-700">{c.id}</div>
                              <div className="font-bold text-stone-900 mt-0.5">{c.title}</div>
                              <div className="text-[10px] text-stone-500 mt-0.5">{c.overallStatus}</div>
                            </div>
                          ))}
                        {complaints.filter((c) => c.administrativeWard === selectedWardForMap.id).length === 0 && (
                          <p className="text-xs text-stone-400 italic">No open grievances logged for this ward.</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-stone-400">Select a ward to inspect.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 7: ROUTING RULES ADMIN & SMART RE-ROUTING */}
        {/* =================================================================== */}
        {activeTab === 'ROUTING_ADMIN' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-600" />
                  Routing Rules & Keyword Dictionary Administration
                </h2>
                <p className="text-xs text-stone-500">
                  Manage the 80+ keyword mappings across 10 government departments and execute smart re-routing.
                </p>
              </div>

              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Department</span>
              </button>
            </div>

            {/* Smart Re-Routing Tool */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950 mb-1">
                <Share2 className="w-4 h-4 text-amber-700" />
                <span>Smart Re-Routing Engine</span>
              </div>
              <p className="text-xs text-amber-900/80 mb-3">
                Reassign misallocated grievances to the correct authority with an audit note.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">Select Complaint</label>
                  <select
                    value={smartReRouteComplaintId}
                    onChange={(e) => setSmartReRouteComplaintId(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl py-2 px-3 text-xs text-stone-900 font-medium"
                  >
                    <option value="">-- Choose Complaint --</option>
                    {complaints.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} - {c.title.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">Re-Route To Department</label>
                  <select
                    value={smartReRouteTargetDept}
                    onChange={(e) => setSmartReRouteTargetDept(e.target.value as DepartmentId)}
                    className="w-full bg-white border border-amber-300 rounded-xl py-2 px-3 text-xs text-stone-900 font-medium"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4 flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!smartReRouteComplaintId) {
                        alert('Please select a complaint to re-route.');
                        return;
                      }
                      onUpdateComplaintRoutingStatus(
                        smartReRouteComplaintId,
                        smartReRouteTargetDept,
                        'PENDING',
                        `Smart Re-Routed by Admin: ${smartReRouteReason}`
                      );
                      setSmartReRouteSuccess(true);
                      setTimeout(() => setSmartReRouteSuccess(false), 3000);
                    }}
                    className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Execute Smart Re-Route
                  </button>
                </div>
              </div>

              {smartReRouteSuccess && (
                <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-lg">
                  ✓ Successfully Re-Routed complaint to {smartReRouteTargetDept}!
                </div>
              )}
            </div>

            {/* Keyword Dictionary Management */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  Active Keyword Dictionary ({keywordsDatabase.length} Keywords)
                </h3>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search keywords or departments..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg py-1.5 pl-8 pr-3 text-xs text-stone-900"
                  />
                </div>
              </div>

              {/* Add New Keyword Form */}
              <div className="p-3.5 rounded-xl border border-dashed border-stone-300 bg-stone-50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">New Keyword / Phrase</label>
                  <input
                    type="text"
                    value={newKeywordText}
                    onChange={(e) => setNewKeywordText(e.target.value)}
                    placeholder="e.g. broken divider, dengue larva, gas smell"
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-3 text-xs text-stone-900"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Target Department</label>
                  <select
                    value={newKeywordDept}
                    onChange={(e) => setNewKeywordDept(e.target.value as DepartmentId)}
                    className="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 text-xs text-stone-900 font-medium"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newKeywordText.trim()) return;
                      onAddKeyword({
                        id: `kw-custom-${Date.now()}`,
                        keyword: newKeywordText.trim().toLowerCase(),
                        departmentId: newKeywordDept,
                        category: newKeywordCategory,
                        weight: 1.0,
                      });
                      setNewKeywordText('');
                    }}
                    className="w-full py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    + Add Keyword
                  </button>
                </div>
              </div>

              {/* Keywords Tag Cloud */}
              <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto pt-2">
                {filteredKeywords.map((item) => {
                  const dept = departmentsMap.get(item.departmentId);
                  return (
                    <div
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-xs hover:border-amber-400 group"
                    >
                      <span className="font-bold text-stone-900">&quot;{item.keyword}&quot;</span>
                      <span className="text-[10px] text-stone-500">→ {dept?.code || item.departmentId}</span>
                      <button
                        onClick={() => onDeleteKeyword(item.id)}
                        className="text-stone-300 hover:text-rose-600 transition-colors ml-1"
                        title="Delete keyword"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal to Add New Department */}
            {showAddDeptModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-bold text-sm text-stone-900">Add New Department to Portal</h3>
                    <button
                      onClick={() => setShowAddDeptModal(false)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Department Name</label>
                      <input
                        type="text"
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        placeholder="e.g. Pollution Control Board (PCB)"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Department Code</label>
                      <input
                        type="text"
                        value={newDeptCode}
                        onChange={(e) => setNewDeptCode(e.target.value)}
                        placeholder="e.g. PCB"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={newDeptCategory}
                        onChange={(e) => setNewDeptCategory(e.target.value)}
                        placeholder="e.g. Environment & Air Quality"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Head Officer Name</label>
                      <input
                        type="text"
                        value={newDeptHead}
                        onChange={(e) => setNewDeptHead(e.target.value)}
                        placeholder="e.g. Dr. K. Ramanathan, Member Secretary"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newDeptName.trim() || !newDeptCode.trim()) return;
                        onAddDepartment({
                          id: newDeptCode.trim().toUpperCase() as DepartmentId,
                          name: newDeptName.trim(),
                          hindiName: newDeptName.trim(),
                          code: newDeptCode.trim().toUpperCase(),
                          category: newDeptCategory.trim() || 'Civic Services',
                          icon: 'Building2',
                          color: 'text-teal-700',
                          bgColor: 'bg-teal-50',
                          borderColor: 'border-teal-200',
                          headOfficer: newDeptHead.trim() || 'Officer in Charge',
                          contactEmail: `${newDeptCode.toLowerCase()}@gov.in`,
                          contactPhone: '011-23091099',
                          slaDefaultHours: 48,
                        });
                        setShowAddDeptModal(false);
                        setNewDeptName('');
                        setNewDeptCode('');
                      }}
                      className="w-full py-2.5 px-3 bg-stone-900 text-white rounded-xl font-bold text-xs hover:bg-stone-800 transition-colors"
                    >
                      Save Department
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
