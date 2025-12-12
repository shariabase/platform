// ============================================
// SHARIA-COMPLIANT PRODUCT MANAGEMENT PLATFORM
// Core Type Definitions
// ============================================

// --------------------------------------------
// User Roles & Authentication
// --------------------------------------------

export type UserRole =
  | 'product-owner'
  | 'sharia-scholar'
  | 'legal-compliance'
  | 'risk-audit'
  | 'engineering'
  | 'sales-service'
  | 'regulator'
  | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  avatarUrl?: string;
  permissions: Permission[];
  createdAt: Date;
  lastLoginAt?: Date;
}

export type Permission =
  | 'create-product'
  | 'review-product'
  | 'approve-fatwa'
  | 'legal-review'
  | 'risk-assessment'
  | 'deploy-contract'
  | 'view-audit-logs'
  | 'manage-users'
  | 'customer-onboarding';

// --------------------------------------------
// Product & Workflow
// --------------------------------------------

export type ProductStatus =
  | 'draft'
  | 'pending-sharia-review'
  | 'sharia-approved'
  | 'pending-legal-review'
  | 'legal-approved'
  | 'pending-risk-review'
  | 'risk-approved'
  | 'pending-deployment'
  | 'deployed'
  | 'active'
  | 'suspended'
  | 'archived';

export type AssetType =
  | 'murabaha'
  | 'ijara'
  | 'musharaka'
  | 'mudaraba'
  | 'sukuk'
  | 'wakala'
  | 'salam'
  | 'istisna';

export type Jurisdiction =
  | 'UAE'
  | 'Saudi Arabia'
  | 'Malaysia'
  | 'Bahrain'
  | 'Qatar'
  | 'Kuwait'
  | 'Indonesia'
  | 'Pakistan'
  | 'UK'
  | 'Other';

export interface ProductTemplate {
  id: string;
  name: string;
  assetType: AssetType;
  description: string;
  requiredParameters: ParameterDefinition[];
  defaultJurisdictions: Jurisdiction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ParameterDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'select' | 'currency';
  required: boolean;
  options?: string[];
  defaultValue?: string | number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Product {
  id: string;
  templateId: string;
  name: string;
  assetType: AssetType;
  jurisdiction: Jurisdiction;
  tenor: number; // in months
  parameters: Record<string, string | number | Date>;
  status: ProductStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  workflowId: string;
}

// --------------------------------------------
// Document Management
// --------------------------------------------

export type DocumentType =
  | 'research'
  | 'fatwa'
  | 'opinion'
  | 'contract-draft'
  | 'regulatory-filing'
  | 'audit-report'
  | 'training-material'
  | 'customer-disclosure';

export interface Document {
  id: string;
  productId: string;
  type: DocumentType;
  title: string;
  description?: string;
  fileUrl: string;
  version: number;
  uploadedBy: string;
  uploadedAt: Date;
  hash: string; // for immutability verification
  previousVersionId?: string;
}

// --------------------------------------------
// Workflow & Approvals
// --------------------------------------------

export type WorkflowStage =
  | 'initiation'
  | 'sharia-review'
  | 'legal-review'
  | 'risk-review'
  | 'engineering-implementation'
  | 'deployment'
  | 'completed';

export interface Workflow {
  id: string;
  productId: string;
  currentStage: WorkflowStage;
  stages: WorkflowStageRecord[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface WorkflowStageRecord {
  stage: WorkflowStage;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'skipped';
  assignedTo: string[];
  startedAt?: Date;
  completedAt?: Date;
  comments: Comment[];
  approvals: Approval[];
}

export interface Approval {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  decision: 'approved' | 'rejected' | 'request-changes';
  comments?: string;
  timestamp: Date;
  signature?: string; // digital signature
}

// --------------------------------------------
// Comments & Collaboration
// --------------------------------------------

export interface Comment {
  id: string;
  parentId?: string; // for threaded comments
  productId: string;
  documentId?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  replies?: Comment[];
  isResolved?: boolean;
}

// --------------------------------------------
// Meetings & Collaboration Spaces
// --------------------------------------------

export type MeetingType =
  | 'sharia-board'
  | 'legal-review'
  | 'risk-committee'
  | 'product-kickoff'
  | 'audit-review'
  | 'customer-presentation';

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  productId?: string;
  organizerId: string;
  attendees: MeetingAttendee[];
  scheduledAt: Date;
  duration: number; // minutes
  agenda: AgendaItem[];
  notes?: string;
  decisions: MeetingDecision[];
  recordingUrl?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface MeetingAttendee {
  userId: string;
  name: string;
  role: UserRole;
  status: 'invited' | 'accepted' | 'declined' | 'attended';
}

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number; // minutes
  presenter?: string;
  documents?: string[]; // document IDs
}

export interface MeetingDecision {
  id: string;
  description: string;
  votedBy: string[];
  outcome: 'approved' | 'rejected' | 'deferred';
  timestamp: Date;
}

// --------------------------------------------
// Compliance & Audit
// --------------------------------------------

export type ComplianceStandard = 'AAOIFI' | 'IFSB' | 'Central Bank' | 'Local Regulation';

export interface ComplianceCheck {
  id: string;
  productId: string;
  standard: ComplianceStandard;
  rule: string;
  status: 'compliant' | 'non-compliant' | 'pending-review' | 'not-applicable';
  findings?: string;
  checkedBy: string;
  checkedAt: Date;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  entityType: 'product' | 'document' | 'workflow' | 'meeting' | 'user';
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  hash: string; // for immutability
  previousHash?: string; // blockchain-style linking
}

// --------------------------------------------
// Risk Assessment
// --------------------------------------------

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskCategory =
  | 'sharia-compliance'
  | 'credit'
  | 'market'
  | 'operational'
  | 'liquidity'
  | 'legal'
  | 'reputational';

export interface RiskAssessment {
  id: string;
  productId: string;
  category: RiskCategory;
  level: RiskLevel;
  description: string;
  mitigationPlan?: string;
  assessedBy: string;
  assessedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

// --------------------------------------------
// Smart Contracts & Deployment
// --------------------------------------------

export type ContractStatus = 'draft' | 'testing' | 'deployed' | 'active' | 'paused' | 'terminated';

export interface SmartContract {
  id: string;
  productId: string;
  contractAddress?: string;
  network: 'mainnet' | 'testnet' | 'private';
  status: ContractStatus;
  deployedBy?: string;
  deployedAt?: Date;
  codeHash: string;
  abi: Record<string, unknown>;
}

// --------------------------------------------
// Dashboard & Analytics
// --------------------------------------------

export interface DashboardMetrics {
  totalProducts: number;
  productsByStatus: Record<ProductStatus, number>;
  productsByAssetType: Record<AssetType, number>;
  pendingApprovals: number;
  complianceScore: number;
  recentActivity: AuditLog[];
  upcomingMeetings: Meeting[];
}

// --------------------------------------------
// Notifications
// --------------------------------------------

export type NotificationType =
  | 'approval-required'
  | 'approval-received'
  | 'comment-added'
  | 'document-uploaded'
  | 'meeting-scheduled'
  | 'workflow-stage-change'
  | 'compliance-alert';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  read: boolean;
  createdAt: Date;
}

// Re-export document types for convenience
export * from './documents';
export * from './sales';
export * from './customer';
export * from './notifications';
