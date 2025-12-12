// ============================================
// MEETING MANAGEMENT TYPES
// Types for meeting scheduling and management
// ============================================

import { Meeting, MeetingType, MeetingAttendee, AgendaItem, MeetingDecision, UserRole } from './index';

// --------------------------------------------
// Extended Meeting Types
// --------------------------------------------

export interface MeetingWithDetails extends Meeting {
  createdBy: string;
  createdByName: string;
  relatedDocuments: string[]; // document IDs
  transcriptUrl?: string;
  actionItems: ActionItem[];
  followUpMeetingId?: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  completedAt?: Date;
  notes?: string;
}

// --------------------------------------------
// Meeting Templates
// --------------------------------------------

export interface MeetingTemplate {
  id: string;
  name: string;
  type: MeetingType;
  defaultDuration: number; // minutes
  defaultAgenda: AgendaItem[];
  requiredRoles: UserRole[];
  description: string;
}

export const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    id: 'tpl-sharia-board',
    name: 'Sharia Board Meeting',
    type: 'sharia-board',
    defaultDuration: 120,
    defaultAgenda: [
      { id: 'ag-1', title: 'Opening and Quorum', duration: 10 },
      { id: 'ag-2', title: 'Review of Previous Minutes', duration: 15 },
      { id: 'ag-3', title: 'New Product Reviews', duration: 45, description: 'Review new product structures for Sharia compliance' },
      { id: 'ag-4', title: 'Fatwa Discussions', duration: 30 },
      { id: 'ag-5', title: 'Any Other Business', duration: 15 },
      { id: 'ag-6', title: 'Closing', duration: 5 },
    ],
    requiredRoles: ['sharia-scholar', 'product-owner'],
    description: 'Regular Sharia Supervisory Board meeting for product approvals',
  },
  {
    id: 'tpl-legal-review',
    name: 'Legal Review Session',
    type: 'legal-review',
    defaultDuration: 60,
    defaultAgenda: [
      { id: 'ag-1', title: 'Contract Review', duration: 30 },
      { id: 'ag-2', title: 'Compliance Discussion', duration: 20 },
      { id: 'ag-3', title: 'Action Items', duration: 10 },
    ],
    requiredRoles: ['legal-compliance', 'product-owner'],
    description: 'Legal review session for contract and compliance matters',
  },
  {
    id: 'tpl-risk-committee',
    name: 'Risk Committee Meeting',
    type: 'risk-committee',
    defaultDuration: 90,
    defaultAgenda: [
      { id: 'ag-1', title: 'Risk Dashboard Review', duration: 20 },
      { id: 'ag-2', title: 'New Risk Assessments', duration: 30 },
      { id: 'ag-3', title: 'Flagged Transactions Review', duration: 25 },
      { id: 'ag-4', title: 'Mitigation Strategies', duration: 15 },
    ],
    requiredRoles: ['risk-audit', 'product-owner', 'legal-compliance'],
    description: 'Risk committee meeting for product risk assessment',
  },
  {
    id: 'tpl-product-kickoff',
    name: 'Product Kickoff',
    type: 'product-kickoff',
    defaultDuration: 60,
    defaultAgenda: [
      { id: 'ag-1', title: 'Product Overview', duration: 15 },
      { id: 'ag-2', title: 'Structure Discussion', duration: 20 },
      { id: 'ag-3', title: 'Timeline and Milestones', duration: 15 },
      { id: 'ag-4', title: 'Questions and Clarifications', duration: 10 },
    ],
    requiredRoles: ['product-owner'],
    description: 'Kickoff meeting for new product development',
  },
];

// --------------------------------------------
// Meeting Configuration
// --------------------------------------------

export interface MeetingTypeConfig {
  type: MeetingType;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const MEETING_TYPE_CONFIGS: Record<MeetingType, MeetingTypeConfig> = {
  'sharia-board': {
    type: 'sharia-board',
    label: 'Sharia Board',
    icon: '📜',
    color: '#059669',
    description: 'Sharia Supervisory Board meetings',
  },
  'legal-review': {
    type: 'legal-review',
    label: 'Legal Review',
    icon: '⚖️',
    color: '#7C3AED',
    description: 'Legal and compliance review sessions',
  },
  'risk-committee': {
    type: 'risk-committee',
    label: 'Risk Committee',
    icon: '📊',
    color: '#DC2626',
    description: 'Risk assessment committee meetings',
  },
  'product-kickoff': {
    type: 'product-kickoff',
    label: 'Product Kickoff',
    icon: '🚀',
    color: '#3B82F6',
    description: 'New product initiation meetings',
  },
  'audit-review': {
    type: 'audit-review',
    label: 'Audit Review',
    icon: '🔍',
    color: '#F59E0B',
    description: 'Internal and external audit reviews',
  },
  'customer-presentation': {
    type: 'customer-presentation',
    label: 'Customer Presentation',
    icon: '👥',
    color: '#EC4899',
    description: 'Customer-facing presentations',
  },
};

// --------------------------------------------
// Calendar Types
// --------------------------------------------

export interface CalendarEvent {
  id: string;
  meetingId: string;
  title: string;
  start: Date;
  end: Date;
  type: MeetingType;
  color: string;
  attendeeCount: number;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

// --------------------------------------------
// Helper Functions
// --------------------------------------------

export const getMeetingTypeConfig = (type: MeetingType): MeetingTypeConfig => {
  return MEETING_TYPE_CONFIGS[type];
};

export const getMeetingTemplate = (templateId: string): MeetingTemplate | undefined => {
  return MEETING_TEMPLATES.find((t) => t.id === templateId);
};

export const getMeetingTemplateByType = (type: MeetingType): MeetingTemplate | undefined => {
  return MEETING_TEMPLATES.find((t) => t.type === type);
};

export const formatMeetingTime = (date: Date, duration: number): string => {
  const start = new Date(date);
  const end = new Date(start.getTime() + duration * 60000);
  
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  return `${formatTime(start)} - ${formatTime(end)}`;
};

export const formatMeetingDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isMeetingToday = (date: Date): boolean => {
  const today = new Date();
  const meetingDate = new Date(date);
  return (
    today.getDate() === meetingDate.getDate() &&
    today.getMonth() === meetingDate.getMonth() &&
    today.getFullYear() === meetingDate.getFullYear()
  );
};

export const isMeetingUpcoming = (date: Date): boolean => {
  return new Date(date) > new Date();
};
