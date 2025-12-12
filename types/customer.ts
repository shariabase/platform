// ============================================
// CUSTOMER PORTAL TYPES
// Types for end-customer facing features
// ============================================

import { AssetType, Jurisdiction } from './index';

// --------------------------------------------
// Customer Product View
// --------------------------------------------

export interface CustomerProduct {
  id: string;
  name: string;
  type: AssetType;
  typeLabel: string;
  status: CustomerProductStatus;
  jurisdiction: Jurisdiction;
  
  // Financial Details
  principalAmount: number;
  currency: string;
  profitRate?: number;
  tenor: number; // months
  startDate: Date;
  maturityDate: Date;
  
  // Sharia Info (simplified)
  shariaStructure: string;
  shariaApprovalDate: Date;
  fatwaReference: string;
  
  // Performance
  totalPaid?: number;
  remainingBalance?: number;
  nextPaymentAmount?: number;
  nextPaymentDate?: Date;
  
  // Documents
  contractSigned: boolean;
  contractSignedAt?: Date;
}

export type CustomerProductStatus = 
  | 'pending-approval'
  | 'approved'
  | 'active'
  | 'matured'
  | 'closed'
  | 'defaulted';

// --------------------------------------------
// Payment & Transaction History
// --------------------------------------------

export interface CustomerPayment {
  id: string;
  productId: string;
  type: 'profit' | 'principal' | 'fee' | 'early-settlement';
  amount: number;
  currency: string;
  dueDate: Date;
  paidDate?: Date;
  status: 'upcoming' | 'paid' | 'overdue' | 'pending';
  reference?: string;
}

export interface CustomerTransaction {
  id: string;
  productId: string;
  type: 'disbursement' | 'payment' | 'fee' | 'adjustment';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  balance: number;
}

// --------------------------------------------
// Contract & Signing
// --------------------------------------------

export interface CustomerContract {
  id: string;
  productId: string;
  title: string;
  version: number;
  status: 'pending-signature' | 'signed' | 'expired';
  documentUrl: string;
  createdAt: Date;
  expiresAt?: Date;
  signedAt?: Date;
  signatureHash?: string;
}

// --------------------------------------------
// Support & Communication
// --------------------------------------------

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'general' | 'payment' | 'document' | 'sharia' | 'technical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: TicketMessage[];
  productId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'support';
  content: string;
  attachments?: string[];
  createdAt: Date;
}

// --------------------------------------------
// Sharia Education Content
// --------------------------------------------

export interface ShariaEducationItem {
  id: string;
  title: string;
  category: 'basics' | 'contracts' | 'principles' | 'faq';
  content: string;
  videoUrl?: string;
  relatedProducts?: AssetType[];
  readTime: number; // minutes
}

// --------------------------------------------
// Dashboard Summary
// --------------------------------------------

export interface CustomerDashboardSummary {
  totalActiveProducts: number;
  totalPortfolioValue: number;
  nextPaymentDate?: Date;
  nextPaymentAmount?: number;
  upcomingPaymentsCount: number;
  unreadMessages: number;
  pendingActions: CustomerPendingAction[];
}

export interface CustomerPendingAction {
  id: string;
  type: 'sign-contract' | 'upload-document' | 'make-payment' | 'review-terms';
  title: string;
  productId?: string;
  dueDate?: Date;
  priority: 'normal' | 'urgent';
}

// --------------------------------------------
// Helper Functions
// --------------------------------------------

export const getProductStatusLabel = (status: CustomerProductStatus): string => {
  const labels: Record<CustomerProductStatus, string> = {
    'pending-approval': 'Pending Approval',
    'approved': 'Approved',
    'active': 'Active',
    'matured': 'Matured',
    'closed': 'Closed',
    'defaulted': 'Defaulted',
  };
  return labels[status];
};

export const getProductStatusColor = (status: CustomerProductStatus): string => {
  const colors: Record<CustomerProductStatus, string> = {
    'pending-approval': '#F59E0B',
    'approved': '#3B82F6',
    'active': '#10B981',
    'matured': '#6B7280',
    'closed': '#374151',
    'defaulted': '#EF4444',
  };
  return colors[status];
};

export const getAssetTypeDescription = (type: AssetType): string => {
  const descriptions: Record<AssetType, string> = {
    murabaha: 'Cost-plus sale where the bank purchases an asset and sells it to you at an agreed profit margin.',
    ijara: 'Leasing arrangement where the bank owns the asset and leases it to you with the option to purchase.',
    musharaka: 'Partnership where both parties contribute capital and share profits and losses.',
    mudaraba: 'Profit-sharing partnership where one party provides capital and the other provides expertise.',
    sukuk: 'Islamic investment certificates representing ownership in tangible assets.',
    wakala: 'Agency agreement where the bank acts as your agent to invest your funds.',
    salam: 'Forward sale contract for goods delivered at a future date.',
    istisna: 'Manufacturing contract for goods made to your specifications.',
  };
  return descriptions[type];
};
