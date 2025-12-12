import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard';
import { DocumentPanel } from '../components/documents/DocumentPanel';
import { Card, CardHeader, CardBody, Badge, Button } from '../components/shared';
import { UserRole, DocumentType } from '../types';
import { DOCUMENT_TYPE_CONFIGS } from '../types/documents';

interface DocumentsPageProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
  productId: string;
  onLogout: () => void;
}

/**
 * DocumentsPage - Full Document Management Page
 * 
 * Purpose: Dedicated page for document management with full functionality
 * Location: /pages/
 * Used by: All roles for document management
 */
export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  user,
  productId,
  onLogout,
}) => {
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');

  // Get document types available to this user role
  const availableTypes = (Object.keys(DOCUMENT_TYPE_CONFIGS) as DocumentType[]).filter(
    (type) => DOCUMENT_TYPE_CONFIGS[type].allowedRoles.includes(user.role)
  );

  return (
    <DashboardLayout
      userRole={user.role}
      userName={user.name}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-500">
              Upload, manage, and track document versions with full audit trail
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">5</p>
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
                <p className="text-sm text-gray-500">Fatwas Issued</p>
                <p className="text-2xl font-bold text-green-600">8</p>
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
                <p className="text-sm text-gray-500">Total Versions</p>
                <p className="text-2xl font-bold text-purple-600">47</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Document Type Quick Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Quick Filter:</span>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Documents
            </button>
            {availableTypes.map((type) => {
              const config = DOCUMENT_TYPE_CONFIGS[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors inline-flex items-center ${
                    selectedType === type
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedType === type ? { backgroundColor: config.color } : undefined}
                >
                  <span className="mr-1">{config.icon}</span>
                  {config.label}
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Main Document Panel */}
      <DocumentPanel
        productId={productId}
        userRole={user.role}
        userId={user.id}
        userName={user.name}
        title="All Documents"
        allowedTypes={selectedType === 'all' ? undefined : [selectedType]}
        showUploadButton={true}
      />

      {/* Document Guidelines */}
      <Card className="mt-6">
        <CardHeader>Document Guidelines</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Accepted Formats</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PDF documents (preferred for final versions)</li>
                <li>• Word documents (.docx, .doc)</li>
                <li>• Excel spreadsheets (.xlsx)</li>
                <li>• PowerPoint presentations (.pptx)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use descriptive file names</li>
                <li>• Add change notes when uploading new versions</li>
                <li>• Keep file sizes under 50MB</li>
                <li>• Ensure documents are properly formatted</li>
              </ul>
            </div>
          </div>

          {/* Immutability Notice */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <h4 className="font-medium text-green-800">Document Integrity</h4>
                <p className="text-sm text-green-700 mt-1">
                  All documents are hashed using SHA-256 for integrity verification. 
                  Once uploaded, documents cannot be modified—only new versions can be added. 
                  This ensures a complete, tamper-evident audit trail for regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};

export default DocumentsPage;
