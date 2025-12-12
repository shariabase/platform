// ============================================
// SALES & CUSTOMER SERVICE TYPES
// Types for sales, onboarding, and training
// ============================================

import { Product, UserRole, DocumentType } from './index';

// --------------------------------------------
// Customer & KYC Types
// --------------------------------------------

export type CustomerType = 'individual' | 'corporate' | 'sme' | 'government';

export type KYCStatus = 
  | 'not-started'
  | 'documents-pending'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'expired';

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  email: string;
  phone: string;
  nationalId?: string;
  companyRegistration?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    country: string;
    postalCode: string;
  };
  kycStatus: KYCStatus;
  kycDocuments: KYCDocument[];
  riskRating?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactAt?: Date;
}

export interface KYCDocument {
  id: string;
  customerId: string;
  type: KYCDocumentType;
  status: 'pending' | 'verified' | 'rejected';
  fileUrl: string;
  uploadedAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  expiryDate?: Date;
}

export type KYCDocumentType =
  | 'national-id'
  | 'passport'
  | 'proof-of-address'
  | 'bank-statement'
  | 'company-registration'
  | 'memorandum-of-association'
  | 'board-resolution'
  | 'financial-statements'
  | 'tax-certificate';

export const KYC_DOCUMENT_CONFIGS: Record<KYCDocumentType, {
  label: string;
  required: CustomerType[];
  description: string;
}> = {
  'national-id': {
    label: 'National ID / Emirates ID',
    required: ['individual'],
    description: 'Government-issued identification document',
  },
  'passport': {
    label: 'Passport',
    required: ['individual'],
    description: 'Valid passport with clear photo page',
  },
  'proof-of-address': {
    label: 'Proof of Address',
    required: ['individual', 'corporate', 'sme'],
    description: 'Utility bill or bank statement (not older than 3 months)',
  },
  'bank-statement': {
    label: 'Bank Statement',
    required: ['individual', 'corporate', 'sme'],
    description: 'Last 3 months bank statements',
  },
  'company-registration': {
    label: 'Trade License / Company Registration',
    required: ['corporate', 'sme'],
    description: 'Valid company registration document',
  },
  'memorandum-of-association': {
    label: 'Memorandum of Association',
    required: ['corporate'],
    description: 'Company MOA or Articles of Incorporation',
  },
  'board-resolution': {
    label: 'Board Resolution',
    required: ['corporate'],
    description: 'Board resolution authorizing the transaction',
  },
  'financial-statements': {
    label: 'Audited Financial Statements',
    required: ['corporate', 'sme'],
    description: 'Last 2 years audited financials',
  },
  'tax-certificate': {
    label: 'Tax Registration Certificate',
    required: ['corporate', 'sme'],
    description: 'Valid tax registration or VAT certificate',
  },
};

// --------------------------------------------
// Training & Product Narratives
// --------------------------------------------

export interface TrainingModule {
  id: string;
  productId?: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'interactive';
  duration: number; // minutes
  content: TrainingContent[];
  targetAudience: 'sales' | 'customer-service' | 'both';
  status: 'draft' | 'published' | 'archived';
  completionRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingContent {
  id: string;
  order: number;
  type: 'text' | 'video' | 'image' | 'quiz';
  title: string;
  content: string; // markdown, video URL, or quiz JSON
}

export interface TrainingProgress {
  moduleId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  progress: number; // percentage
  quizScore?: number;
}

export interface ProductNarrative {
  id: string;
  productId: string;
  version: number;
  title: string;
  summary: string; // 2-3 sentences
  keyBenefits: string[];
  shariaCompliance: string; // simplified explanation
  eligibility: string[];
  documentationRequired: string[];
  faq: { question: string; answer: string }[];
  disclaimers: string[];
  approvedBy?: string;
  approvedAt?: Date;
  status: 'draft' | 'approved' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------------------------
// Sales Pipeline
// --------------------------------------------

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal-sent'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface Lead {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerType: CustomerType;
  productInterest: string[]; // product IDs
  status: LeadStatus;
  source: 'website' | 'referral' | 'campaign' | 'walk-in' | 'call-center';
  assignedTo: string;
  assignedToName: string;
  notes: LeadNote[];
  nextFollowUp?: Date;
  expectedValue?: number;
  probability?: number; // percentage
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  lostReason?: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

// --------------------------------------------
// Customer Applications
// --------------------------------------------

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'kyc-pending'
  | 'kyc-approved'
  | 'credit-check'
  | 'approved'
  | 'documents-pending'
  | 'ready-for-disbursement'
  | 'disbursed'
  | 'rejected'
  | 'cancelled';

export interface CustomerApplication {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  status: ApplicationStatus;
  requestedAmount: number;
  currency: string;
  tenor: number;
  parameters: Record<string, unknown>;
  documents: ApplicationDocument[];
  assignedTo: string;
  submittedAt?: Date;
  approvedAt?: Date;
  disbursedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  type: string;
  label: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  fileUrl?: string;
  uploadedAt?: Date;
  required: boolean;
}

// --------------------------------------------
// Sales Dashboard Metrics
// --------------------------------------------

export interface SalesMetrics {
  totalLeads: number;
  newLeadsThisMonth: number;
  conversionRate: number;
  pipelineValue: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  topProducts: { productId: string; productName: string; count: number }[];
  teamPerformance: { userId: string; userName: string; closedDeals: number; value: number }[];
}

// --------------------------------------------
// Helper Functions
// --------------------------------------------

export const getKYCRequiredDocuments = (customerType: CustomerType): KYCDocumentType[] => {
  return (Object.entries(KYC_DOCUMENT_CONFIGS) as [KYCDocumentType, typeof KYC_DOCUMENT_CONFIGS[KYCDocumentType]][])
    .filter(([_, config]) => config.required.includes(customerType))
    .map(([type]) => type);
};

export const getKYCStatusColor = (status: KYCStatus): string => {
  const colors: Record<KYCStatus, string> = {
    'not-started': '#6B7280',
    'documents-pending': '#F59E0B',
    'under-review': '#3B82F6',
    'approved': '#10B981',
    'rejected': '#EF4444',
    'expired': '#DC2626',
  };
  return colors[status];
};

export const getLeadStatusColor = (status: LeadStatus): string => {
  const colors: Record<LeadStatus, string> = {
    new: '#3B82F6',
    contacted: '#8B5CF6',
    qualified: '#F59E0B',
    'proposal-sent': '#EC4899',
    negotiation: '#F97316',
    won: '#10B981',
    lost: '#6B7280',
  };
  return colors[status];
};

export const getApplicationStatusLabel = (status: ApplicationStatus): string => {
  const labels: Record<ApplicationStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    'kyc-pending': 'KYC Pending',
    'kyc-approved': 'KYC Approved',
    'credit-check': 'Credit Check',
    approved: 'Approved',
    'documents-pending': 'Documents Pending',
    'ready-for-disbursement': 'Ready for Disbursement',
    disbursed: 'Disbursed',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  };
  return labels[status];
};
