export type DepartmentId =
  | 'PWD'
  | 'WATER'
  | 'ELECTRICITY'
  | 'HEALTH'
  | 'MUNICIPAL'
  | 'POLICE'
  | 'EDUCATION'
  | 'REVENUE'
  | 'TRANSPORT'
  | 'FIRE';

export type RoutingStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type PriorityLevel = 'ROUTINE' | 'HIGH' | 'EMERGENCY';

export interface Department {
  id: DepartmentId;
  name: string;
  hindiName: string;
  code: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  headOfficer: string;
  contactEmail: string;
  contactPhone: string;
  slaDefaultHours: number;
}

export interface KeywordMapping {
  id: string;
  keyword: string;
  departmentId: DepartmentId;
  category: string;
  weight: number;
}

export interface RoutedDepartment {
  departmentId: DepartmentId;
  matchedKeywords: string[];
  status: RoutingStatus;
  notes?: string;
  assignedOfficer?: string;
  updatedAt: string;
  resolutionTimeHours?: number;
}

export interface Complaint {
  id: string; // e.g. LOK-2026-CMP-1042
  title: string;
  description: string;
  administrativeWard: string;
  citizenName: string;
  citizenContact: string;
  citizenEmail?: string;
  fileUrl?: string;
  fileName?: string;
  voiceNoteDuration?: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  routedDepartments: RoutedDepartment[];
  overallStatus: 'SUBMITTED' | 'ROUTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: PriorityLevel;
  slaHours: number;
  createdAt: string;
  updatedAt: string;
  citizenMpin?: string;
}

export interface GovernmentOrder {
  id: string;
  orderNumber: string; // e.g. GO-2026-DIST-0842
  title: string;
  description: string;
  issuingAuthority: string; // e.g. District Collector, IAS
  designation: string;
  targetDate: string;
  urgency: 'Routine' | 'Priority' | 'Emergency';
  administrativeWard: string;
  routedDepartments: RoutedDepartment[];
  status: 'ISSUED' | 'IN_PROGRESS' | 'COMPLIED' | 'OVERDUE';
  createdAt: string;
  signatorySeal: string;
}

export interface SLARule {
  id: string;
  departmentId: DepartmentId;
  issueCategory: string;
  maxResolutionTimeHours: number;
  escalationOfficer: string;
  penaltyClause: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'complaint' | 'order' | 'sla' | 'system';
  timestamp: string;
  read: boolean;
  referenceId?: string;
}

export interface UserSession {
  role: 'CITIZEN' | 'OFFICIAL';
  name: string;
  identifier: string; // phone number for citizen, officialId/email for official
  officialDepartmentId?: DepartmentId | 'ALL';
  designation?: string;
}

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur'
  | 'sa'
  | 'mai'
  | 'bho'
  | 'ne';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}
