import React, { useState } from 'react';
import { Modal, Button, Badge, Avatar } from '../shared';
import { DocumentWithVersions } from '../../types/documents';
import {
  formatFileSize,
  formatDocumentDateTime,
  getVersionLabel,
  getDocumentTypeConfig,
  getFileTypeInfo,
} from '../../utils/documentHelpers';

interface DocumentViewerProps {
  document: DocumentWithVersions | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: DocumentWithVersions) => void;
  onVersionHistory: (document: DocumentWithVersions) => void;
  onUploadNewVersion?: (document: DocumentWithVersions) => void;
}

/**
 * DocumentViewer - Document Management Component
 * 
 * Purpose: Modal for viewing document details and preview
 * Location: /components/documents/
 * Used by: All role pages that display documents
 * Shared: Yes - used across multiple role pages
 */
export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
  onVersionHistory,
  onUploadNewVersion,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'activity'>('preview');

  if (!document) return null;

  const typeConfig = getDocumentTypeConfig(document.type);
  const fileInfo = getFileTypeInfo(document.fileUrl);

  const renderPreview = () => {
    // Check if it's a PDF (can be embedded)
    const isPDF = document.fileUrl.toLowerCase().endsWith('.pdf');
    
    if (isPDF) {
      return (
        <div className="h-96 border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={document.fileUrl}
            className="w-full h-full"
            title={document.title}
          />
        </div>
      );
    }

    // For other file types, show a preview placeholder
    return (
      <div className="h-96 border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50">
        <div
          className="w-24 h-24 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${fileInfo.color}20` }}
        >
          <span className="text-5xl">{fileInfo.icon}</span>
        </div>
        <p className="text-gray-600 font-medium">{document.title}</p>
        <p className="text-sm text-gray-400 mt-1">
          {fileInfo.extension.toUpperCase().replace('.', '')} file • {formatFileSize(document.currentVersion.fileSize)}
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => onDownload(document)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Download to View
        </Button>
      </div>
    );
  };

  const renderDetails = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Document Information</h4>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-gray-500">Type</dt>
            <dd className="mt-1 flex items-center">
              <span
                className="inline-flex items-center px-2 py-1 rounded text-sm"
                style={{ backgroundColor: `${typeConfig.color}15`, color: typeConfig.color }}
              >
                <span className="mr-1">{typeConfig.icon}</span>
                {typeConfig.label}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Version</dt>
            <dd className="mt-1">
              <Badge variant="info">{getVersionLabel(document.version)}</Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">File Size</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatFileSize(document.currentVersion.fileSize)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">File Type</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {fileInfo.extension.toUpperCase().replace('.', '')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Uploaded</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDocumentDateTime(document.uploadedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Uploaded By</dt>
            <dd className="mt-1 flex items-center">
              <Avatar name={document.currentVersion.uploadedByName} size="xs" />
              <span className="ml-2 text-sm text-gray-900">
                {document.currentVersion.uploadedByName}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Description */}
      {document.description && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
          <p className="text-sm text-gray-600">{document.description}</p>
        </div>
      )}

      {/* Change Notes */}
      {document.currentVersion.changeNotes && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Latest Changes</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {document.currentVersion.changeNotes}
          </p>
        </div>
      )}

      {/* Hash Verification */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Integrity Verification</h4>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-green-600 font-medium">Document Verified</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-mono break-all">
            SHA-256: {document.hash}
          </p>
        </div>
      </div>

      {/* Version Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Version History</h4>
          <button
            onClick={() => onVersionHistory(document)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all {document.versions.length} versions
          </button>
        </div>
        <div className="space-y-2">
          {document.versions.slice(0, 3).map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center">
                <Badge
                  variant={version.version === document.version ? 'info' : 'default'}
                  size="sm"
                >
                  {getVersionLabel(version.version)}
                </Badge>
                <span className="ml-2 text-xs text-gray-500">
                  {formatDocumentDateTime(version.uploadedAt)}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {version.uploadedByName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      {document.accessLog.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No activity recorded</p>
      ) : (
        document.accessLog.map((log) => (
          <div key={log.id} className="flex items-start space-x-3">
            <Avatar name={log.userName} size="sm" />
            <div>
              <p className="text-sm text-gray-900">
                <span className="font-medium">{log.userName}</span>{' '}
                <span className="text-gray-600">{log.action}</span> this document
              </p>
              <p className="text-xs text-gray-500">
                {formatDocumentDateTime(log.timestamp)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      showCloseButton={true}
    >
      <div className="space-y-4">
        {/* Document Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${typeConfig.color}20` }}
            >
              <span className="text-2xl">{typeConfig.icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{document.title}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="info" size="sm">{getVersionLabel(document.version)}</Badge>
                <span className="text-sm text-gray-500">{typeConfig.label}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Download
            </Button>
            {onUploadNewVersion && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onUploadNewVersion(document)}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                }
              >
                New Version
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4">
            {(['preview', 'details', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-2 px-1 border-b-2 text-sm font-medium transition-colors
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'preview' && renderPreview()}
          {activeTab === 'details' && renderDetails()}
          {activeTab === 'activity' && renderActivity()}
        </div>
      </div>
    </Modal>
  );
};

export default DocumentViewer;
