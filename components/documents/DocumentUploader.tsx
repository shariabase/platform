import React, { useState, useRef, useCallback } from 'react';
import { Button, Badge } from '../shared';
import { DocumentType, UserRole } from '../../types';
import { DOCUMENT_TYPE_CONFIGS, DocumentTypeConfig } from '../../types/documents';
import {
  validateFile,
  formatFileSize,
  getFileTypeInfo,
  getAllowedDocumentTypes,
} from '../../utils/documentHelpers';

interface DocumentUploaderProps {
  productId: string;
  userRole: UserRole;
  onUpload: (file: File, type: DocumentType, title: string, description?: string) => Promise<void>;
  onCancel?: () => void;
  allowedTypes?: DocumentType[];
  maxFiles?: number;
}

interface SelectedFile {
  file: File;
  type: DocumentType;
  title: string;
  description: string;
  errors: string[];
  isValid: boolean;
}

/**
 * DocumentUploader - Document Management Component
 * 
 * Purpose: Drag-and-drop file upload with type selection and validation
 * Location: /components/documents/
 * Used by: All role pages that can upload documents
 * Shared: Yes - used across multiple role pages
 */
export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  productId,
  userRole,
  onUpload,
  onCancel,
  allowedTypes,
  maxFiles = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get allowed document types based on user role
  const availableTypes = allowedTypes || getAllowedDocumentTypes(userRole);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Process dropped or selected files
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).slice(0, maxFiles - selectedFiles.length);

      const newSelectedFiles: SelectedFile[] = fileArray.map((file) => {
        // Try to auto-detect document type based on user role
        const defaultType = availableTypes[0];
        const validation = validateFile(file, defaultType);

        return {
          file,
          type: defaultType,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          description: '',
          errors: validation.errors,
          isValid: validation.valid,
        };
      });

      setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);
    },
    [availableTypes, maxFiles, selectedFiles.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const { files } = e.dataTransfer;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFiles]
  );

  // Update file metadata
  const updateFile = useCallback(
    (index: number, updates: Partial<SelectedFile>) => {
      setSelectedFiles((prev) =>
        prev.map((f, i) => {
          if (i !== index) return f;

          const updated = { ...f, ...updates };

          // Re-validate if type changed
          if (updates.type) {
            const validation = validateFile(f.file, updates.type);
            updated.errors = validation.errors;
            updated.isValid = validation.valid;
          }

          return updated;
        })
      );
    },
    []
  );

  // Remove a file
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Upload all files
  const handleUploadAll = useCallback(async () => {
    const validFiles = selectedFiles.filter((f) => f.isValid);
    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (const selectedFile of validFiles) {
        setUploadProgress((prev) => ({ ...prev, [selectedFile.file.name]: 0 }));

        await onUpload(
          selectedFile.file,
          selectedFile.type,
          selectedFile.title,
          selectedFile.description || undefined
        );

        setUploadProgress((prev) => ({ ...prev, [selectedFile.file.name]: 100 }));
      }

      // Clear files after successful upload
      setSelectedFiles([]);
      setUploadProgress({});
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFiles, onUpload]);

  const allValid = selectedFiles.length > 0 && selectedFiles.every((f) => f.isValid);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
          ${selectedFiles.length >= maxFiles ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept={availableTypes
            .flatMap((t) => DOCUMENT_TYPE_CONFIGS[t].acceptedFormats)
            .join(',')}
        />

        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className={`w-6 h-6 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or click to browse
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {availableTypes.map((type) => (
              <Badge key={type} variant="default" size="sm">
                {DOCUMENT_TYPE_CONFIGS[type].label}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Max {maxFiles} files • PDF, DOCX, XLSX, PPTX
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length})
          </h4>

          {selectedFiles.map((selectedFile, index) => {
            const fileInfo = getFileTypeInfo(selectedFile.file.name);
            const progress = uploadProgress[selectedFile.file.name];

            return (
              <div
                key={`${selectedFile.file.name}-${index}`}
                className={`
                  p-4 border rounded-lg
                  ${selectedFile.isValid ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'}
                `}
              >
                <div className="flex items-start justify-between">
                  {/* File Info */}
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${fileInfo.color}20` }}
                    >
                      <span>{fileInfo.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Title Input */}
                      <input
                        type="text"
                        value={selectedFile.title}
                        onChange={(e) => updateFile(index, { title: e.target.value })}
                        placeholder="Document title"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                      {/* Type Selector */}
                      <select
                        value={selectedFile.type}
                        onChange={(e) =>
                          updateFile(index, { type: e.target.value as DocumentType })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {availableTypes.map((type) => (
                          <option key={type} value={type}>
                            {DOCUMENT_TYPE_CONFIGS[type].label}
                          </option>
                        ))}
                      </select>

                      {/* Description Input */}
                      <textarea
                        value={selectedFile.description}
                        onChange={(e) => updateFile(index, { description: e.target.value })}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                      {/* File Meta */}
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{selectedFile.file.name}</span>
                        <span>•</span>
                        <span>{formatFileSize(selectedFile.file.size)}</span>
                      </div>

                      {/* Errors */}
                      {selectedFile.errors.length > 0 && (
                        <div className="text-xs text-red-600">
                          {selectedFile.errors.map((error, i) => (
                            <p key={i}>⚠️ {error}</p>
                          ))}
                        </div>
                      )}

                      {/* Upload Progress */}
                      {progress !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-500 ml-2"
                    disabled={isUploading}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-500">
            {selectedFiles.filter((f) => f.isValid).length} of {selectedFiles.length} files ready
          </p>
          <div className="flex space-x-2">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel} disabled={isUploading}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleUploadAll}
              disabled={!allValid || isUploading}
              isLoading={isUploading}
            >
              Upload {selectedFiles.filter((f) => f.isValid).length} File
              {selectedFiles.filter((f) => f.isValid).length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
