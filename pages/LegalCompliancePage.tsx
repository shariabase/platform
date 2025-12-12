import React, { useState, useEffect } from 'react';
import { DashboardLayout, RecentActivityWidget } from '../components/dashboard';
import { ComplianceChecklist, ContractReviewPanel, RegulatoryAlertsPanel } from '../components/legal-compliance';
import { DocumentPanel } from '../components/documents';
import { Card, CardHeader, CardBody, Button, Badge, Modal } from '../components/shared';
import { useProducts } from '../hooks/useProducts';
import { ComplianceCheck, Product, AuditLog } from '../types';
import { ContractReview, ContractClause, ContractIssue, RegulatoryAlert, AAOIFI_STANDARDS } from '../types/compliance';
import { PRODUCT_STATUS_LABELS, ASSET_TYPE_INFO } from '../utils/constants';

interface LegalCompliancePageProps {
  user?: {
    id: string;
    name: string;
    role: 'legal-compliance';
  };
  onLogout?: () => void;
}

// Mock compliance checks
const generateMockChecks = (productId: string): ComplianceCheck[] => [
  {
    id: `check-1-${productId}`,
    productId,
    standard: 'AAOIFI',
    rule: 'FAS 2 - Murabaha Recognition',
    status: 'compliant',
    findings: 'Murabaha sale structure properly documented',
    checkedBy: 'user-3',
    checkedAt: new Date(),
  },
  {
    id: `check-2-${productId}`,
    productId,
    standard: 'AAOIFI',
    rule: 'SS 8 - Possession Requirement',
    status: 'pending-review',
    checkedBy: 'user-3',
    checkedAt: new Date(),
  },
  {
    id: `check-3-${productId}`,
    productId,
    standard: 'AAOIFI',
    rule: 'SS 8 - Price Disclosure',
    status: 'compliant',
    findings: 'All markup and costs clearly disclosed',
    checkedBy: 'user-3',
    checkedAt: new Date(),
  },
  {
    id: `check-4-${productId}`,
    productId,
    standard: 'IFSB',
    rule: 'IFSB-1 Risk Management',
    status: 'pending-review',
    checkedBy: 'user-3',
    checkedAt: new Date(),
  },
  {
    id: `check-5-${productId}`,
    productId,
    standard: 'Central Bank',
    rule: 'Consumer Protection Disclosure',
    status: 'non-compliant',
    findings: 'Missing required cooling-off period clause',
    checkedBy: 'user-3',
    checkedAt: new Date(),
  },
];

// Mock contract review
const generateMockContractReview = (productId: string): ContractReview => ({
  id: `review-${productId}`,
  productId,
  documentId: 'doc-2',
  reviewerId: 'user-3',
  reviewerName: 'Sarah Legal',
  status: 'in-progress',
  clauses: [
    {
      id: 'clause-1',
      section: '1.1',
      title: 'Definitions',
      content: '"Murabaha" means a sale contract whereby the Institution sells to the Customer an asset...',
      isShariahCompliant: true,
      issues: [],
    },
    {
      id: 'clause-2',
      section: '2.1',
      title: 'Sale and Purchase',
      content: 'The Institution agrees to sell and the Customer agrees to purchase the Asset at the Sale Price...',
      isShariahCompliant: true,
      issues: [],
    },
    {
      id: 'clause-3',
      section: '3.1',
      title: 'Payment Terms',
      content: 'The Customer shall pay the Sale Price in monthly installments over the Financing Period...',
      isShariahCompliant: null,
      issues: [
        {
          id: 'issue-1',
          severity: 'major',
          category: 'sharia',
          description: 'Late payment penalty clause may constitute riba',
          recommendation: 'Replace penalty with charitable donation mechanism',
          resolved: false,
        },
      ],
    },
    {
      id: 'clause-4',
      section: '4.1',
      title: 'Insurance',
      content: 'The Customer shall maintain Takaful coverage for the Asset throughout the Financing Period...',
      isShariahCompliant: true,
      issues: [],
    },
    {
      id: 'clause-5',
      section: '5.1',
      title: 'Default',
      content: 'In the event of default, the Institution may accelerate all outstanding amounts...',
      isShariahCompliant: null,
      issues: [
        {
          id: 'issue-2',
          severity: 'minor',
          category: 'legal',
          description: 'Notice period for acceleration not specified',
          recommendation: 'Add 30-day notice requirement',
          resolved: false,
        },
      ],
    },
  ],
  overallAssessment: '',
  startedAt: new Date(Date.now() - 86400000),
});

// Mock regulatory alerts
const mockAlerts: RegulatoryAlert[] = [
  {
    id: 'alert-1',
    title: 'AAOIFI Updates Sukuk Standards',
    description: 'AAOIFI has released updated guidance on Sukuk structures, effective Q1 2025',
    source: 'AAOIFI',
    severity: 'high',
    affectedJurisdictions: ['UAE', 'Bahrain', 'Saudi Arabia'],
    affectedProducts: ['sukuk'],
    effectiveDate: new Date('2025-01-01'),
    publishedAt: new Date(),
    actionRequired: true,
    status: 'new',
  },
  {
    id: 'alert-2',
    title: 'Central Bank Circular on Disclosure',
    description: 'New requirements for profit rate disclosure in consumer financing products',
    source: 'UAE Central Bank',
    severity: 'medium',
    affectedJurisdictions: ['UAE'],
    affectedProducts: ['murabaha', 'ijara'],
    effectiveDate: new Date('2025-03-01'),
    publishedAt: new Date(Date.now() - 86400000),
    actionRequired: true,
    status: 'reviewed',
  },
  {
    id: 'alert-3',
    title: 'IFSB Risk Management Update',
    description: 'Minor clarifications to IFSB-1 risk management guidelines',
    source: 'IFSB',
    severity: 'low',
    affectedJurisdictions: ['Malaysia', 'Bahrain'],
    affectedProducts: [],
    effectiveDate: new Date('2025-06-01'),
    publishedAt: new Date(Date.now() - 172800000),
    actionRequired: false,
    status: 'reviewed',
  },
];

// Mock activities
const mockActivities: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000),
    userId: 'user-3',
    userName: 'You',
    action: 'flagged compliance issue in Home Financing contract',
    entityType: 'product',
    entityId: 'prod-1',
    details: {},
    hash: 'audit-abc',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000),
    userId: 'user-5',
    userName: 'Dr. Ahmed',
    action: 'approved Sharia review for Vehicle Financing',
    entityType: 'workflow',
    entityId: 'wf-2',
    details: {},
    hash: 'audit-def',
  },
];

export const LegalCompliancePage: React.FC<LegalCompliancePageProps> = ({ user, onLogout }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [complianceChecks, setComplianceChecks] = useState<Record<string, ComplianceCheck[]>>({});
  const [contractReviews, setContractReviews] = useState<Record<string, ContractReview>>({});
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>(mockAlerts);
  const [activeTab, setActiveTab] = useState<'checklist' | 'contract' | 'documents'>('checklist');

  const { products, fetchProducts, isLoading } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get products pending legal review
  const pendingProducts = products.filter(
    (p) => p.status === 'pending-legal-review' || p.status === 'sharia-approved'
  );

  // Load compliance data when product selected
  useEffect(() => {
    if (selectedProduct && !complianceChecks[selectedProduct.id]) {
      setComplianceChecks((prev) => ({
        ...prev,
        [selectedProduct.id]: generateMockChecks(selectedProduct.id),
      }));
      setContractReviews((prev) => ({
        ...prev,
        [selectedProduct.id]: generateMockContractReview(selectedProduct.id),
      }));
    }
  }, [selectedProduct, complianceChecks]);

  // Handle compliance check update
  const handleUpdateCheck = (checkId: string, status: ComplianceCheck['status'], findings?: string) => {
    if (!selectedProduct) return;
    setComplianceChecks((prev) => ({
      ...prev,
      [selectedProduct.id]: prev[selectedProduct.id].map((check) =>
        check.id === checkId
          ? { ...check, status, findings: findings || check.findings, checkedAt: new Date() }
          : check
      ),
    }));
  };

  // Handle contract clause update
  const handleUpdateClause = (clauseId: string, updates: Partial<ContractClause>) => {
    if (!selectedProduct) return;
    setContractReviews((prev) => ({
      ...prev,
      [selectedProduct.id]: {
        ...prev[selectedProduct.id],
        clauses: prev[selectedProduct.id].clauses.map((clause) =>
          clause.id === clauseId ? { ...clause, ...updates } : clause
        ),
      },
    }));
  };

  // Handle add issue
  const handleAddIssue = (clauseId: string, issue: Omit<ContractIssue, 'id'>) => {
    if (!selectedProduct) return;
    const newIssue: ContractIssue = { ...issue, id: `issue-${Date.now()}` };
    setContractReviews((prev) => ({
      ...prev,
      [selectedProduct.id]: {
        ...prev[selectedProduct.id],
        clauses: prev[selectedProduct.id].clauses.map((clause) =>
          clause.id === clauseId
            ? { ...clause, issues: [...clause.issues, newIssue] }
            : clause
        ),
      },
    }));
  };

  // Handle resolve issue
  const handleResolveIssue = (clauseId: string, issueId: string) => {
    if (!selectedProduct) return;
    setContractReviews((prev) => ({
      ...prev,
      [selectedProduct.id]: {
        ...prev[selectedProduct.id],
        clauses: prev[selectedProduct.id].clauses.map((clause) =>
          clause.id === clauseId
            ? {
                ...clause,
                issues: clause.issues.map((issue) =>
                  issue.id === issueId
                    ? { ...issue, resolved: true, resolvedBy: user.id, resolvedAt: new Date() }
                    : issue
                ),
              }
            : clause
        ),
      },
    }));
  };

  // Calculate stats
  const stats = {
    pendingReview: pendingProducts.length,
    openIssues: Object.values(contractReviews).reduce(
      (acc, review) =>
        acc + review.clauses.reduce((a, c) => a + c.issues.filter((i) => !i.resolved).length, 0),
      0
    ),
    alertsNew: alerts.filter((a) => a.status === 'new').length,
  };

  return (
    <DashboardLayout userRole="legal-compliance" userName={user.name} onLogout={onLogout}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Legal & Compliance</h1>
        <p className="text-gray-500">Review contracts, check compliance, and monitor regulatory updates</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Issues</p>
                <p className="text-2xl font-bold text-red-600">{stats.openIssues}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Alerts</p>
                <p className="text-2xl font-bold text-blue-600">{stats.alertsNew}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Standards</p>
                <p className="text-2xl font-bold text-purple-600">{AAOIFI_STANDARDS.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Queue */}
        <div className="space-y-6">
          <Card>
            <CardHeader>Review Queue</CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              ) : pendingProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No products pending review</p>
              ) : (
                <div className="space-y-2">
                  {pendingProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedProduct?.id === product.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {ASSET_TYPE_INFO[product.assetType]?.label} • {product.jurisdiction}
                          </p>
                        </div>
                        <Badge
                          variant={product.status === 'pending-legal-review' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {product.status === 'pending-legal-review' ? 'Pending' : 'Sharia OK'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <RecentActivityWidget activities={mockActivities} maxItems={4} />
        </div>

        {/* Center Column - Review Area */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProduct ? (
            <>
              {/* Product Header */}
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h2>
                      <p className="text-sm text-gray-500">
                        {ASSET_TYPE_INFO[selectedProduct.assetType]?.label} •{' '}
                        {selectedProduct.jurisdiction} • {selectedProduct.tenor} months
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => {
                        // Complete review logic
                      }}
                    >
                      Complete Review
                    </Button>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-4 mt-4 border-b border-gray-200">
                    {(['checklist', 'contract', 'documents'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab === 'checklist' && 'Compliance Checklist'}
                        {tab === 'contract' && 'Contract Review'}
                        {tab === 'documents' && 'Documents'}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Tab Content */}
              {activeTab === 'checklist' && complianceChecks[selectedProduct.id] && (
                <ComplianceChecklist
                  productId={selectedProduct.id}
                  checks={complianceChecks[selectedProduct.id]}
                  onUpdateCheck={handleUpdateCheck}
                  canEdit={true}
                />
              )}

              {activeTab === 'contract' && contractReviews[selectedProduct.id] && (
                <ContractReviewPanel
                  review={contractReviews[selectedProduct.id]}
                  onUpdateClause={handleUpdateClause}
                  onAddIssue={handleAddIssue}
                  onResolveIssue={handleResolveIssue}
                  onComplete={() => {}}
                  canEdit={true}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentPanel
                  productId={selectedProduct.id}
                  userRole={user.role}
                  userId={user.id}
                  userName={user.name}
                  title="Product Documents"
                />
              )}
            </>
          ) : (
            <Card>
              <CardBody>
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-500">Select a product from the queue to start reviewing</p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Regulatory Alerts */}
          <RegulatoryAlertsPanel
            alerts={alerts}
            onMarkReviewed={(id) =>
              setAlerts((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: 'reviewed' } : a))
              )
            }
            onDismiss={(id) =>
              setAlerts((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: 'dismissed' } : a))
              )
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LegalCompliancePage;
