import { useState, useCallback, useMemo } from 'react';
import { Document, DocumentType, UserRole } from '../types';
import {
  DocumentWithVersions,
  DocumentVersion,
  DocumentFilters,
  DocumentSortOptions,
  DocumentUpload,
  DocumentAccessLog,
} from '../types/documents';
import {
  generateFileHash,
  validateFile,
  canUploadDocumentType,
  getDocumentPermissions,
  searchDocuments,
  sortDocuments,
} from '../utils/documentHelpers';

// --------------------------------------------
// Hook State Types
// --------------------------------------------

interface UseDocumentsState {
  documents: DocumentWithVersions[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number | null;
  selectedDocument: DocumentWithVersions | null;
}

interface UseDocumentsReturn extends UseDocumentsState {
  // CRUD Operations
  fetchDocuments: (productId: string) => Promise<void>;
  uploadDocument: (upload: DocumentUpload, userInfo: { id: string; name: string; role: UserRole }) => Promise<DocumentWithVersions>;
  uploadNewVersion: (documentId: string, file: File, changeNotes: string, userInfo: { id: string; name: string; role: UserRole }) => Promise<DocumentVersion>;
  deleteDocument: (documentId: string) => Promise<void>;
  
  // Selection
  selectDocument: (document: DocumentWithVersions | null) => void;
  
  // Filtering & Sorting
  filterDocuments: (filters: DocumentFilters) => DocumentWithVersions[];
  sortedDocuments: (sortOptions: DocumentSortOptions) => DocumentWithVersions[];
  
  // Permissions
  canUpload: (userRole: UserRole, documentType: DocumentType) => boolean;
  
  // Access Logging
  logAccess: (documentId: string, action: DocumentAccessLog['action'], userInfo: { id: string; name: string; role: UserRole }) => void;
  
  // Utilities
  getDocumentById: (documentId: string) => DocumentWithVersions | undefined;
  getDocumentsByType: (type: DocumentType) => DocumentWithVersions[];
  clearError: () => void;
}

// --------------------------------------------
// Mock Data Generator (for development)
// --------------------------------------------

const generateMockDocuments = (productId: string): DocumentWithVersions[] => {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 86400000);
  const weekAgo = new Date(now.getTime() - 604800000);

  return [
    {
      id: 'doc-1',
      productId,
      type: 'research',
      title: 'Market Analysis Report',
      description: 'Comprehensive market analysis for the proposed Murabaha structure',
      fileUrl: '/documents/market-analysis.pdf',
      version: 2,
      uploadedBy: 'user-1',
      uploadedAt: dayAgo,
      hash: 'sha256-abc123-market',
      previousVersionId: 'doc-1-v1',
      versions: [
        {
          id: 'doc-1-v2',
          documentId: 'doc-1',
          version: 2,
          fileUrl: '/documents/market-analysis-v2.pdf',
          fileSize: 2500000,
          hash: 'sha256-abc123-market-v2',
          uploadedBy: 'user-1',
          uploadedByName: 'Mohammed Ali',
          uploadedAt: dayAgo,
          changeNotes: 'Updated with Q4 data and revised projections',
        },
        {
          id: 'doc-1-v1',
          documentId: 'doc-1',
          version: 1,
          fileUrl: '/documents/market-analysis-v1.pdf',
          fileSize: 2100000,
          hash: 'sha256-abc123-market-v1',
          uploadedBy: 'user-1',
          uploadedByName: 'Mohammed Ali',
          uploadedAt: weekAgo,
          changeNotes: 'Initial version',
        },
      ],
      currentVersion: {
        id: 'doc-1-v2',
        documentId: 'doc-1',
        version: 2,
        fileUrl: '/documents/market-analysis-v2.pdf',
        fileSize: 2500000,
        hash: 'sha256-abc123-market-v2',
        uploadedBy: 'user-1',
        uploadedByName: 'Mohammed Ali',
        uploadedAt: dayAgo,
        changeNotes: 'Updated with Q4 data and revised projections',
      },
      accessLog: [],
    },
    {
      id: 'doc-2',
      productId,
      type: 'contract-draft',
      title: 'Master Murabaha Agreement - Draft',
      description: 'Draft master agreement for customer financing',
      fileUrl: '/documents/master-agreement-draft.pdf',
      version: 1,
      uploadedBy: 'user-3',
      uploadedAt: dayAgo,
      hash: 'sha256-def456-contract',
      versions: [
        {
          id: 'doc-2-v1',
          documentId: 'doc-2',
          version: 1,
          fileUrl: '/documents/master-agreement-draft.pdf',
          fileSize: 1800000,
          hash: 'sha256-def456-contract',
          uploadedBy: 'user-3',
          uploadedByName: 'Sarah Legal',
          uploadedAt: dayAgo,
          changeNotes: 'Initial draft for review',
        },
      ],
      currentVersion: {
        id: 'doc-2-v1',
        documentId: 'doc-2',
        version: 1,
        fileUrl: '/documents/master-agreement-draft.pdf',
        fileSize: 1800000,
        hash: 'sha256-def456-contract',
        uploadedBy: 'user-3',
        uploadedByName: 'Sarah Legal',
        uploadedAt: dayAgo,
        changeNotes: 'Initial draft for review',
      },
      accessLog: [],
    },
    {
      id: 'doc-3',
      productId,
      type: 'fatwa',
      title: 'Fatwa on Murabaha Structure',
      description: 'Sharia ruling on the proposed home financing structure',
      fileUrl: '/documents/fatwa-murabaha.pdf',
      version: 1,
      uploadedBy: 'user-5',
      uploadedAt: now,
      hash: 'sha256-ghi789-fatwa',
      versions: [
        {
          id: 'doc-3-v1',
          documentId: 'doc-3',
          version: 1,
          fileUrl: '/documents/fatwa-murabaha.pdf',
          fileSize: 500000,
          hash: 'sha256-ghi789-fatwa',
          uploadedBy: 'user-5',
          uploadedByName: 'Dr. Ahmed Hassan',
          uploadedAt: now,
          changeNotes: 'Official fatwa issuance',
        },
      ],
      currentVersion: {
        id: 'doc-3-v1',
        documentId: 'doc-3',
        version: 1,
        fileUrl: '/documents/fatwa-murabaha.pdf',
        fileSize: 500000,
        hash: 'sha256-ghi789-fatwa',
        uploadedBy: 'user-5',
        uploadedByName: 'Dr. Ahmed Hassan',
        uploadedAt: now,
        changeNotes: 'Official fatwa issuance',
      },
      accessLog: [],
    },
  ];
};

// --------------------------------------------
// Main Hook
// --------------------------------------------

export const useDocuments = (initialProductId?: string): UseDocumentsReturn => {
  const [state, setState] = useState<UseDocumentsState>({
    documents: [],
    isLoading: false,
    error: null,
    uploadProgress: null,
    selectedDocument: null,
  });

  // Fetch documents for a product
  const fetchDocuments = useCallback(async (productId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockDocs = generateMockDocuments(productId);

      setState((prev) => ({
        ...prev,
        documents: mockDocs,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch documents',
      }));
    }
  }, []);

  // Upload a new document
  const uploadDocument = useCallback(
    async (
      upload: DocumentUpload,
      userInfo: { id: string; name: string; role: UserRole }
    ): Promise<DocumentWithVersions> => {
      // Validate permissions
      if (!canUploadDocumentType(userInfo.role, upload.type)) {
        throw new Error(`You don't have permission to upload ${upload.type} documents`);
      }

      // Validate file
      const validation = validateFile(upload.file, upload.type);
      if (!validation.valid) {
        throw new Error(validation.errors.join('. '));
      }

      setState((prev) => ({ ...prev, uploadProgress: 0, error: null }));

      try {
        // Generate hash
        const hash = await generateFileHash(upload.file);

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setState((prev) => ({ ...prev, uploadProgress: i }));
        }

        // TODO: Replace with actual API call
        const now = new Date();
        const newDocId = `doc-${Date.now()}`;
        const newVersionId = `${newDocId}-v1`;

        const newVersion: DocumentVersion = {
          id: newVersionId,
          documentId: newDocId,
          version: 1,
          fileUrl: URL.createObjectURL(upload.file), // In production, this would be a server URL
          fileSize: upload.file.size,
          hash,
          uploadedBy: userInfo.id,
          uploadedByName: userInfo.name,
          uploadedAt: now,
          changeNotes: 'Initial upload',
        };

        const newDocument: DocumentWithVersions = {
          id: newDocId,
          productId: upload.productId,
          type: upload.type,
          title: upload.title,
          description: upload.description,
          fileUrl: newVersion.fileUrl,
          version: 1,
          uploadedBy: userInfo.id,
          uploadedAt: now,
          hash,
          versions: [newVersion],
          currentVersion: newVersion,
          accessLog: [],
        };

        setState((prev) => ({
          ...prev,
          documents: [...prev.documents, newDocument],
          uploadProgress: null,
        }));

        return newDocument;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          uploadProgress: null,
          error: 'Failed to upload document',
        }));
        throw err;
      }
    },
    []
  );

  // Upload a new version of an existing document
  const uploadNewVersion = useCallback(
    async (
      documentId: string,
      file: File,
      changeNotes: string,
      userInfo: { id: string; name: string; role: UserRole }
    ): Promise<DocumentVersion> => {
      const existingDoc = state.documents.find((d) => d.id === documentId);
      if (!existingDoc) {
        throw new Error('Document not found');
      }

      // Validate permissions
      if (!canUploadDocumentType(userInfo.role, existingDoc.type)) {
        throw new Error(`You don't have permission to update ${existingDoc.type} documents`);
      }

      // Validate file
      const validation = validateFile(file, existingDoc.type);
      if (!validation.valid) {
        throw new Error(validation.errors.join('. '));
      }

      setState((prev) => ({ ...prev, uploadProgress: 0, error: null }));

      try {
        const hash = await generateFileHash(file);

        // Simulate upload
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setState((prev) => ({ ...prev, uploadProgress: i }));
        }

        const now = new Date();
        const newVersionNumber = existingDoc.version + 1;
        const newVersionId = `${documentId}-v${newVersionNumber}`;

        const newVersion: DocumentVersion = {
          id: newVersionId,
          documentId,
          version: newVersionNumber,
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          hash,
          uploadedBy: userInfo.id,
          uploadedByName: userInfo.name,
          uploadedAt: now,
          changeNotes,
        };

        setState((prev) => ({
          ...prev,
          documents: prev.documents.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  version: newVersionNumber,
                  fileUrl: newVersion.fileUrl,
                  hash,
                  uploadedAt: now,
                  previousVersionId: existingDoc.currentVersion.id,
                  versions: [newVersion, ...doc.versions],
                  currentVersion: newVersion,
                }
              : doc
          ),
          uploadProgress: null,
        }));

        return newVersion;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          uploadProgress: null,
          error: 'Failed to upload new version',
        }));
        throw err;
      }
    },
    [state.documents]
  );

  // Delete a document
  const deleteDocument = useCallback(async (documentId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setState((prev) => ({
        ...prev,
        documents: prev.documents.filter((d) => d.id !== documentId),
        selectedDocument:
          prev.selectedDocument?.id === documentId ? null : prev.selectedDocument,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to delete document',
      }));
      throw err;
    }
  }, []);

  // Select a document
  const selectDocument = useCallback((document: DocumentWithVersions | null) => {
    setState((prev) => ({ ...prev, selectedDocument: document }));
  }, []);

  // Filter documents
  const filterDocuments = useCallback(
    (filters: DocumentFilters): DocumentWithVersions[] => {
      let filtered = [...state.documents];

      if (filters.productId) {
        filtered = filtered.filter((d) => d.productId === filters.productId);
      }

      if (filters.types && filters.types.length > 0) {
        filtered = filtered.filter((d) => filters.types!.includes(d.type));
      }

      if (filters.uploadedBy) {
        filtered = filtered.filter((d) => d.uploadedBy === filters.uploadedBy);
      }

      if (filters.dateFrom) {
        filtered = filtered.filter(
          (d) => new Date(d.uploadedAt) >= filters.dateFrom!
        );
      }

      if (filters.dateTo) {
        filtered = filtered.filter(
          (d) => new Date(d.uploadedAt) <= filters.dateTo!
        );
      }

      if (filters.searchQuery) {
        filtered = searchDocuments(filtered, filters.searchQuery);
      }

      return filtered;
    },
    [state.documents]
  );

  // Sort documents
  const sortedDocuments = useCallback(
    (sortOptions: DocumentSortOptions): DocumentWithVersions[] => {
      return sortDocuments(
        state.documents,
        sortOptions.field,
        sortOptions.direction
      ) as DocumentWithVersions[];
    },
    [state.documents]
  );

  // Check upload permission
  const canUpload = useCallback(
    (userRole: UserRole, documentType: DocumentType): boolean => {
      return canUploadDocumentType(userRole, documentType);
    },
    []
  );

  // Log document access
  const logAccess = useCallback(
    (
      documentId: string,
      action: DocumentAccessLog['action'],
      userInfo: { id: string; name: string; role: UserRole }
    ) => {
      const log: DocumentAccessLog = {
        id: `log-${Date.now()}`,
        documentId,
        userId: userInfo.id,
        userName: userInfo.name,
        userRole: userInfo.role,
        action,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        documents: prev.documents.map((doc) =>
          doc.id === documentId
            ? { ...doc, accessLog: [log, ...doc.accessLog] }
            : doc
        ),
      }));

      // TODO: Also send to API for permanent storage
    },
    []
  );

  // Get document by ID
  const getDocumentById = useCallback(
    (documentId: string): DocumentWithVersions | undefined => {
      return state.documents.find((d) => d.id === documentId);
    },
    [state.documents]
  );

  // Get documents by type
  const getDocumentsByType = useCallback(
    (type: DocumentType): DocumentWithVersions[] => {
      return state.documents.filter((d) => d.type === type);
    },
    [state.documents]
  );

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Load initial documents if productId provided
  useMemo(() => {
    if (initialProductId) {
      fetchDocuments(initialProductId);
    }
  }, [initialProductId, fetchDocuments]);

  return {
    ...state,
    fetchDocuments,
    uploadDocument,
    uploadNewVersion,
    deleteDocument,
    selectDocument,
    filterDocuments,
    sortedDocuments,
    canUpload,
    logAccess,
    getDocumentById,
    getDocumentsByType,
    clearError,
  };
};

export default useDocuments;
