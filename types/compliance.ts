// ============================================
// LEGAL & COMPLIANCE TYPES
// Types for compliance checking and legal review
// ============================================

import { ComplianceStandard, ComplianceCheck, UserRole } from './index';

// --------------------------------------------
// Regulatory Standards
// --------------------------------------------

export interface RegulatoryStandard {
  id: string;
  code: string;
  name: string;
  fullName: string;
  issuingBody: string;
  category: 'sharia' | 'accounting' | 'governance' | 'risk' | 'disclosure';
  description: string;
  effectiveDate: Date;
  jurisdictions: string[];
  documentUrl?: string;
}

export const AAOIFI_STANDARDS: RegulatoryStandard[] = [
  {
    id: 'aaoifi-fas-1',
    code: 'FAS 1',
    name: 'General Presentation and Disclosure',
    fullName: 'Financial Accounting Standard No. 1',
    issuingBody: 'AAOIFI',
    category: 'accounting',
    description: 'General presentation and disclosure in financial statements of Islamic financial institutions',
    effectiveDate: new Date('1993-01-01'),
    jurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia', 'Malaysia'],
  },
  {
    id: 'aaoifi-fas-2',
    code: 'FAS 2',
    name: 'Murabaha and Murabaha to the Purchase Orderer',
    fullName: 'Financial Accounting Standard No. 2',
    issuingBody: 'AAOIFI',
    category: 'accounting',
    description: 'Accounting treatment for Murabaha transactions',
    effectiveDate: new Date('1993-01-01'),
    jurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia', 'Malaysia'],
  },
  {
    id: 'aaoifi-fas-8',
    code: 'FAS 8',
    name: 'Ijarah and Ijarah Muntahia Bittamleek',
    fullName: 'Financial Accounting Standard No. 8',
    issuingBody: 'AAOIFI',
    category: 'accounting',
    description: 'Accounting treatment for Ijarah (leasing) transactions',
    effectiveDate: new Date('1997-01-01'),
    jurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia', 'Malaysia'],
  },
  {
    id: 'aaoifi-ss-8',
    code: 'SS 8',
    name: 'Murabaha',
    fullName: 'Sharia Standard No. 8',
    issuingBody: 'AAOIFI',
    category: 'sharia',
    description: 'Sharia rules and principles for Murabaha transactions',
    effectiveDate: new Date('2000-01-01'),
    jurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia', 'Malaysia'],
  },
  {
    id: 'aaoifi-ss-9',
    code: 'SS 9',
    name: 'Ijarah and Ijarah Muntahia Bittamleek',
    fullName: 'Sharia Standard No. 9',
    issuingBody: 'AAOIFI',
    category: 'sharia',
    description: 'Sharia rules and principles for Ijarah transactions',
    effectiveDate: new Date('2000-01-01'),
    jurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia', 'Malaysia'],
  },
  {
    id: 'aaoifi-ss-12',
    code: 'SS 12',
    name: 'Sharikah (Musharakah) and Modern Corporations',
    fullName: 'Sharia Standard No. 12',
    issuingBody: 'AAOIFI',
    category: 'sharia',
    description: 'Sharia rules for partnership and Musharakah arrangements',
    effectiveDate: new Date('2002-01-01'),
    jurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia', 'Malaysia'],
  },
  {
    id: 'aaoifi-ss-17',
    code: 'SS 17',
    name: 'Investment Sukuk',
    fullName: 'Sharia Standard No. 17',
    issuingBody: 'AAOIFI',
    category: 'sharia',
    description: 'Sharia rules for Sukuk issuance and trading',
    effectiveDate: new Date('2003-01-01'),
    jurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia', 'Malaysia'],
  },
];

export const IFSB_STANDARDS: RegulatoryStandard[] = [
  {
    id: 'ifsb-1',
    code: 'IFSB-1',
    name: 'Risk Management',
    fullName: 'Guiding Principles of Risk Management',
    issuingBody: 'IFSB',
    category: 'risk',
    description: 'Risk management principles for Islamic financial services',
    effectiveDate: new Date('2005-12-01'),
    jurisdictions: ['Malaysia', 'Bahrain', 'UAE'],
  },
  {
    id: 'ifsb-3',
    code: 'IFSB-3',
    name: 'Corporate Governance',
    fullName: 'Guiding Principles on Corporate Governance',
    issuingBody: 'IFSB',
    category: 'governance',
    description: 'Corporate governance standards for Islamic financial institutions',
    effectiveDate: new Date('2006-12-01'),
    jurisdictions: ['Malaysia', 'Bahrain', 'UAE'],
  },
  {
    id: 'ifsb-7',
    code: 'IFSB-7',
    name: 'Capital Adequacy for Sukuk',
    fullName: 'Capital Adequacy Requirements for Sukuk, Securitisations and Real Estate Investment',
    issuingBody: 'IFSB',
    category: 'risk',
    description: 'Capital requirements for Sukuk and securitization',
    effectiveDate: new Date('2009-01-01'),
    jurisdictions: ['Malaysia', 'Bahrain', 'UAE'],
  },
];

// --------------------------------------------
// Compliance Checklist
// --------------------------------------------

export interface ComplianceChecklistItem {
  id: string;
  standardId: string;
  standardCode: string;
  requirement: string;
  description: string;
  category: 'mandatory' | 'recommended' | 'best-practice';
  applicableProducts: string[]; // asset types
  checkPoints: string[];
}

export interface ComplianceCheckResult extends ComplianceCheck {
  checklistItemId: string;
  evidence?: string;
  attachments?: string[];
  reviewNotes?: string;
}

// --------------------------------------------
// Contract Review
// --------------------------------------------

export interface ContractClause {
  id: string;
  section: string;
  title: string;
  content: string;
  isShariahCompliant: boolean | null;
  issues: ContractIssue[];
  suggestions?: string;
}

export interface ContractIssue {
  id: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  category: 'sharia' | 'legal' | 'regulatory' | 'commercial';
  description: string;
  recommendation: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface ContractReview {
  id: string;
  productId: string;
  documentId: string;
  reviewerId: string;
  reviewerName: string;
  status: 'in-progress' | 'completed' | 'requires-changes';
  clauses: ContractClause[];
  overallAssessment: string;
  startedAt: Date;
  completedAt?: Date;
}

// --------------------------------------------
// Regulatory Alerts
// --------------------------------------------

export interface RegulatoryAlert {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: 'high' | 'medium' | 'low';
  affectedJurisdictions: string[];
  affectedProducts: string[];
  effectiveDate: Date;
  publishedAt: Date;
  actionRequired: boolean;
  status: 'new' | 'reviewed' | 'actioned' | 'dismissed';
}

// --------------------------------------------
// Compliance Dashboard Metrics
// --------------------------------------------

export interface ComplianceMetrics {
  totalChecks: number;
  compliantCount: number;
  nonCompliantCount: number;
  pendingCount: number;
  complianceScore: number; // percentage
  byStandard: Record<string, { compliant: number; total: number }>;
  recentIssues: ContractIssue[];
  upcomingDeadlines: { description: string; date: Date }[];
}

// --------------------------------------------
// Helper Functions
// --------------------------------------------

export const getStandardsByCategory = (category: RegulatoryStandard['category']): RegulatoryStandard[] => {
  return [...AAOIFI_STANDARDS, ...IFSB_STANDARDS].filter((s) => s.category === category);
};

export const getStandardsByJurisdiction = (jurisdiction: string): RegulatoryStandard[] => {
  return [...AAOIFI_STANDARDS, ...IFSB_STANDARDS].filter((s) =>
    s.jurisdictions.includes(jurisdiction)
  );
};

export const getIssueSeverityColor = (severity: ContractIssue['severity']): string => {
  const colors = {
    critical: '#DC2626',
    major: '#F59E0B',
    minor: '#3B82F6',
    observation: '#6B7280',
  };
  return colors[severity];
};

export const calculateComplianceScore = (checks: ComplianceCheckResult[]): number => {
  if (checks.length === 0) return 100;
  const compliant = checks.filter((c) => c.status === 'compliant').length;
  return Math.round((compliant / checks.length) * 100);
};
