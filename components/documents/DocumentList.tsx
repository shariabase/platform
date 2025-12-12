import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody, Button, Badge } from '../shared';
import { DocumentCard } from './DocumentCard';
import { DocumentType } from '../../types';
import { DocumentWithVersions, DocumentFilters, DocumentSortOptions } from '../../types/documents';
import { DOCUMENT_TYPE_CONFIGS } from '../../types/documents';
import { searchDocuments, sortDocuments } from '../../utils/documentHelpers';

interface DocumentListProps {
  documents: DocumentWithVersions[];
  title?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  onView: (document: DocumentWithVersions) => void;
  onDownload: (document: DocumentWithVersions) => void;
  onVersionHistory: (document: DocumentWithVersions) => void;
  onUploadNewVersion?: (document: DocumentWithVersions) => void;
  onUploadNew?: () => void;
  emptyMessage?: string;
  viewMode?: 'grid' | 'list';
  compact?: boolean;
}

/**
 * DocumentList - Document Management Component
 * 
 * Purpose: Displays filterable, sortable list of documents
 * Location: /components/documents/
 * Used by: All role pages that display documents
 * Shared: Yes - used across multiple role pages
 */
export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  title = 'Documents',
  showFilters = true,
  showSearch = true,
  onView,
  onDownload,
  onVersionHistory,
  onUploadNewVersion,
  onUploadNew,
  emptyMessage = 'No documents found',
  viewMode: initialViewMode = 'grid',
  compact = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>([]);
  const [sortOption, setSortOption] = useState<DocumentSortOptions>({
    field: 'uploadedAt',
    direction: 'desc',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  // Get unique document types from the list
  const availableTypes = useMemo(() => {
    const types = new Set(documents.map((d) => d.type));
    return Array.from(types);
  }, [documents]);

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter((d) => selectedTypes.includes(d.type));
    }

    // Apply search
    if (searchQuery) {
      result = searchDocuments(result, searchQuery);
    }

    // Apply sort
    result = sortDocuments(result, sortOption.field, sortOption.direction) as DocumentWithVersions[];

    return result;
  }, [documents, selectedTypes, searchQuery, sortOption]);

  // Toggle type filter
  const toggleTypeFilter = (type: DocumentType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSortOption({ field: 'uploadedAt', direction: 'desc' });
  };

  const hasActiveFilters = searchQuery || selectedTypes.length > 0;

  return (
    <Card padding="none">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <Badge variant="default" size="sm">
              {filteredDocuments.length}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Grid view"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="List view"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Upload Button */}
            {onUploadNew && (
              <Button
                size="sm"
                onClick={onUploadNew}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Upload
              </Button>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        {(showSearch || showFilters) && (
          <div className="mt-4 space-y-3">
            {/* Search */}
            {showSearch && (
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Type Filters */}
            {showFilters && availableTypes.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Filter:</span>
                {availableTypes.map((type) => {
                  const config = DOCUMENT_TYPE_CONFIGS[type];
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleTypeFilter(type)}
                      className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors
                        ${isSelected
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                      style={isSelected ? { backgroundColor: config.color } : undefined}
                    >
                      <span className="mr-1">{config.icon}</span>
                      {config.label}
                      {isSelected && (
                        <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 ml-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* Sort Options */}
            {showFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={`${sortOption.field}-${sortOption.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-') as [
                      DocumentSortOptions['field'],
                      DocumentSortOptions['direction']
                    ];
                    setSortOption({ field, direction });
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="uploadedAt-desc">Newest first</option>
                  <option value="uploadedAt-asc">Oldest first</option>
                  <option value="title-asc">Name (A-Z)</option>
                  <option value="title-desc">Name (Z-A)</option>
                  <option value="type-asc">Type (A-Z)</option>
                  <option value="version-desc">Version (highest)</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Grid/List */}
      <div className="p-4">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">{emptyMessage}</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
            {onUploadNew && !hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={onUploadNew}
              >
                Upload your first document
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={onView}
                onDownload={onDownload}
                onVersionHistory={onVersionHistory}
                onUploadNewVersion={onUploadNewVersion}
                compact={compact}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={onView}
                onDownload={onDownload}
                onVersionHistory={onVersionHistory}
                onUploadNewVersion={onUploadNewVersion}
                compact={true}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DocumentList;
