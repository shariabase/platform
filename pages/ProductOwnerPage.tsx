import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout, WorkflowStatusWidget, PendingApprovalsWidget, RecentActivityWidget } from '../components/dashboard';
import { ProductCreationWizard } from '../components/product-owner';
import { DocumentPanel } from '../components/documents';
import { Card, CardHeader, CardBody, Button, Badge, Modal } from '../components/shared';
import { useProducts } from '../hooks/useProducts';
import { Product, Workflow, AuditLog, UserRole } from '../types';
import { ProductCreationData, JURISDICTION_CONFIGS } from '../types/products';
import { ASSET_TYPE_INFO, PRODUCT_STATUS_LABELS } from '../utils/constants';

interface ProductOwnerPageProps {
  user?: {
    id: string;
    name: string;
    role: 'product-owner';
  };
  onLogout?: () => void;
}

// Default user for demo mode
const defaultUser = {
  id: 'demo-product-owner',
  name: 'Mohammed Ali',
  role: 'product-owner' as const,
};

// Mock workflows data
const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    productId: 'prod-1',
    currentStage: 'sharia-review',
    stages: [
      { stage: 'initiation', status: 'approved', assignedTo: [], comments: [], approvals: [] },
      { stage: 'sharia-review', status: 'in-progress', assignedTo: [], comments: [], approvals: [] },
      { stage: 'legal-review', status: 'pending', assignedTo: [], comments: [], approvals: [] },
      { stage: 'risk-review', status: 'pending', assignedTo: [], comments: [], approvals: [] },
      { stage: 'engineering-implementation', status: 'pending', assignedTo: [], comments: [], approvals: [] },
      { stage: 'deployment', status: 'pending', assignedTo: [], comments: [], approvals: [] },
      { stage: 'completed', status: 'pending', assignedTo: [], comments: [], approvals: [] },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock activities data
const mockActivities: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000),
    userId: 'user-2',
    userName: 'Dr. Ahmed Hassan',
    action: 'started reviewing Home Financing Murabaha',
    entityType: 'product',
    entityId: 'prod-1',
    details: {},
    hash: 'audit-abc',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 900000),
    userId: 'user-1',
    userName: 'You',
    action: 'created new product Home Financing Murabaha',
    entityType: 'product',
    entityId: 'prod-1',
    details: {},
    hash: 'audit-def',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 3600000),
    userId: 'user-3',
    userName: 'Sarah Legal',
    action: 'approved Vehicle Financing legal review',
    entityType: 'workflow',
    entityId: 'wf-2',
    details: {},
    hash: 'audit-ghi',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 7200000),
    userId: 'user-4',
    userName: 'Risk Team',
    action: 'completed risk assessment for Medical Equipment Ijara',
    entityType: 'product',
    entityId: 'prod-3',
    details: {},
    hash: 'audit-jkl',
  },
];

export const ProductOwnerPage: React.FC<ProductOwnerPageProps> = ({ user = defaultUser, onLogout }) => {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    selectProduct,
    selectedProduct,
  } = useProducts();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle product creation
  const handleCreateProduct = useCallback(
    async (data: ProductCreationData) => {
      await createProduct(data, user.id);
    },
    [createProduct, user.id]
  );

  // Handle review click
  const handleReview = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setShowDocuments(true);
  }, []);

  // Calculate stats
  const stats = {
    total: products.length,
    inReview: products.filter((p) => p.status.includes('pending')).length,
    approved: products.filter((p) => p.status.includes('approved') && !p.status.includes('pending')).length,
    active: products.filter((p) => p.status === 'active').length,
  };

  return (
    <DashboardLayout userRole="product-owner" userName={user.name} onLogout={onLogout}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Dashboard</h1>
            <p className="text-gray-500">Manage your Sharia-compliant product workflows</p>
          </div>
          <Button
            onClick={() => setShowCreateWizard(true)}
            leftIcon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Product
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inReview}</p>
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
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-purple-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals */}
          <PendingApprovalsWidget
            products={products}
            userRole="product-owner"
            onReview={handleReview}
          />

          {/* Product Pipeline */}
          <Card>
            <CardHeader
              action={
                <Button variant="ghost" size="sm" onClick={() => setShowCreateWizard(true)}>
                  + Add Product
                </Button>
              }
            >
              Product Pipeline
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No products yet</p>
                  <Button variant="outline" onClick={() => setShowCreateWizard(true)}>
                    Create your first product
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => {
                    const assetInfo = ASSET_TYPE_INFO[product.assetType];
                    const jurisdictionConfig = JURISDICTION_CONFIGS[product.jurisdiction];

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleReview(product.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: '#3B82F6' }}
                          >
                            {product.assetType.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {assetInfo?.label || product.assetType} •{' '}
                              {jurisdictionConfig?.flag} {product.jurisdiction} •{' '}
                              {product.tenor} months
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            product.status.includes('pending')
                              ? 'warning'
                              : product.status === 'active'
                              ? 'success'
                              : 'default'
                          }
                          dot
                        >
                          {PRODUCT_STATUS_LABELS[product.status] || product.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <WorkflowStatusWidget workflows={mockWorkflows} />
          <RecentActivityWidget activities={mockActivities} />
        </div>
      </div>

      {/* Product Creation Wizard */}
      <ProductCreationWizard
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onSubmit={handleCreateProduct}
        userId={user.id}
        userName={user.name}
        userRole={user.role}
      />

      {/* Document Modal */}
      <Modal
        isOpen={showDocuments}
        onClose={() => setShowDocuments(false)}
        title="Product Documents"
        size="xl"
      >
        {selectedProductId && (
          <DocumentPanel
            productId={selectedProductId}
            userRole={user.role}
            userId={user.id}
            userName={user.name}
            title="Documents"
          />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ProductOwnerPage;
