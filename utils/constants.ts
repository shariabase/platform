// ============================================
// Application Constants
// ============================================

// Workflow Stage Labels
export const WORKFLOW_STAGE_LABELS: Record<string, string> = {
  initiation: 'Initiation',
  'sharia-review': 'Sharia Review',
  'legal-review': 'Legal Review',
  'risk-review': 'Risk Review',
  'engineering-implementation': 'Engineering Implementation',
  deployment: 'Deployment',
  completed: 'Completed',
};

// Product Status Labels
export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  'pending-sharia-review': 'Pending Sharia Review',
  'sharia-approved': 'Sharia Approved',
  'pending-legal-review': 'Pending Legal Review',
  'legal-approved': 'Legal Approved',
  'pending-risk-review': 'Pending Risk Review',
  'risk-approved': 'Risk Approved',
  'pending-deployment': 'Pending Deployment',
  deployed: 'Deployed',
  active: 'Active',
  suspended: 'Suspended',
  archived: 'Archived',
};

// Asset Type Labels & Descriptions
export const ASSET_TYPE_INFO: Record<string, { label: string; description: string }> = {
  murabaha: {
    label: 'Murabaha',
    description: 'Cost-plus financing where the bank purchases an asset and sells it to the customer at a markup',
  },
  ijara: {
    label: 'Ijara',
    description: 'Leasing arrangement where the bank purchases and leases an asset to the customer',
  },
  musharaka: {
    label: 'Musharaka',
    description: 'Partnership where profits and losses are shared according to agreed ratios',
  },
  mudaraba: {
    label: 'Mudaraba',
    description: 'Trust financing where one party provides capital and the other provides expertise',
  },
  sukuk: {
    label: 'Sukuk',
    description: 'Islamic bonds representing ownership in tangible assets or services',
  },
  wakala: {
    label: 'Wakala',
    description: 'Agency arrangement where one party acts as agent for another',
  },
  salam: {
    label: 'Salam',
    description: 'Forward sale contract with advance payment for future delivery',
  },
  istisna: {
    label: "Istisna'",
    description: 'Manufacturing contract for custom-made goods',
  },
};

// Compliance Standards
export const COMPLIANCE_STANDARDS = {
  AAOIFI: {
    name: 'AAOIFI',
    fullName: 'Accounting and Auditing Organization for Islamic Financial Institutions',
    website: 'https://aaoifi.com',
  },
  IFSB: {
    name: 'IFSB',
    fullName: 'Islamic Financial Services Board',
    website: 'https://ifsb.org',
  },
};

// Risk Level Configuration
export const RISK_LEVEL_CONFIG: Record<string, { color: string; label: string; priority: number }> = {
  low: { color: '#22C55E', label: 'Low', priority: 1 },
  medium: { color: '#F59E0B', label: 'Medium', priority: 2 },
  high: { color: '#EF4444', label: 'High', priority: 3 },
  critical: { color: '#7C2D12', label: 'Critical', priority: 4 },
};

// Document Type Labels
export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  research: 'Research Document',
  fatwa: 'Fatwa',
  opinion: 'Sharia Opinion',
  'contract-draft': 'Contract Draft',
  'regulatory-filing': 'Regulatory Filing',
  'audit-report': 'Audit Report',
  'training-material': 'Training Material',
  'customer-disclosure': 'Customer Disclosure',
};

// Notification Icons
export const NOTIFICATION_ICONS: Record<string, string> = {
  'approval-required': '📋',
  'approval-received': '✅',
  'comment-added': '💬',
  'document-uploaded': '📄',
  'meeting-scheduled': '📅',
  'workflow-stage-change': '🔄',
  'compliance-alert': '⚠️',
};

// Date Formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy HH:mm',
  input: 'yyyy-MM-dd',
  api: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
};

// Pagination Defaults
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
};
