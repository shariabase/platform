// ============================================
// DOCUMENT HELPER UTILITIES
// Hash generation, file validation, formatting
// ============================================

import { DocumentType, UserRole } from '../types';
import {
  DOCUMENT_TYPE_CONFIGS,
  FILE_TYPE_INFO,
  DocumentPermissions,
  ROLE_DOCUMENT_PERMISSIONS,
} from '../types/documents';

// --------------------------------------------
// Hash Generation (Simulated - would use crypto in production)
// --------------------------------------------

/**
 * Generate a SHA-256 hash for a file
 * In production, this would use the Web Crypto API
 */
export const generateFileHash = async (file: File): Promise<string> => {
  // In production, use:
  // const buffer = await file.arrayBuffer();
  // const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  // return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Simulated hash for development
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `sha256-${timestamp}-${randomPart}-${file.name.length}`;
};

/**
 * Verify a file's hash matches the stored hash
 */
export const verifyFileHash = async (file: File, storedHash: string): Promise<boolean> => {
  const currentHash = await generateFileHash(file);
  // In production, compare actual hashes
  // For development, always return true if hash exists
  return storedHash.startsWith('sha256-');
};

// --------------------------------------------
// File Validation
// --------------------------------------------

/**
 * Validate file type against document type configuration
 */
export const validateFileType = (
  file: File,
  documentType: DocumentType
): { valid: boolean; error?: string } => {
  const config = DOCUMENT_TYPE_CONFIGS[documentType];
  const extension = getFileExtension(file.name).toLowerCase();

  if (!config.acceptedFormats.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted formats: ${config.acceptedFormats.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Validate file size against document type configuration
 */
export const validateFileSize = (
  file: File,
  documentType: DocumentType
): { valid: boolean; error?: string } => {
  const config = DOCUMENT_TYPE_CONFIGS[documentType];
  const sizeMB = file.size / (1024 * 1024);

  if (sizeMB > config.maxSizeMB) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${config.maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Full file validation
 */
export const validateFile = (
  file: File,
  documentType: DocumentType
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const typeValidation = validateFileType(file, documentType);
  if (!typeValidation.valid && typeValidation.error) {
    errors.push(typeValidation.error);
  }

  const sizeValidation = validateFileSize(file, documentType);
  if (!sizeValidation.valid && sizeValidation.error) {
    errors.push(sizeValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// --------------------------------------------
// File Info Helpers
// --------------------------------------------

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.slice(lastDot) : '';
};

/**
 * Get file type info from filename
 */
export const getFileTypeInfo = (filename: string) => {
  const extension = getFileExtension(filename).toLowerCase().replace('.', '');
  return FILE_TYPE_INFO[extension] || {
    extension: `.${extension}`,
    mimeType: 'application/octet-stream',
    icon: '📁',
    color: '#6B7280',
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format date for display
 */
export const formatDocumentDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDocumentDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// --------------------------------------------
// Permission Helpers
// --------------------------------------------

/**
 * Check if a role can upload a specific document type
 */
export const canUploadDocumentType = (
  userRole: UserRole,
  documentType: DocumentType
): boolean => {
  const config = DOCUMENT_TYPE_CONFIGS[documentType];
  return config.allowedRoles.includes(userRole);
};

/**
 * Get document permissions for a role
 */
export const getDocumentPermissions = (userRole: UserRole): DocumentPermissions => {
  return ROLE_DOCUMENT_PERMISSIONS[userRole];
};

/**
 * Get allowed document types for a role
 */
export const getAllowedDocumentTypes = (userRole: UserRole): DocumentType[] => {
  return (Object.keys(DOCUMENT_TYPE_CONFIGS) as DocumentType[]).filter((type) =>
    DOCUMENT_TYPE_CONFIGS[type].allowedRoles.includes(userRole)
  );
};

// --------------------------------------------
// Document Type Helpers
// --------------------------------------------

/**
 * Get document type configuration
 */
export const getDocumentTypeConfig = (type: DocumentType) => {
  return DOCUMENT_TYPE_CONFIGS[type];
};

/**
 * Get document type label
 */
export const getDocumentTypeLabel = (type: DocumentType): string => {
  return DOCUMENT_TYPE_CONFIGS[type]?.label || type;
};

/**
 * Get document type color
 */
export const getDocumentTypeColor = (type: DocumentType): string => {
  return DOCUMENT_TYPE_CONFIGS[type]?.color || '#6B7280';
};

// --------------------------------------------
// Version Helpers
// --------------------------------------------

/**
 * Generate version label (v1, v2, etc.)
 */
export const getVersionLabel = (version: number): string => {
  return `v${version}`;
};

/**
 * Compare two versions
 */
export const compareVersions = (a: number, b: number): number => {
  return b - a; // Descending (newest first)
};

// --------------------------------------------
// Search & Filter Helpers
// --------------------------------------------

/**
 * Filter documents by search query
 */
export const searchDocuments = <T extends { title: string; description?: string }>(
  documents: T[],
  query: string
): T[] => {
  if (!query.trim()) return documents;

  const lowerQuery = query.toLowerCase();
  return documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.description?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort documents by field
 */
export const sortDocuments = <T extends Record<string, unknown>>(
  documents: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...documents].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
};
