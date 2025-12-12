// ============================================
// DOCUMENT MANAGEMENT TYPES
// Extended types for document handling
// ============================================

import { Document, DocumentType, UserRole } from './index';

// --------------------------------------------
// Document Upload & Management
// --------------------------------------------

export interface DocumentUpload {
  file: File;
  productId: string;
  type: DocumentType;
  title: string;
  description?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  fileSize: number;
  hash: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
  changeNotes?: string;
}

export interface DocumentWithVersions extends Document {
  versions: DocumentVersion[];
  currentVersion: DocumentVersion;
  accessLog: DocumentAccessLog[];
}

export interface DocumentAccessLog {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'viewed' | 'downloaded' | 'uploaded' | 'deleted';
  timestamp: Date;
  ipAddress?: string;
}

// --------------------------------------------
// Document Filters & Search
// --------------------------------------------

export interface DocumentFilters {
  productId?: string;
  types?: DocumentType[];
  uploadedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface DocumentSortOptions {
  field: 'title' | 'uploadedAt' | 'type' | 'version';
  direction: 'asc' | 'desc';
}

// --------------------------------------------
// Document Permissions
// --------------------------------------------

export interface DocumentPermissions {
  canView: boolean;
  canDownload: boolean;
  canUpload: boolean;
  canDelete: boolean;
  canViewHistory: boolean;
}

export const ROLE_DOCUMENT_PERMISSIONS: Record<UserRole, DocumentPermissions> = {
  'product-owner': {
    canView: true,
    canDownload: true,
    canUpload: true,
    canDelete: false,
    canViewHistory: true,
  },
  'sharia-scholar': {
    canView: true,
    canDownload: true,
    canUpload: true, // Can upload fatwas
    canDelete: false,
    canViewHistory: true,
  },
  'legal-compliance': {
    canView: true,
    canDownload: true,
    canUpload: true,
    canDelete: false,
    canViewHistory: true,
  },
  'risk-audit': {
    canView: true,
    canDownload: true,
    canUpload: true,
    canDelete: false,
    canViewHistory: true,
  },
  engineering: {
    canView: true,
    canDownload: true,
    canUpload: true,
    canDelete: false,
    canViewHistory: true,
  },
  'sales-service': {
    canView: true,
    canDownload: true,
    canUpload: false,
    canDelete: false,
    canViewHistory: false,
  },
  regulator: {
    canView: true,
    canDownload: true,
    canUpload: false,
    canDelete: false,
    canViewHistory: true,
  },
  customer: {
    canView: true,
    canDownload: true,
    canUpload: false,
    canDelete: false,
    canViewHistory: false,
  },
};

// --------------------------------------------
// Document Type Configuration
// --------------------------------------------

export interface DocumentTypeConfig {
  type: DocumentType;
  label: string;
  description: string;
  icon: string;
  color: string;
  allowedRoles: UserRole[]; // Roles that can upload this type
  acceptedFormats: string[];
  maxSizeMB: number;
}

export const DOCUMENT_TYPE_CONFIGS: Record<DocumentType, DocumentTypeConfig> = {
  research: {
    type: 'research',
    label: 'Research Document',
    description: 'Market research, feasibility studies, product analysis',
    icon: '📊',
    color: '#3B82F6', // blue
    allowedRoles: ['product-owner', 'legal-compliance', 'risk-audit'],
    acceptedFormats: ['.pdf', '.docx', '.doc', '.xlsx', '.pptx'],
    maxSizeMB: 50,
  },
  fatwa: {
    type: 'fatwa',
    label: 'Fatwa',
    description: 'Sharia ruling or religious opinion',
    icon: '📜',
    color: '#059669', // green
    allowedRoles: ['sharia-scholar'],
    acceptedFormats: ['.pdf', '.docx', '.doc'],
    maxSizeMB: 20,
  },
  opinion: {
    type: 'opinion',
    label: 'Sharia Opinion',
    description: 'Scholarly opinion on product structure',
    icon: '💭',
    color: '#059669', // green
    allowedRoles: ['sharia-scholar'],
    acceptedFormats: ['.pdf', '.docx', '.doc'],
    maxSizeMB: 20,
  },
  'contract-draft': {
    type: 'contract-draft',
    label: 'Contract Draft',
    description: 'Legal contract drafts and agreements',
    icon: '📝',
    color: '#7C3AED', // purple
    allowedRoles: ['product-owner', 'legal-compliance'],
    acceptedFormats: ['.pdf', '.docx', '.doc'],
    maxSizeMB: 30,
  },
  'regulatory-filing': {
    type: 'regulatory-filing',
    label: 'Regulatory Filing',
    description: 'Documents submitted to regulators',
    icon: '🏛️',
    color: '#6B7280', // gray
    allowedRoles: ['legal-compliance', 'risk-audit'],
    acceptedFormats: ['.pdf', '.docx', '.xlsx'],
    maxSizeMB: 50,
  },
  'audit-report': {
    type: 'audit-report',
    label: 'Audit Report',
    description: 'Internal or external audit findings',
    icon: '🔍',
    color: '#DC2626', // red
    allowedRoles: ['risk-audit', 'regulator'],
    acceptedFormats: ['.pdf', '.docx', '.xlsx'],
    maxSizeMB: 50,
  },
  'training-material': {
    type: 'training-material',
    label: 'Training Material',
    description: 'Sales and customer service training documents',
    icon: '📚',
    color: '#EC4899', // pink
    allowedRoles: ['product-owner', 'sales-service'],
    acceptedFormats: ['.pdf', '.pptx', '.mp4', '.docx'],
    maxSizeMB: 100,
  },
  'customer-disclosure': {
    type: 'customer-disclosure',
    label: 'Customer Disclosure',
    description: 'Documents for customer transparency',
    icon: '📋',
    color: '#14B8A6', // teal
    allowedRoles: ['product-owner', 'legal-compliance', 'sales-service'],
    acceptedFormats: ['.pdf', '.docx'],
    maxSizeMB: 20,
  },
};

// --------------------------------------------
// File Type Helpers
// --------------------------------------------

export interface FileTypeInfo {
  extension: string;
  mimeType: string;
  icon: string;
  color: string;
}

export const FILE_TYPE_INFO: Record<string, FileTypeInfo> = {
  pdf: {
    extension: '.pdf',
    mimeType: 'application/pdf',
    icon: '📄',
    color: '#DC2626',
  },
  docx: {
    extension: '.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: '📝',
    color: '#2563EB',
  },
  doc: {
    extension: '.doc',
    mimeType: 'application/msword',
    icon: '📝',
    color: '#2563EB',
  },
  xlsx: {
    extension: '.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: '📊',
    color: '#059669',
  },
  pptx: {
    extension: '.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    icon: '📽️',
    color: '#EA580C',
  },
  mp4: {
    extension: '.mp4',
    mimeType: 'video/mp4',
    icon: '🎬',
    color: '#7C3AED',
  },
};
