import React, { useState } from 'react';
import {
  UserSession,
  LanguageCode,
  Complaint,
  GovernmentOrder,
  SLARule,
  NotificationItem,
  KeywordMapping,
  Department,
  DepartmentId,
  RoutingStatus,
} from './types';
import { PortalLogin } from './components/PortalLogin';
import { CitizenDashboard } from './components/CitizenDashboard';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import {
  INITIAL_COMPLAINTS,
  INITIAL_ORDERS,
  INITIAL_SLA_RULES,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { KEYWORD_DATABASE, DEPARTMENTS } from './data/departmentsAndKeywords';

export default function App() {
  // Session State: null represents Login Page
  const [session, setSession] = useState<UserSession | null>(null);

  // Global Language Selection across Portal
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Core Data Stores
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [orders, setOrders] = useState<GovernmentOrder[]>(INITIAL_ORDERS);
  const [slaRules, setSlaRules] = useState<SLARule[]>(INITIAL_SLA_RULES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [keywordsDatabase, setKeywordsDatabase] = useState<KeywordMapping[]>(KEYWORD_DATABASE);
  const [departmentsList, setDepartmentsList] = useState<Department[]>(DEPARTMENTS);

  // Handle Login
  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);

    // Push login notification
    const welcomeNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Welcome, ${newSession.name}`,
      message:
        newSession.role === 'CITIZEN'
          ? 'You have logged into the Citizen Services Dashboard. You can file multi-department grievances and track SLA status.'
          : `Authenticated to Government Officials Command Center (${newSession.designation || 'District Official'}).`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setSession(null);
  };

  // Add Complaint (Citizen)
  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);

    // Send automated notification
    const deptNames = newComplaint.routedDepartments.map((d) => d.departmentId).join(', ');
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Complaint Registered & Routed: ${newComplaint.id}`,
      message: `Your grievance has been auto-partitioned and dispatched to: ${deptNames}. Guaranteed SLA tracking is active.`,
      timestamp: 'Just now',
      read: false,
      type: 'complaint',
      referenceId: newComplaint.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add Government Order (Official)
  const handleAddOrder = (newOrder: GovernmentOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Send automated order dispatch notification
    const deptCodes = newOrder.routedDepartments.map((d) => d.departmentId).join(', ');
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Executive Order Issued: ${newOrder.orderNumber}`,
      message: `Collectorate Directive "${newOrder.title}" auto-split to: ${deptCodes} with target deadline ${newOrder.targetDate}.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      referenceId: newOrder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Update Department Routing Status on a Complaint (Accept, In Progress, Resolved, Rejected)
  const handleUpdateComplaintRoutingStatus = (
    complaintId: string,
    deptId: DepartmentId,
    newStatus: RoutingStatus,
    notes?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const updatedRouted = c.routedDepartments.map((rd) => {
          if (rd.departmentId === deptId) {
            return {
              ...rd,
              status: newStatus,
              notes: notes || rd.notes,
              updatedAt: new Date().toISOString(),
            };
          }
          return rd;
        });

        // Evaluate overall status
        const allResolved = updatedRouted.every((r) => r.status === 'RESOLVED');
        const anyInProgress = updatedRouted.some((r) => r.status === 'IN_PROGRESS');
        const anyAccepted = updatedRouted.some((r) => r.status === 'ACCEPTED');

        let nextOverall: 'SUBMITTED' | 'ROUTED' | 'IN_PROGRESS' | 'RESOLVED' = c.overallStatus;
        if (allResolved) {
          nextOverall = 'RESOLVED';
        } else if (anyInProgress || anyAccepted) {
          nextOverall = 'IN_PROGRESS';
        }

        return {
          ...c,
          routedDepartments: updatedRouted,
          overallStatus: nextOverall,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Notify citizen of the update
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Status Updated for ${complaintId}`,
      message: `Department ${deptId} updated task status to: ${newStatus}.${notes ? ` Remark: "${notes}"` : ''}`,
      timestamp: 'Just now',
      read: false,
      type: 'complaint',
      referenceId: complaintId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Admin: Add Keyword
  const handleAddKeyword = (mapping: KeywordMapping) => {
    setKeywordsDatabase((prev) => [mapping, ...prev]);
  };

  // Admin: Delete Keyword
  const handleDeleteKeyword = (id: string) => {
    setKeywordsDatabase((prev) => prev.filter((kw) => kw.id !== id));
  };

  // Admin: Add Department
  const handleAddDepartment = (dept: Department) => {
    setDepartmentsList((prev) => [...prev, dept]);
  };

  // Mark notification as read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // If not logged in, render the Portal Login Page
  if (!session) {
    return (
      <PortalLogin
        onLogin={handleLogin}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  // If Citizen, render Citizen Dashboard
  if (session.role === 'CITIZEN') {
    return (
      <CitizenDashboard
        session={session}
        complaints={complaints}
        slaRules={slaRules}
        notifications={notifications}
        keywordsDatabase={keywordsDatabase}
        language={language}
        onLanguageChange={setLanguage}
        onAddComplaint={handleAddComplaint}
        onSignOut={handleSignOut}
        onMarkNotificationRead={handleMarkNotificationRead}
      />
    );
  }

  // If Government Official, render Government Dashboard
  return (
    <GovernmentDashboard
      session={session}
      complaints={complaints}
      orders={orders}
      slaRules={slaRules}
      notifications={notifications}
      keywordsDatabase={keywordsDatabase}
      language={language}
      onLanguageChange={setLanguage}
      onAddOrder={handleAddOrder}
      onUpdateComplaintRoutingStatus={handleUpdateComplaintRoutingStatus}
      onAddKeyword={handleAddKeyword}
      onDeleteKeyword={handleDeleteKeyword}
      onAddDepartment={handleAddDepartment}
      onSignOut={handleSignOut}
    />
  );
}
