import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Badge, Card, CardBody } from '../shared';
import { ProductTemplateSelector } from './ProductTemplateSelector';
import { ProductParameterForm } from './ProductParameterForm';
import { DocumentUploader } from '../documents/DocumentUploader';
import {
  ProductTemplateWithDetails,
  ProductCreationData,
  JURISDICTION_CONFIGS,
  JurisdictionConfig,
} from '../../types/products';
import { Jurisdiction, UserRole } from '../../types';
import { ASSET_TYPE_INFO } from '../../utils/constants';

interface ProductCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreationData) => Promise<void>;
  userId: string;
  userName: string;
  userRole: UserRole;
}

type WizardStep = 'template' | 'basic-info' | 'parameters' | 'documents' | 'review';

interface WizardState {
  currentStep: WizardStep;
  selectedTemplate: ProductTemplateWithDetails | null;
  productName: string;
  productDescription: string;
  jurisdiction: Jurisdiction | '';
  tenor: number;
  parameters: Record<string, string | number | Date | boolean>;
  uploadedFiles: File[];
}

const STEPS: { id: WizardStep; title: string; description: string }[] = [
  { id: 'template', title: 'Select Template', description: 'Choose a product template' },
  { id: 'basic-info', title: 'Basic Information', description: 'Product name and jurisdiction' },
  { id: 'parameters', title: 'Parameters', description: 'Configure product parameters' },
  { id: 'documents', title: 'Documents', description: 'Upload supporting documents' },
  { id: 'review', title: 'Review', description: 'Review and submit' },
];

/**
 * ProductCreationWizard - Product Owner Component
 * 
 * Purpose: Multi-step wizard for creating new products
 * Location: /components/product-owner/
 * Used by: ProductOwnerPage
 */
export const ProductCreationWizard: React.FC<ProductCreationWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  userName,
  userRole,
}) => {
  const [state, setState] = useState<WizardState>({
    currentStep: 'template',
    selectedTemplate: null,
    productName: '',
    productDescription: '',
    jurisdiction: '',
    tenor: 12,
    parameters: {},
    uploadedFiles: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Current step index
  const currentStepIndex = STEPS.findIndex((s) => s.id === state.currentStep);

  // Validation for each step
  const validateStep = useCallback((step: WizardStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'template':
        if (!state.selectedTemplate) {
          newErrors.template = 'Please select a template';
        }
        break;

      case 'basic-info':
        if (!state.productName.trim()) {
          newErrors.productName = 'Product name is required';
        }
        if (!state.jurisdiction) {
          newErrors.jurisdiction = 'Jurisdiction is required';
        }
        if (!state.tenor || state.tenor < 1) {
          newErrors.tenor = 'Valid tenor is required';
        }
        break;

      case 'parameters':
        if (state.selectedTemplate) {
          state.selectedTemplate.requiredParameters.forEach((param) => {
            if (param.required && !state.parameters[param.key]) {
              newErrors[param.key] = `${param.label} is required`;
            }
            // Validate range
            if (param.validation && state.parameters[param.key]) {
              const value = state.parameters[param.key] as number;
              if (param.validation.min !== undefined && value < param.validation.min) {
                newErrors[param.key] = `Minimum value is ${param.validation.min}`;
              }
              if (param.validation.max !== undefined && value > param.validation.max) {
                newErrors[param.key] = `Maximum value is ${param.validation.max}`;
              }
            }
          });
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state]);

  // Navigation
  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const goNext = useCallback(() => {
    if (!validateStep(state.currentStep)) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setState((prev) => ({ ...prev, currentStep: STEPS[nextIndex].id }));
    }
  }, [state.currentStep, currentStepIndex, validateStep]);

  const goBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setState((prev) => ({ ...prev, currentStep: STEPS[prevIndex].id }));
    }
  }, [currentStepIndex]);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: ProductTemplateWithDetails) => {
    setState((prev) => ({
      ...prev,
      selectedTemplate: template,
      productName: `${template.name} - ${new Date().toLocaleDateString()}`,
      parameters: {},
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateStep('review')) return;
    if (!state.selectedTemplate || !state.jurisdiction) return;

    setIsSubmitting(true);

    try {
      const data: ProductCreationData = {
        templateId: state.selectedTemplate.id,
        name: state.productName,
        description: state.productDescription || undefined,
        assetType: state.selectedTemplate.assetType,
        jurisdiction: state.jurisdiction,
        tenor: state.tenor,
        parameters: state.parameters,
        initialDocuments: state.uploadedFiles,
      };

      await onSubmit(data);
      
      // Reset wizard
      setState({
        currentStep: 'template',
        selectedTemplate: null,
        productName: '',
        productDescription: '',
        jurisdiction: '',
        tenor: 12,
        parameters: {},
        uploadedFiles: [],
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, validateStep, onSubmit, onClose]);

  // Render step content
  const renderStepContent = () => {
    switch (state.currentStep) {
      case 'template':
        return (
          <ProductTemplateSelector
            onSelect={handleTemplateSelect}
            selectedTemplateId={state.selectedTemplate?.id}
          />
        );

      case 'basic-info':
        return (
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.productName}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, productName: e.target.value }))
                }
                placeholder="Enter product name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.productName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.productName && (
                <p className="text-sm text-red-600 mt-1">{errors.productName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={state.productDescription}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, productDescription: e.target.value }))
                }
                placeholder="Optional description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jurisdiction <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.values(JURISDICTION_CONFIGS) as JurisdictionConfig[]).map((config) => (
                  <button
                    key={config.code}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, jurisdiction: config.code }))
                    }
                    className={`p-3 border-2 rounded-lg text-left transition-colors ${
                      state.jurisdiction === config.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{config.flag}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{config.code}</p>
                        <p className="text-xs text-gray-500">{config.currency}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.jurisdiction && (
                <p className="text-sm text-red-600 mt-1">{errors.jurisdiction}</p>
              )}
            </div>

            {/* Tenor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenor (months) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={state.tenor}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, tenor: parseInt(e.target.value) || 0 }))
                }
                min={1}
                max={360}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tenor ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.tenor && (
                <p className="text-sm text-red-600 mt-1">{errors.tenor}</p>
              )}
            </div>
          </div>
        );

      case 'parameters':
        return state.selectedTemplate ? (
          <ProductParameterForm
            template={state.selectedTemplate}
            values={state.parameters}
            onChange={(params) => setState((prev) => ({ ...prev, parameters: params }))}
            errors={errors}
          />
        ) : null;

      case 'documents':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload supporting documents for your product. These will be available for review
              during the approval workflow.
            </p>

            {state.selectedTemplate && state.selectedTemplate.requiredDocuments.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  Required Documents
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {state.selectedTemplate.requiredDocuments.map((doc) => (
                    <li key={doc.type} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 mt-1.5" />
                      <div>
                        <span className="font-medium">{doc.label}</span>
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                        <span className="text-yellow-600 ml-1">({doc.stage})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DocumentUploader
              productId="new-product"
              userRole={userRole}
              onUpload={async (file) => {
                setState((prev) => ({
                  ...prev,
                  uploadedFiles: [...prev.uploadedFiles, file],
                }));
              }}
            />

            {state.uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Files ({state.uploadedFiles.length})
                </h4>
                <ul className="space-y-2">
                  {state.uploadedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardBody>
                <h3 className="font-semibold text-gray-900 mb-4">Product Summary</h3>
                
                <div className="space-y-4">
                  {/* Template */}
                  {state.selectedTemplate && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${state.selectedTemplate.color}20` }}
                      >
                        {state.selectedTemplate.iconEmoji}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{state.selectedTemplate.name}</p>
                        <p className="text-sm text-gray-500">
                          {ASSET_TYPE_INFO[state.selectedTemplate.assetType]?.label}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Product Name</p>
                      <p className="font-medium">{state.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jurisdiction</p>
                      <p className="font-medium">
                        {state.jurisdiction && JURISDICTION_CONFIGS[state.jurisdiction]?.flag}{' '}
                        {state.jurisdiction}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tenor</p>
                      <p className="font-medium">{state.tenor} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Documents</p>
                      <p className="font-medium">{state.uploadedFiles.length} uploaded</p>
                    </div>
                  </div>

                  {/* Parameters */}
                  {Object.keys(state.parameters).length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Parameters</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(state.parameters).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-gray-500">{key}:</span>{' '}
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Workflow Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                What happens next?
              </h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Product will be created in Draft status</li>
                <li>Workflow will be initiated for Sharia review</li>
                <li>Sharia Board will review and provide approval</li>
                <li>Legal & Compliance will review contracts</li>
                <li>Risk team will assess and approve</li>
                <li>Engineering will implement and deploy</li>
              </ol>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Product"
      size="xl"
    >
      <div className="flex flex-col h-[70vh]">
        {/* Progress Steps */}
        <div className="flex-shrink-0 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = step.id === state.currentStep;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => isComplete && goToStep(step.id)}
                    disabled={!isComplete}
                    className={`flex items-center ${isComplete ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${isComplete
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}
                    >
                      {isComplete ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="ml-2 hidden md:block">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={currentStepIndex === 0 ? onClose : goBack}
          >
            {currentStepIndex === 0 ? 'Cancel' : 'Back'}
          </Button>

          {state.currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Create Product
            </Button>
          ) : (
            <Button onClick={goNext}>
              Continue
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductCreationWizard;
