import React, { useState, useEffect } from 'react';
import { DashboardLayout, RecentActivityWidget } from '../components/dashboard';
import { RiskAssessmentMatrix, AuditPackGenerator, TransactionMonitor } from '../components/risk-audit';
import { DocumentPanel } from '../components/documents';
import { Card, CardHeader, CardBody, Button, Badge } from '../components/shared';
import { useProducts } from '../hooks/useProducts';
import { Product, RiskAssessment, RiskCategory, RiskLevel, AuditLog } from '../types';
import { PRODUCT_STATUS_LABELS, ASSET_TYPE_INFO, RISK_LEVEL_CONFIG } from '../utils/constants';

interface RiskAuditPageProps {
  user?: {
    id: string;
    name: string;
    role: 'risk-audit';
  };
  onLogout?: () => void;
}

// Mock risk assessments
const generateMockAssessments = (productId: string): RiskAssessment[] => [
  {
    id: `risk-1-${productId}`,
    productId,
    category: 'sharia-compliance',
    level: 'low',
    description: 'Product structure reviewed and approved by Sharia Board',
    mitigationPlan: 'Annual Sharia audit and continuous monitoring',
    assessedBy: 'user-4',
    assessedAt: new Date(),
  },
  {
    id: `risk-2-${productId}`,
    productId,
    category: 'credit',
    level: 'medium',
    description: 'Customer default risk based on financing tenor and amount',
    mitigationPlan: 'Collateral requirements and income verification',
    assessedBy: 'user-4',
    assessedAt: new Date(),
  },
  {
    id: `risk-3-${productId}`,
    productId,
    category: 'market',
    level: 'medium',
    description: 'Property value fluctuation risk',
    mitigationPlan: 'LTV limits and periodic revaluation',
    assessedBy: 'user-4',
    assessedAt: new Date(),
  },
  {
    id: `risk-4-${productId}`,
    productId,
    category: 'operational',
    level: 'low',
    description: 'Standard operational processes in place',
    assessedBy: 'user-4',
    assessedAt: new Date(),
  },
  {
    id: `risk-5-${productId}`,
    productId,
    category: 'legal',
    level: 'low',
    description: 'Contracts reviewed by legal team',
    assessedBy: 'user-4',
    assessedAt: new Date(),
  },
];

// Mock transactions
const mockTransactions = [
  {
    id: 'txn-1',
    productId: 'prod-1',
    productName: 'Home Financing Murabaha',
    type: 'disbursement' as const,
    amount: 2000000,
    currency: 'AED',
    status: 'completed' as const,
    timestamp: new Date(Date.now() - 86400000),
    parties: [{ name: 'Bank', role: 'Financier' }, { name: 'Customer A', role: 'Purchaser' }],
  },
  {
    id: 'txn-2',
    productId: 'prod-1',
    productName: 'Home Financing Murabaha',
    type: 'repayment' as const,
    amount: 15000,
    currency: 'AED',
    status: 'completed' as const,
    timestamp: new Date(Date.now() - 3600000),
    parties: [{ name: 'Customer A', role: 'Payer' }],
  },
  {
    id: 'txn-3',
    productId: 'prod-2',
    productName: 'Vehicle Financing',
    type: 'profit-distribution' as const,
    amount: 5000,
    currency: 'SAR',
    status: 'flagged' as const,
    flagReason: 'Profit calculation needs verification',
    timestamp: new Date(Date.now() - 7200000),
    parties: [{ name: 'Bank', role: 'Distributor' }],
  },
  {
    id: 'txn-4',
    productId: 'prod-3',
    productName: 'Equipment Ijara',
    type: 'fee' as const,
    amount: 1500,
    currency: 'MYR',
    status: 'pending' as const,
    timestamp: new Date(),
    parties: [{ name: 'Customer B', role: 'Payer' }],
  },
];

// Mock activities
const mockActivities: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 600000),
    userId: 'user-4',
    userName: 'You',
    action: 'flagged transaction for review',
    entityType: 'product',
    entityId: 'prod-2',
    details: {},
    hash: 'audit-abc',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000),
    userId: 'user-4',
    userName: 'You',
    action: 'completed risk assessment for Home Financing',
    entityType: 'product',
    entityId: 'prod-1',
    details: {},
    hash: 'audit-def',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000),
    userId: 'user-3',
    userName: 'Legal Team',
    action: 'approved legal review',
    entityType: 'workflow',
    entityId: 'wf-1',
    details: {},
    hash: 'audit-ghi',
  },
];

export const RiskAuditPage: React.FC<RiskAuditPageProps> = ({ user, onLogout }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [riskAssessments, setRiskAssessments] = useState<Record<string, RiskAssessment[]>>({});
  const [transactions, setTransactions] = useState(mockTransactions);
  const [activeTab, setActiveTab] = useState<'risk' | 'audit' | 'transactions'>('risk');

  const { products, fetchProducts, isLoading } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get products pending risk review
  const pendingProducts = products.filter(
    (p) => p.status === 'pending-risk-review' || p.status === 'legal-approved'
  );

  // Load risk assessments when product selected
  useEffect(() => {
    if (selectedProduct && !riskAssessments[selectedProduct.id]) {
      setRiskAssessments((prev) => ({
        ...prev,
        [selectedProduct.id]: generateMockAssessments(selectedProduct.id),
      }));
    }
  }, [selectedProduct, riskAssessments]);

  // Handle risk assessment add
  const handleAddAssessment = () => {
    // Would open modal to add new assessment
  };

  // Handle risk assessment update
  const handleUpdateAssessment = (assessmentId: string) => {
    // Would open modal to update assessment
  };

  // Handle transaction flag
  const handleFlagTransaction = (txnId: string, reason: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId ? { ...t, status: 'flagged' as const, flagReason: reason } : t
      )
    );
  };

  // Handle clear flag
  const handleClearFlag = (txnId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId ? { ...t, status: 'completed' as const, flagReason: undefined } : t
      )
    );
  };

  // Calculate stats
  const stats = {
    pendingReview: pendingProducts.length,
    flaggedTransactions: transactions.filter((t) => t.status === 'flagged').length,
    highRiskProducts: Object.values(riskAssessments).filter((assessments) =>
      assessments.some((a) => a.level === 'high' || a.level === 'critical')
    ).length,
  };

  // Calculate overall risk score
  const calculateRiskScore = (assessments: RiskAssessment[]): number => {
    if (assessments.length === 0) return 0;
    const weights: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    const total = assessments.reduce((acc, a) => acc + weights[a.level], 0);
    return Math.round((1 - total / (assessments.length * 4)) * 100);
  };

  return (
    <DashboardLayout userRole="risk-audit" userName={user.name} onLogout={onLogout}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Risk Management & Audit</h1>
        <p className="text-gray-500">Assess risks, monitor transactions, and generate audit packs</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Flagged Transactions</p>
                <p className="text-2xl font-bold text-red-600">{stats.flaggedTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High Risk Products</p>
                <p className="text-2xl font-bold text-orange-600">{stats.highRiskProducts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <p className="text-sm text-gray-500">Products Assessed</p>
                <p className="text-2xl font-bold text-green-600">{Object.keys(riskAssessments).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <CardHeader>Products for Risk Review</CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No products available</p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => {
                    const assessments = riskAssessments[product.id] || [];
                    const riskScore = calculateRiskScore(assessments);
                    const hasHighRisk = assessments.some(
                      (a) => a.level === 'high' || a.level === 'critical'
                    );

                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedProduct?.id === product.id
                            ? 'border-red-500 bg-red-50'
                            : hasHighRisk
                            ? 'border-orange-200 bg-orange-50'
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
                          <div className="text-right">
                            {assessments.length > 0 ? (
                              <Badge
                                variant={riskScore >= 70 ? 'success' : riskScore >= 40 ? 'warning' : 'danger'}
                                size="sm"
                              >
                                {riskScore}%
                              </Badge>
                            ) : (
                              <Badge variant="default" size="sm">Not Assessed</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          <RecentActivityWidget activities={mockActivities} maxItems={4} />
        </div>

        {/* Center/Right Column - Work Area */}
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
                        // Complete risk review
                      }}
                    >
                      Complete Assessment
                    </Button>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-4 mt-4 border-b border-gray-200">
                    {(['risk', 'audit', 'transactions'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                          activeTab === tab
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab === 'risk' && 'Risk Assessment'}
                        {tab === 'audit' && 'Audit Pack'}
                        {tab === 'transactions' && 'Transactions'}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Tab Content */}
              {activeTab === 'risk' && (
                <RiskAssessmentMatrix
                  productId={selectedProduct.id}
                  assessments={riskAssessments[selectedProduct.id] || []}
                  onAddAssessment={handleAddAssessment}
                  onUpdateAssessment={handleUpdateAssessment}
                />
              )}

              {activeTab === 'audit' && (
                <AuditPackGenerator
                  product={selectedProduct}
                  riskAssessments={riskAssessments[selectedProduct.id] || []}
                  onGenerate={() => console.log('Generate audit pack')}
                  onExport={(format) => console.log('Export as', format)}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionMonitor
                  transactions={transactions.filter((t) => t.productId === selectedProduct.id)}
                  onFlag={handleFlagTransaction}
                  onClearFlag={handleClearFlag}
                  onViewDetails={(t) => console.log('View details', t)}
                />
              )}
            </>
          ) : (
            <>
              {/* No Product Selected */}
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-gray-500">Select a product to assess risks</p>
                  </div>
                </CardBody>
              </Card>

              {/* All Transactions Monitor */}
              <TransactionMonitor
                transactions={transactions}
                onFlag={handleFlagTransaction}
                onClearFlag={handleClearFlag}
                onViewDetails={(t) => console.log('View details', t)}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiskAuditPage;
