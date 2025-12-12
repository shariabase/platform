// ============================================
// Role-Based Access Control Configuration
// ============================================

import { Permission, UserRole } from './index';

export interface RoleConfig {
  role: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
  dashboardWidgets: string[];
  primaryColor: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  'product-owner': {
    role: 'product-owner',
    displayName: 'Business/Product Owner',
    description: 'Initiates workflows, selects templates, coordinates with scholars & legal',
    permissions: ['create-product', 'review-product'],
    dashboardWidgets: [
      'product-pipeline',
      'pending-reviews',
      'recent-activity',
      'upcoming-meetings',
      'workflow-status',
    ],
    primaryColor: '#3B82F6', // blue
  },
  'sharia-scholar': {
    role: 'sharia-scholar',
    displayName: 'Sharia Scholar / SSB',
    description: 'Reviews structures, attaches fatwas, provides approvals',
    permissions: ['review-product', 'approve-fatwa'],
    dashboardWidgets: [
      'pending-fatwa-reviews',
      'recent-fatwas',
      'threaded-discussions',
      'document-versions',
      'meeting-schedule',
    ],
    primaryColor: '#059669', // green
  },
  'legal-compliance': {
    role: 'legal-compliance',
    displayName: 'Legal & Compliance',
    description: 'Checks contracts against regulatory rules and Sharia decisions',
    permissions: ['review-product', 'legal-review'],
    dashboardWidgets: [
      'pending-legal-reviews',
      'compliance-alerts',
      'regulatory-updates',
      'contract-drafts',
      'aaoifi-checklist',
    ],
    primaryColor: '#7C3AED', // purple
  },
  'risk-audit': {
    role: 'risk-audit',
    displayName: 'Risk Management & Audit',
    description: 'Evaluates risks, ensures fair profit-loss sharing, oversees Sharia audit',
    permissions: ['review-product', 'risk-assessment', 'view-audit-logs'],
    dashboardWidgets: [
      'risk-overview',
      'flagged-transactions',
      'audit-packs',
      'compliance-score',
      'risk-matrix',
    ],
    primaryColor: '#DC2626', // red
  },
  engineering: {
    role: 'engineering',
    displayName: 'IT/Engineering',
    description: 'Implements logic in code, deploys smart contracts, integrates systems',
    permissions: ['deploy-contract', 'view-audit-logs'],
    dashboardWidgets: [
      'deployment-queue',
      'smart-contracts',
      'integration-status',
      'system-health',
      'code-reviews',
    ],
    primaryColor: '#F59E0B', // amber
  },
  'sales-service': {
    role: 'sales-service',
    displayName: 'Sales & Customer Service',
    description: 'Receives training modules, onboards customers, ensures compliant marketing',
    permissions: ['customer-onboarding', 'review-product'],
    dashboardWidgets: [
      'active-products',
      'training-modules',
      'customer-pipeline',
      'product-narratives',
      'kyc-status',
    ],
    primaryColor: '#EC4899', // pink
  },
  regulator: {
    role: 'regulator',
    displayName: 'Regulator / External Auditor',
    description: 'Views immutable logs, verifies compliance, provides feedback',
    permissions: ['view-audit-logs'],
    dashboardWidgets: [
      'audit-trail',
      'compliance-reports',
      'approval-history',
      'regulatory-filings',
      'immutable-logs',
    ],
    primaryColor: '#6B7280', // gray
  },
  customer: {
    role: 'customer',
    displayName: 'End Customer',
    description: 'Views Sharia alignment, signs contracts, monitors performance',
    permissions: [],
    dashboardWidgets: [
      'my-products',
      'sharia-compliance-info',
      'contract-status',
      'performance-metrics',
      'support',
    ],
    primaryColor: '#14B8A6', // teal
  },
};

export const getRoleConfig = (role: UserRole): RoleConfig => {
  return ROLE_CONFIGS[role];
};

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_CONFIGS[userRole].permissions.includes(permission);
};

export const getRoleDisplayName = (role: UserRole): string => {
  return ROLE_CONFIGS[role].displayName;
};
