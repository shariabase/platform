import React from 'react';
import { Badge, Avatar, Button } from '../shared';
import { DocumentWithVersions } from '../../types/documents';
import {
  getDocumentTypeConfig,
  formatFileSize,
  formatDocumentDate,
  getFileTypeInfo,
  getVersionLabel,
} from '../../utils/documentHelpers';

interface DocumentCardProps {
  document: DocumentWithVersions;
  onView: (document: DocumentWithVersions) => void;
  onDownload: (document: DocumentWithVersions) => void;
  onVersionHistory: (document: DocumentWithVersions) => void;
  onUploadNewVersion?: (document: DocumentWithVersions) => void;
  showActions?: boolean;
  compact?: boolean;
}

/**
 * DocumentCard - Document Management Component
 * 
 * Purpose: Displays individual document with metadata and actions
 * Location: /components/documents/
 * Used by: DocumentList, ShariaBoardPage, LegalCompliancePage, etc.
 * Shared: Yes - used across multiple role pages
 */
export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onVersionHistory,
  onUploadNewVersion,
  showActions = true,
  compact = false,
}) => {
  const typeConfig = getDocumentTypeConfig(document.type);
  const fileInfo = getFileTypeInfo(document.fileUrl);

  if (compact) {
    return (
      <div
        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => onView(document)}
      >
        <div className="flex items-center space-x-3 min-w-0">
          {/* File Type Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${typeConfig.color}20` }}
          >
            <span className="text-lg">{typeConfig.icon}</span>
          </div>

          {/* Document Info */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {document.title}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{typeConfig.label}</span>
              <span>•</span>
              <span>{getVersionLabel(document.version)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(document);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => onView(document)}
      >
        <div className="flex items-start justify-between">
          {/* Document Type Badge & Icon */}
          <div className="flex items-start space-x-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${typeConfig.color}20` }}
            >
              <span className="text-2xl">{typeConfig.icon}</span>
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-medium text-gray-900 line-clamp-2">
                {document.title}
              </h3>
              {document.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {document.description}
                </p>
              )}
            </div>
          </div>

          {/* Version Badge */}
          <Badge
            variant="info"
            size="sm"
            className="flex-shrink-0 ml-2"
          >
            {getVersionLabel(document.version)}
          </Badge>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-4 pb-3 border-t border-gray-100 pt-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {/* Document Type */}
          <span
            className="inline-flex items-center px-2 py-1 rounded-full"
            style={{ backgroundColor: `${typeConfig.color}15`, color: typeConfig.color }}
          >
            {typeConfig.label}
          </span>

          {/* File Type */}
          <span className="inline-flex items-center">
            <span className="mr-1">{fileInfo.icon}</span>
            {fileInfo.extension.toUpperCase().replace('.', '')}
          </span>

          {/* File Size */}
          <span>{formatFileSize(document.currentVersion.fileSize)}</span>

          {/* Upload Date */}
          <span>{formatDocumentDate(document.uploadedAt)}</span>
        </div>

        {/* Uploader */}
        <div className="flex items-center mt-3">
          <Avatar
            name={document.currentVersion.uploadedByName}
            size="xs"
          />
          <span className="ml-2 text-xs text-gray-600">
            {document.currentVersion.uploadedByName}
          </span>
          {document.versions.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVersionHistory(document);
              }}
              className="ml-auto text-xs text-blue-600 hover:text-blue-700"
            >
              {document.versions.length} versions
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(document)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
            >
              View
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDownload(document)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Download
            </Button>
          </div>

          {onUploadNewVersion && (
            <Button
              size="sm"
              variant="ghost"
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
      )}

      {/* Hash Verification Badge */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-400">
          <svg className="w-3 h-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="truncate" title={document.hash}>
            Verified: {document.hash.substring(0, 20)}...
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
