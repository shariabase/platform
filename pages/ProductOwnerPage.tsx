import React, { useState } from 'react';
import { DashboardLayout, WorkflowStatusWidget, PendingApprovalsWidget, RecentActivityWidget } from '../components/dashboard';
import { Card, CardHeader, CardBody, Button, Badge } from '../components/shared';
import { Product, Workflow, AuditLog } from '../types';

interface ProductOwnerPageProps {
  user: {
    name: string;
    role: 'product-owner';
  };
  onLogout: () => void;
}

// Mock data - would come from API in production
const mockProducts: Product[] = [
  {
    id: '1',
    templateId: 'tpl-1',
    name: 'Home Financing Murabaha',
    assetType: 'murabaha',
    jurisdiction: 'UAE',
    tenor: 240,
    parameters: {},
    status: 'pending-sharia-review',
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    workflowId: 'wf-1',
  },
  {
    id: '2',
    templateId: 'tpl-2',
    name: 'Vehicle Ijara Program',
    assetType: 'ijara',
    jurisdiction: 'Saudi Arabia',
    tenor: 60,
    parameters: {},
    status: 'pending-legal-review',
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    workflowId: 'wf-2',
  },
];

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    productId: '1',
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

const mockActivities: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000),
    userId: 'user-2',
    userName: 'Dr. Ahmed Hassan',
    action: 'started reviewing Home Financing Murabaha',
    entityType: 'product',
    entityId: '1',
    details: {},
    hash: 'abc123',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 900000),
    userId: 'user-1',
    userName: 'You',
    action: 'created new product Home Financing Murabaha',
    entityType: 'product',
    entityId: '1',
    details: {},
    hash: 'def456',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 3600000),
    userId: 'user-3',
    userName: 'Sarah Legal',
    action: 'approved Vehicle Ijara Program legal review',
    entityType: 'workflow',
    entityId: 'wf-2',
    details: {},
    hash: 'ghi789',
  },
];

export const ProductOwnerPage: React.FC<ProductOwnerPageProps> = ({ user, onLogout }) => {
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  const handleReview = (productId: string) => {
    console.log('Review product:', productId);
    // Navigate to product detail page
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
            onClick={() => setShowNewProductModal(true)}
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
                <p className="text-2xl font-bold text-gray-900">12</p>
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
                <p className="text-2xl font-bold text-yellow-600">4</p>
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
                <p className="text-2xl font-bold text-green-600">6</p>
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
                <p className="text-2xl font-bold text-purple-600">2</p>
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
          <PendingApprovalsWidget
            products={mockProducts}
            userRole="product-owner"
            onReview={handleReview}
          />

          {/* Product Pipeline */}
          <Card>
            <CardHeader>Product Pipeline</CardHeader>
            <CardBody>
              <div className="space-y-3">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReview(product.id)}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.assetType} • {product.tenor} months • {product.jurisdiction}
                      </p>
                    </div>
                    <Badge
                      variant={product.status.includes('pending') ? 'warning' : 'success'}
                      dot
                    >
                      {product.status.replace(/-/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <WorkflowStatusWidget workflows={mockWorkflows} />
          <RecentActivityWidget activities={mockActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductOwnerPage;
