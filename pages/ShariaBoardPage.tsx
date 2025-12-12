import React, { useState } from 'react';
import { DashboardLayout, RecentActivityWidget } from '../components/dashboard';
import { Card, CardHeader, CardBody, Button, Badge, Avatar } from '../components/shared';
import { Product, Document, Comment, AuditLog } from '../types';

interface ShariaBoardPageProps {
  user?: {
    name: string;
    role: 'sharia-scholar';
  };
  onLogout?: () => void;
}

// Default user for demo mode
const defaultUser = {
  name: 'Dr. Ahmed Hassan',
  role: 'sharia-scholar' as const,
};

// Mock data for Sharia review queue
const mockPendingReviews: Product[] = [
  {
    id: '1',
    templateId: 'tpl-1',
    name: 'Home Financing Murabaha',
    assetType: 'murabaha',
    jurisdiction: 'UAE',
    tenor: 240,
    parameters: { profitRate: '4.5%', downPayment: '20%' },
    status: 'pending-sharia-review',
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
    workflowId: 'wf-1',
  },
  {
    id: '2',
    templateId: 'tpl-3',
    name: 'SME Working Capital Mudaraba',
    assetType: 'mudaraba',
    jurisdiction: 'Malaysia',
    tenor: 12,
    parameters: { profitSharingRatio: '60:40' },
    status: 'pending-sharia-review',
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(),
    workflowId: 'wf-3',
  },
];

const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    productId: '1',
    type: 'research',
    title: 'Murabaha Structure Analysis',
    fileUrl: '/documents/murabaha-analysis.pdf',
    version: 1,
    uploadedBy: 'Product Team',
    uploadedAt: new Date(),
    hash: 'sha256-abc123',
  },
  {
    id: 'doc-2',
    productId: '1',
    type: 'contract-draft',
    title: 'Draft Master Agreement',
    fileUrl: '/documents/draft-agreement.pdf',
    version: 2,
    uploadedBy: 'Legal Team',
    uploadedAt: new Date(),
    hash: 'sha256-def456',
    previousVersionId: 'doc-2-v1',
  },
];

const mockComments: Comment[] = [
  {
    id: 'c1',
    productId: '1',
    authorId: 'user-5',
    authorName: 'Dr. Ahmed Hassan',
    authorRole: 'sharia-scholar',
    content: 'The profit rate mechanism needs clarification. Is it fixed or variable?',
    createdAt: new Date(Date.now() - 3600000),
    replies: [
      {
        id: 'c1-r1',
        parentId: 'c1',
        productId: '1',
        authorId: 'user-1',
        authorName: 'Mohammed Ali',
        authorRole: 'product-owner',
        content: 'The rate is fixed at contract inception based on benchmark + margin.',
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
  },
];

const mockActivities: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 600000),
    userId: 'user-1',
    userName: 'Mohammed Ali',
    action: 'uploaded new document for Home Financing Murabaha',
    entityType: 'document',
    entityId: 'doc-2',
    details: {},
    hash: 'audit-abc',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1800000),
    userId: 'user-1',
    userName: 'Mohammed Ali',
    action: 'replied to your comment',
    entityType: 'product',
    entityId: '1',
    details: {},
    hash: 'audit-def',
  },
];

export const ShariaBoardPage: React.FC<ShariaBoardPageProps> = ({ user = defaultUser, onLogout }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleApprove = (productId: string) => {
    console.log('Approve product:', productId);
    // API call to approve
  };

  const handleRequestChanges = (productId: string) => {
    console.log('Request changes for product:', productId);
    // API call to request changes
  };

  const handleAddFatwa = (productId: string) => {
    console.log('Add fatwa for product:', productId);
    // Open fatwa upload modal
  };

  return (
    <DashboardLayout userRole="sharia-scholar" userName={user.name} onLogout={onLogout}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sharia Review Workspace</h1>
        <p className="text-gray-500">Review products, attach fatwas, and provide approvals</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">{mockPendingReviews.length}</p>
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
                <p className="text-sm text-gray-500">Fatwas Issued</p>
                <p className="text-2xl font-bold text-green-600">24</p>
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
                <p className="text-sm text-gray-500">Open Discussions</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Board Meetings</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Queue - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              action={
                <Badge variant="warning">{mockPendingReviews.length} pending</Badge>
              }
            >
              Review Queue
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {mockPendingReviews.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.assetType} • {product.jurisdiction} • {product.tenor} months
                        </p>
                        <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                          <span>Submitted {new Date(product.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>2 documents attached</span>
                        </div>
                      </div>
                      <Badge variant="warning" size="sm">Awaiting Review</Badge>
                    </div>

                    {selectedProduct?.id === product.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(product.id);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequestChanges(product.id);
                            }}
                          >
                            Request Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddFatwa(product.id);
                            }}
                          >
                            Attach Fatwa
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Threaded Discussion */}
          <Card>
            <CardHeader>Discussion Thread</CardHeader>
            <CardBody>
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex space-x-3">
                      <Avatar name={comment.authorName} size="sm" />
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <Badge size="sm" variant="success">Scholar</Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>

                        {/* Replies */}
                        {comment.replies?.map((reply) => (
                          <div key={reply.id} className="flex space-x-3 mt-3 ml-6">
                            <Avatar name={reply.authorName} size="xs" />
                            <div className="flex-1 bg-blue-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{reply.authorName}</span>
                                <Badge size="sm" variant="info">Product Owner</Badge>
                              </div>
                              <p className="text-sm text-gray-700">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Comment */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Avatar name={user.name} size="sm" />
                  <div className="flex-1">
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={2}
                      placeholder="Add your comment or question..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Post Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <Card>
            <CardHeader>Attached Documents</CardHeader>
            <CardBody>
              <div className="space-y-3">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                      <p className="text-xs text-gray-500">v{doc.version} • {doc.uploadedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <RecentActivityWidget activities={mockActivities} maxItems={4} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShariaBoardPage;
