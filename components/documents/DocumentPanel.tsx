import React, { useState, useEffect, useCallback } from 'react';
import { DocumentList } from './DocumentList';
import { DocumentUploader } from './DocumentUploader';
import { DocumentViewer } from './DocumentViewer';
import { DocumentVersionHistory } from './DocumentVersionHistory';
import { Modal, Button } from '../shared';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentType, UserRole } from '../../types';
import { DocumentWithVersions, DocumentVersion } from '../../types/documents';

interface DocumentPanelProps {
  productId: string;
  userRole: UserRole;
  userId: string;
  userName: string;
  title?: string;
  allowedTypes?: DocumentType[];
  showUploadButton?: boolean;
  compact?: boolean;
  maxHeight?: string;
}

/**
 * DocumentPanel - Document Management Component
 * 
 * Purpose: Self-contained document management panel with all functionality
 * Location: /components/documents/
 * Used by: ProductOwnerPage, ShariaBoardPage, LegalCompliancePage, etc.
 * Shared: Yes - embedded in multiple role pages
 */
export const DocumentPanel: React.FC<DocumentPanelProps> = ({
  productId,
  userRole,
  userId,
  userName,
  title = 'Documents',
  allowedTypes,
  showUploadButton = true,
  compact = false,
  maxHeight,
}) => {
  const {
    documents,
    isLoading,
    error,
    uploadProgress,
    selectedDocument,
    fetchDocuments,
    uploadDocument,
    uploadNewVersion,
    selectDocument,
    logAccess,
    clearError,
  } = useDocuments();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [uploadingNewVersion, setUploadingNewVersion] = useState<DocumentWithVersions | null>(null);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments(productId);
  }, [productId, fetchDocuments]);

  // Handle document view
  const handleView = useCallback(
    (document: DocumentWithVersions) => {
      selectDocument(document);
      logAccess(document.id, 'viewed', { id: userId, name: userName, role: userRole });
    },
    [selectDocument, logAccess, userId, userName, userRole]
  );

  // Handle document download
  const handleDownload = useCallback(
    (document: DocumentWithVersions) => {
      // In production, this would trigger actual download
      logAccess(document.id, 'downloaded', { id: userId, name: userName, role: userRole });
      
      // Simulate download by opening in new tab
      window.open(document.fileUrl, '_blank');
    },
    [logAccess, userId, userName, userRole]
  );

  // Handle version download
  const handleDownloadVersion = useCallback(
    (version: DocumentVersion) => {
      window.open(version.fileUrl, '_blank');
    },
    []
  );

  // Handle version history view
  const handleVersionHistory = useCallback(
    (document: DocumentWithVersions) => {
      selectDocument(document);
      setShowVersionHistory(true);
    },
    [selectDocument]
  );

  // Handle upload new version
  const handleUploadNewVersion = useCallback(
    (document: DocumentWithVersions) => {
      setUploadingNewVersion(document);
      setShowUploadModal(true);
    },
    []
  );

  // Handle file upload
  const handleUpload = useCallback(
    async (file: File, type: DocumentType, uploadTitle: string, description?: string) => {
      const userInfo = { id: userId, name: userName, role: userRole };

      if (uploadingNewVersion) {
        // Upload as new version
        await uploadNewVersion(uploadingNewVersion.id, file, description || 'New version', userInfo);
        setUploadingNewVersion(null);
      } else {
        // Upload as new document
        await uploadDocument(
          {
            file,
            productId,
            type,
            title: uploadTitle,
            description,
          },
          userInfo
        );
      }

      setShowUploadModal(false);
    },
    [productId, userId, userName, userRole, uploadDocument, uploadNewVersion, uploadingNewVersion]
  );

  // Close modals
  const handleCloseViewer = useCallback(() => {
    selectDocument(null);
  }, [selectDocument]);

  const handleCloseVersionHistory = useCallback(() => {
    setShowVersionHistory(false);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setShowUploadModal(false);
    setUploadingNewVersion(null);
  }, []);

  return (
    <div style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <DocumentList
          documents={documents}
          title={title}
          onView={handleView}
          onDownload={handleDownload}
          onVersionHistory={handleVersionHistory}
          onUploadNewVersion={handleUploadNewVersion}
          onUploadNew={showUploadButton ? () => setShowUploadModal(true) : undefined}
          compact={compact}
          emptyMessage="No documents have been uploaded yet"
        />
      )}

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={selectedDocument}
        isOpen={!!selectedDocument && !showVersionHistory}
        onClose={handleCloseViewer}
        onDownload={handleDownload}
        onVersionHistory={handleVersionHistory}
        onUploadNewVersion={handleUploadNewVersion}
      />

      {/* Version History Modal */}
      <DocumentVersionHistory
        document={selectedDocument}
        isOpen={showVersionHistory}
        onClose={handleCloseVersionHistory}
        onDownloadVersion={handleDownloadVersion}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={handleCloseUploadModal}
        title={uploadingNewVersion ? `Upload New Version: ${uploadingNewVersion.title}` : 'Upload Documents'}
        size="lg"
      >
        <DocumentUploader
          productId={productId}
          userRole={userRole}
          allowedTypes={uploadingNewVersion ? [uploadingNewVersion.type] : allowedTypes}
          onUpload={handleUpload}
          onCancel={handleCloseUploadModal}
        />
        
        {uploadProgress !== null && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DocumentPanel;
