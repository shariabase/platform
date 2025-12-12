import React from 'react';
import { Modal, Button, Avatar, Badge } from '../shared';
import { DocumentWithVersions, DocumentVersion } from '../../types/documents';
import {
  formatFileSize,
  formatDocumentDateTime,
  getVersionLabel,
  getDocumentTypeConfig,
} from '../../utils/documentHelpers';

interface DocumentVersionHistoryProps {
  document: DocumentWithVersions | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadVersion: (version: DocumentVersion) => void;
  onRestoreVersion?: (version: DocumentVersion) => void;
  onCompareVersions?: (versionA: DocumentVersion, versionB: DocumentVersion) => void;
}

/**
 * DocumentVersionHistory - Document Management Component
 * 
 * Purpose: Modal showing version history with download/restore options
 * Location: /components/documents/
 * Used by: All role pages that display documents
 * Shared: Yes - used across multiple role pages
 */
export const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  document,
  isOpen,
  onClose,
  onDownloadVersion,
  onRestoreVersion,
  onCompareVersions,
}) => {
  if (!document) return null;

  const typeConfig = getDocumentTypeConfig(document.type);
  const sortedVersions = [...document.versions].sort((a, b) => b.version - a.version);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Version History"
      size="lg"
    >
      <div className="space-y-4">
        {/* Document Info */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${typeConfig.color}20` }}
          >
            <span className="text-2xl">{typeConfig.icon}</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{document.title}</h3>
            <p className="text-sm text-gray-500">{typeConfig.label}</p>
            <p className="text-xs text-gray-400 mt-1">
              {document.versions.length} version{document.versions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Version Timeline */}
        <div className="relative">
          {sortedVersions.map((version, index) => {
            const isLatest = index === 0;
            const isLast = index === sortedVersions.length - 1;

            return (
              <div key={version.id} className="relative pb-6 last:pb-0">
                {/* Timeline Connector */}
                {!isLast && (
                  <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-200" />
                )}

                <div className="flex items-start space-x-4">
                  {/* Version Number Badge */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10
                      ${isLatest ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                    `}
                  >
                    <span className="text-sm font-medium">{getVersionLabel(version.version)}</span>
                  </div>

                  {/* Version Details */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            Version {version.version}
                          </span>
                          {isLatest && (
                            <Badge variant="success" size="sm">Current</Badge>
                          )}
                        </div>

                        {/* Change Notes */}
                        {version.changeNotes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {version.changeNotes}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                          {/* Uploader */}
                          <div className="flex items-center">
                            <Avatar
                              name={version.uploadedByName}
                              size="xs"
                            />
                            <span className="ml-1">{version.uploadedByName}</span>
                          </div>

                          <span>•</span>

                          {/* Date */}
                          <span>{formatDocumentDateTime(version.uploadedAt)}</span>

                          <span>•</span>

                          {/* Size */}
                          <span>{formatFileSize(version.fileSize)}</span>
                        </div>

                        {/* Hash */}
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <svg className="w-3 h-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="truncate font-mono" title={version.hash}>
                            {version.hash}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownloadVersion(version)}
                          leftIcon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          }
                        >
                          Download
                        </Button>

                        {onRestoreVersion && !isLatest && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRestoreVersion(version)}
                            leftIcon={
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            }
                          >
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compare Versions (if available) */}
        {onCompareVersions && document.versions.length >= 2 && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                const [latest, previous] = sortedVersions;
                onCompareVersions(previous, latest);
              }}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            >
              Compare Latest Versions
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DocumentVersionHistory;
