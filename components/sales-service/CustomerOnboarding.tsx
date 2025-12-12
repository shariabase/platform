// ============================================
// CUSTOMER ONBOARDING / KYC COMPONENT
// Sharia-compliant KYC workflow
// ============================================

import React, { useState } from 'react';
import { Button, Card, Badge, Modal, Avatar } from '../shared';
import {
  Customer,
  CustomerType,
  KYCDocument,
  KYCDocumentType,
  KYCStatus,
  KYC_DOCUMENT_CONFIGS,
  getKYCRequiredDocuments,
  getKYCStatusColor,
} from '../../types/sales';

interface CustomerOnboardingProps {
  customer?: Customer;
  onSave?: (customer: Partial<Customer>) => void;
  onSubmitKYC?: (customerId: string) => void;
  onVerifyDocument?: (docId: string, approved: boolean, reason?: string) => void;
  canEdit?: boolean;
}

// Mock customers for demo
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    type: 'individual',
    name: 'Ahmed Al Rashid',
    email: 'ahmed.rashid@email.com',
    phone: '+971 50 123 4567',
    nationalId: '784-1990-1234567-1',
    address: {
      line1: 'Tower 5, Apt 1204',
      line2: 'Downtown Dubai',
      city: 'Dubai',
      country: 'UAE',
      postalCode: '12345',
    },
    kycStatus: 'under-review',
    kycDocuments: [
      {
        id: 'doc-1',
        customerId: 'cust-1',
        type: 'national-id',
        status: 'verified',
        fileUrl: '/docs/id.pdf',
        uploadedAt: new Date('2024-01-10'),
        verifiedBy: 'user-1',
        verifiedAt: new Date('2024-01-11'),
      },
      {
        id: 'doc-2',
        customerId: 'cust-1',
        type: 'proof-of-address',
        status: 'pending',
        fileUrl: '/docs/address.pdf',
        uploadedAt: new Date('2024-01-10'),
      },
      {
        id: 'doc-3',
        customerId: 'cust-1',
        type: 'bank-statement',
        status: 'pending',
        fileUrl: '/docs/bank.pdf',
        uploadedAt: new Date('2024-01-10'),
      },
    ],
    riskRating: 'low',
    assignedTo: 'user-1',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    lastContactAt: new Date('2024-01-10'),
  },
  {
    id: 'cust-2',
    type: 'corporate',
    name: 'Al Noor Trading LLC',
    email: 'finance@alnoortrading.ae',
    phone: '+971 4 567 8901',
    companyRegistration: 'DED-12345-2020',
    address: {
      line1: 'Office 501, Business Bay',
      city: 'Dubai',
      country: 'UAE',
      postalCode: '54321',
    },
    kycStatus: 'documents-pending',
    kycDocuments: [
      {
        id: 'doc-4',
        customerId: 'cust-2',
        type: 'company-registration',
        status: 'verified',
        fileUrl: '/docs/trade.pdf',
        uploadedAt: new Date('2024-01-08'),
        verifiedAt: new Date('2024-01-09'),
      },
    ],
    riskRating: 'medium',
    assignedTo: 'user-2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-08'),
  },
];

export const CustomerOnboarding: React.FC<CustomerOnboardingProps> = ({
  customer: initialCustomer,
  onSave,
  onSubmitKYC,
  onVerifyDocument,
  canEdit = true,
}) => {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    initialCustomer || null
  );
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // New customer form state
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    type: 'individual',
    name: '',
    email: '',
    phone: '',
    address: { line1: '', city: '', country: 'UAE', postalCode: '' },
  });

  const getKYCProgress = (customer: Customer): number => {
    const required = getKYCRequiredDocuments(customer.type);
    const verified = customer.kycDocuments.filter(d => d.status === 'verified').length;
    return Math.round((verified / required.length) * 100);
  };

  const renderKYCStatusBadge = (status: KYCStatus) => {
    const variants: Record<KYCStatus, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'not-started': 'default',
      'documents-pending': 'warning',
      'under-review': 'info',
      'approved': 'success',
      'rejected': 'danger',
      'expired': 'danger',
    };
    const labels: Record<KYCStatus, string> = {
      'not-started': 'Not Started',
      'documents-pending': 'Documents Pending',
      'under-review': 'Under Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'expired': 'Expired',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const renderDocumentStatus = (doc: KYCDocument) => {
    const config = KYC_DOCUMENT_CONFIGS[doc.type];
    return (
      <div
        key={doc.id}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            doc.status === 'verified' ? 'bg-green-100 text-green-600' :
            doc.status === 'rejected' ? 'bg-red-100 text-red-600' :
            'bg-yellow-100 text-yellow-600'
          }`}>
            {doc.status === 'verified' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : doc.status === 'rejected' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{config.label}</p>
            <p className="text-sm text-gray-500">
              {doc.status === 'verified' && doc.verifiedAt
                ? `Verified ${doc.verifiedAt.toLocaleDateString()}`
                : doc.status === 'rejected' && doc.rejectionReason
                ? doc.rejectionReason
                : `Uploaded ${doc.uploadedAt.toLocaleDateString()}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {doc.status === 'pending' && canEdit && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDocument(doc)}
              >
                Review
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Customer Onboarding</h2>
        <Button onClick={() => setShowNewCustomerForm(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Customers</h3>
            <div className="space-y-3">
              {customers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCustomer?.id === customer.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {customer.type}
                      </p>
                    </div>
                    {renderKYCStatusBadge(customer.kycStatus)}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>KYC Progress</span>
                      <span>{getKYCProgress(customer)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all"
                        style={{ width: `${getKYCProgress(customer)}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedCustomer.name} size="lg" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedCustomer.name}
                      </h3>
                      <p className="text-gray-500 capitalize">
                        {selectedCustomer.type} Customer
                      </p>
                    </div>
                  </div>
                  {renderKYCStatusBadge(selectedCustomer.kycStatus)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                  {selectedCustomer.nationalId && (
                    <div>
                      <p className="text-sm text-gray-500">National ID</p>
                      <p className="font-medium">{selectedCustomer.nationalId}</p>
                    </div>
                  )}
                  {selectedCustomer.companyRegistration && (
                    <div>
                      <p className="text-sm text-gray-500">Company Registration</p>
                      <p className="font-medium">{selectedCustomer.companyRegistration}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {selectedCustomer.address.line1}
                      {selectedCustomer.address.line2 && `, ${selectedCustomer.address.line2}`}
                      <br />
                      {selectedCustomer.address.city}, {selectedCustomer.address.country}{' '}
                      {selectedCustomer.address.postalCode}
                    </p>
                  </div>
                  {selectedCustomer.riskRating && (
                    <div>
                      <p className="text-sm text-gray-500">Risk Rating</p>
                      <Badge
                        variant={
                          selectedCustomer.riskRating === 'low'
                            ? 'success'
                            : selectedCustomer.riskRating === 'medium'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {selectedCustomer.riskRating.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* KYC Documents */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">KYC Documents</h4>
                  <span className="text-sm text-gray-500">
                    {selectedCustomer.kycDocuments.filter(d => d.status === 'verified').length} /{' '}
                    {getKYCRequiredDocuments(selectedCustomer.type).length} verified
                  </span>
                </div>

                <div className="space-y-3">
                  {getKYCRequiredDocuments(selectedCustomer.type).map(docType => {
                    const doc = selectedCustomer.kycDocuments.find(d => d.type === docType);
                    const config = KYC_DOCUMENT_CONFIGS[docType];
                    
                    if (doc) {
                      return renderDocumentStatus(doc);
                    }
                    
                    return (
                      <div
                        key={docType}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{config.label}</p>
                            <p className="text-sm text-gray-500">{config.description}</p>
                          </div>
                        </div>
                        <Badge variant="default">Not Uploaded</Badge>
                      </div>
                    );
                  })}
                </div>

                {selectedCustomer.kycStatus === 'documents-pending' && canEdit && (
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Document Request Email
                    </Button>
                  </div>
                )}

                {selectedCustomer.kycStatus === 'under-review' && canEdit && (
                  <div className="mt-4 pt-4 border-t flex gap-3">
                    <Button
                      variant="success"
                      className="flex-1"
                      onClick={() => onSubmitKYC?.(selectedCustomer.id)}
                    >
                      Approve KYC
                    </Button>
                    <Button variant="danger" className="flex-1">
                      Reject KYC
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-gray-500">Select a customer to view details</p>
            </Card>
          )}
        </div>
      </div>

      {/* New Customer Modal */}
      <Modal
        isOpen={showNewCustomerForm}
        onClose={() => setShowNewCustomerForm(false)}
        title="Add New Customer"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Type
            </label>
            <select
              value={newCustomer.type}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, type: e.target.value as CustomerType })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="sme">SME</option>
              <option value="government">Government</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {newCustomer.type === 'individual' ? 'Full Name' : 'Company Name'}
            </label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder={newCustomer.type === 'individual' ? 'Ahmed Al Rashid' : 'Al Noor Trading LLC'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={newCustomer.address?.line1}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  address: { ...newCustomer.address!, line1: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-2"
              placeholder="Street address"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={newCustomer.address?.city}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    address: { ...newCustomer.address!, city: e.target.value },
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="City"
              />
              <input
                type="text"
                value={newCustomer.address?.country}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    address: { ...newCustomer.address!, country: e.target.value },
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Country"
              />
              <input
                type="text"
                value={newCustomer.address?.postalCode}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    address: { ...newCustomer.address!, postalCode: e.target.value },
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Postal Code"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Required Documents</h5>
            <p className="text-sm text-blue-700 mb-2">
              Based on customer type, the following documents will be required:
            </p>
            <ul className="text-sm text-blue-600 space-y-1">
              {getKYCRequiredDocuments(newCustomer.type as CustomerType).map(docType => (
                <li key={docType} className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {KYC_DOCUMENT_CONFIGS[docType].label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowNewCustomerForm(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave?.(newCustomer);
            setShowNewCustomerForm(false);
          }}>
            Create Customer
          </Button>
        </div>
      </Modal>

      {/* Document Review Modal */}
      <Modal
        isOpen={!!selectedDocument}
        onClose={() => {
          setSelectedDocument(null);
          setRejectionReason('');
        }}
        title="Review Document"
        size="md"
      >
        {selectedDocument && (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-600">Document Preview</p>
              <Button variant="outline" size="sm" className="mt-2">
                Open Document
              </Button>
            </div>

            <div>
              <p className="text-sm text-gray-500">Document Type</p>
              <p className="font-medium">{KYC_DOCUMENT_CONFIGS[selectedDocument.type].label}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Uploaded</p>
              <p className="font-medium">{selectedDocument.uploadedAt.toLocaleDateString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Explain why this document is being rejected..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="success"
                className="flex-1"
                onClick={() => {
                  onVerifyDocument?.(selectedDocument.id, true);
                  setSelectedDocument(null);
                }}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  onVerifyDocument?.(selectedDocument.id, false, rejectionReason);
                  setSelectedDocument(null);
                  setRejectionReason('');
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerOnboarding;
