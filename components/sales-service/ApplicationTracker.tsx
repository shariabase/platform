// ============================================
// APPLICATION TRACKER
// Track customer product applications
// ============================================

import React, { useState } from 'react';
import { Button, Card, Badge, Modal, Avatar } from '../shared';
import {
  CustomerApplication,
  ApplicationStatus,
  ApplicationDocument,
  getApplicationStatusLabel,
} from '../../types/sales';

interface ApplicationTrackerProps {
  applications?: CustomerApplication[];
  onViewApplication?: (app: CustomerApplication) => void;
  onUpdateStatus?: (appId: string, status: ApplicationStatus) => void;
}

// Mock applications for demo
const MOCK_APPLICATIONS: CustomerApplication[] = [
  {
    id: 'app-1',
    customerId: 'cust-1',
    customerName: 'Ahmed Al Rashid',
    productId: 'prod-1',
    productName: 'Home Murabaha Financing',
    status: 'kyc-approved',
    requestedAmount: 1500000,
    currency: 'AED',
    tenor: 240,
    parameters: {
      propertyType: 'Apartment',
      propertyLocation: 'Dubai Marina',
      downPayment: 300000,
    },
    documents: [
      { id: 'doc-1', applicationId: 'app-1', type: 'id', label: 'Emirates ID', status: 'verified', required: true },
      { id: 'doc-2', applicationId: 'app-1', type: 'salary', label: 'Salary Certificate', status: 'verified', required: true },
      { id: 'doc-3', applicationId: 'app-1', type: 'property', label: 'Property Documents', status: 'pending', required: true },
    ],
    assignedTo: 'user-1',
    submittedAt: new Date('2024-01-08'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'app-2',
    customerId: 'cust-2',
    customerName: 'Al Noor Trading LLC',
    productId: 'prod-3',
    productName: 'Working Capital Murabaha',
    status: 'credit-check',
    requestedAmount: 2000000,
    currency: 'AED',
    tenor: 12,
    parameters: {
      purpose: 'Inventory Purchase',
      collateral: 'Trade Receivables',
    },
    documents: [
      { id: 'doc-4', applicationId: 'app-2', type: 'trade-license', label: 'Trade License', status: 'verified', required: true },
      { id: 'doc-5', applicationId: 'app-2', type: 'financials', label: 'Financial Statements', status: 'verified', required: true },
      { id: 'doc-6', applicationId: 'app-2', type: 'bank', label: 'Bank Statements', status: 'verified', required: true },
    ],
    assignedTo: 'user-2',
    submittedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: 'app-3',
    customerId: 'cust-3',
    customerName: 'Fatima Al Mazroui',
    productId: 'prod-2',
    productName: 'Sukuk Investment Fund',
    status: 'approved',
    requestedAmount: 50000,
    currency: 'AED',
    tenor: 36,
    parameters: {
      investmentGoal: 'Long-term Growth',
      riskTolerance: 'Medium',
    },
    documents: [
      { id: 'doc-7', applicationId: 'app-3', type: 'id', label: 'Emirates ID', status: 'verified', required: true },
      { id: 'doc-8', applicationId: 'app-3', type: 'source', label: 'Source of Funds', status: 'verified', required: true },
    ],
    assignedTo: 'user-1',
    submittedAt: new Date('2024-01-09'),
    approvedAt: new Date('2024-01-12'),
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'app-4',
    customerId: 'cust-4',
    customerName: 'Mohammed Al Farsi',
    productId: 'prod-1',
    productName: 'Home Murabaha Financing',
    status: 'documents-pending',
    requestedAmount: 2500000,
    currency: 'AED',
    tenor: 300,
    parameters: {},
    documents: [
      { id: 'doc-9', applicationId: 'app-4', type: 'id', label: 'Emirates ID', status: 'verified', required: true },
      { id: 'doc-10', applicationId: 'app-4', type: 'salary', label: 'Salary Certificate', status: 'pending', required: true },
      { id: 'doc-11', applicationId: 'app-4', type: 'bank', label: 'Bank Statements', status: 'pending', required: true },
    ],
    assignedTo: 'user-1',
    submittedAt: new Date('2024-01-11'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-13'),
  },
];

const APPLICATION_STAGES: ApplicationStatus[] = [
  'submitted',
  'kyc-pending',
  'kyc-approved',
  'credit-check',
  'approved',
  'documents-pending',
  'ready-for-disbursement',
  'disbursed',
];

const getStatusColor = (status: ApplicationStatus): string => {
  const colors: Record<ApplicationStatus, string> = {
    draft: '#6B7280',
    submitted: '#3B82F6',
    'kyc-pending': '#F59E0B',
    'kyc-approved': '#10B981',
    'credit-check': '#8B5CF6',
    approved: '#10B981',
    'documents-pending': '#F59E0B',
    'ready-for-disbursement': '#EC4899',
    disbursed: '#059669',
    rejected: '#EF4444',
    cancelled: '#6B7280',
  };
  return colors[status];
};

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications = MOCK_APPLICATIONS,
  onViewApplication,
  onUpdateStatus,
}) => {
  const [selectedApp, setSelectedApp] = useState<CustomerApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');

  const filteredApps = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

  const getStageIndex = (status: ApplicationStatus) =>
    APPLICATION_STAGES.indexOf(status);

  const getDocumentProgress = (docs: ApplicationDocument[]) => {
    const verified = docs.filter(d => d.status === 'verified').length;
    return Math.round((verified / docs.length) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Application Tracker</h2>
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Applications</option>
            {APPLICATION_STAGES.map(status => (
              <option key={status} value={status}>{getApplicationStatusLabel(status)}</option>
            ))}
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', count: applications.length, color: 'bg-blue-500' },
          { label: 'In Progress', count: applications.filter(a => !['approved', 'disbursed', 'rejected', 'cancelled'].includes(a.status)).length, color: 'bg-yellow-500' },
          { label: 'Approved', count: applications.filter(a => a.status === 'approved' || a.status === 'ready-for-disbursement').length, color: 'bg-green-500' },
          { label: 'Disbursed', count: applications.filter(a => a.status === 'disbursed').length, color: 'bg-emerald-600' },
        ].map(stat => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-10 rounded-full ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Application List */}
      <div className="space-y-3">
        {filteredApps.map(app => {
          const stageIndex = getStageIndex(app.status);
          const progress = app.status === 'rejected' || app.status === 'cancelled'
            ? 0
            : app.status === 'disbursed'
            ? 100
            : Math.round(((stageIndex + 1) / APPLICATION_STAGES.length) * 100);

          return (
            <Card
              key={app.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedApp(app);
                onViewApplication?.(app);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={app.customerName} size="md" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.customerName}</h4>
                    <p className="text-sm text-gray-500">{app.productName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">
                    {formatCurrency(app.requestedAmount, app.currency)}
                  </p>
                  <Badge
                    style={{
                      backgroundColor: `${getStatusColor(app.status)}20`,
                      color: getStatusColor(app.status),
                    }}
                  >
                    {getApplicationStatusLabel(app.status)}
                  </Badge>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Application Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      app.status === 'rejected' ? 'bg-red-500' :
                      app.status === 'cancelled' ? 'bg-gray-400' :
                      'bg-primary-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stage indicators */}
              <div className="flex items-center justify-between gap-1 mb-3">
                {APPLICATION_STAGES.slice(0, 6).map((stage, index) => {
                  const isActive = index <= stageIndex;
                  const isCurrent = app.status === stage;
                  return (
                    <div key={stage} className="flex-1 text-center">
                      <div
                        className={`h-1.5 rounded-full mb-1 ${
                          isActive ? 'bg-primary-500' : 'bg-gray-200'
                        } ${isCurrent ? 'ring-2 ring-primary-300' : ''}`}
                      />
                      <span className={`text-xs ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                        {getApplicationStatusLabel(stage).replace(' ', '\n').split('\n')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Document progress */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Documents: {app.documents.filter(d => d.status === 'verified').length}/{app.documents.length} verified
                </span>
                <span className="text-gray-500">
                  Tenor: {app.tenor} months
                </span>
                <span className="text-gray-500">
                  Submitted: {app.submittedAt?.toLocaleDateString() || 'Not submitted'}
                </span>
              </div>
            </Card>
          );
        })}

        {filteredApps.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No applications found</p>
          </Card>
        )}
      </div>

      {/* Application Detail Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={selectedApp.customerName} size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedApp.customerName}
                  </h3>
                  <p className="text-gray-500">{selectedApp.productName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(selectedApp.requestedAmount, selectedApp.currency)}
                </p>
                <Badge
                  style={{
                    backgroundColor: `${getStatusColor(selectedApp.status)}20`,
                    color: getStatusColor(selectedApp.status),
                  }}
                >
                  {getApplicationStatusLabel(selectedApp.status)}
                </Badge>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Tenor</p>
                <p className="font-semibold">{selectedApp.tenor} months</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-semibold">
                  {selectedApp.submittedAt?.toLocaleDateString() || 'Not yet'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Application ID</p>
                <p className="font-semibold text-sm">{selectedApp.id}</p>
              </div>
            </div>

            {/* Parameters */}
            {Object.keys(selectedApp.parameters).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Product Parameters</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedApp.parameters).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
              <div className="space-y-2">
                {selectedApp.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        doc.status === 'verified' ? 'bg-green-100 text-green-600' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        doc.status === 'uploaded' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        {doc.status === 'verified' ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.label}</p>
                        <p className="text-xs text-gray-500 capitalize">{doc.status}</p>
                      </div>
                    </div>
                    {doc.required && <Badge variant="warning" className="text-xs">Required</Badge>}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-gray-600">Created: {selectedApp.createdAt.toLocaleDateString()}</span>
                </div>
                {selectedApp.submittedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-gray-600">Submitted: {selectedApp.submittedAt.toLocaleDateString()}</span>
                  </div>
                )}
                {selectedApp.approvedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-600">Approved: {selectedApp.approvedAt.toLocaleDateString()}</span>
                  </div>
                )}
                {selectedApp.disbursedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-gray-600">Disbursed: {selectedApp.disbursedAt.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              <Button variant="outline" className="flex-1">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Customer
              </Button>
              {selectedApp.status === 'approved' && (
                <Button className="flex-1">
                  Process Disbursement
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationTracker;
