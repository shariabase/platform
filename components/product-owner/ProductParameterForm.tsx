import React, { useState, useEffect } from 'react';
import { Badge } from '../shared';
import { ProductTemplateWithDetails, JURISDICTION_CONFIGS, SUPPORTED_CURRENCIES, JurisdictionConfig } from '../../types/products';
import { ParameterDefinition, Jurisdiction } from '../../types';

interface ProductParameterFormProps {
  template: ProductTemplateWithDetails;
  values: Record<string, string | number | Date | boolean>;
  onChange: (values: Record<string, string | number | Date | boolean>) => void;
  errors?: Record<string, string>;
}

/**
 * ProductParameterForm - Product Owner Component
 * 
 * Purpose: Dynamic form for entering product parameters based on template
 * Location: /components/product-owner/
 * Used by: ProductCreationWizard
 */
export const ProductParameterForm: React.FC<ProductParameterFormProps> = ({
  template,
  values,
  onChange,
  errors = {},
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Get jurisdiction config for currency default
  const jurisdictionConfig = values.jurisdiction
    ? JURISDICTION_CONFIGS[values.jurisdiction as Jurisdiction]
    : null;

  useEffect(() => {
    if (jurisdictionConfig) {
      setSelectedCurrency(jurisdictionConfig.currency);
    }
  }, [jurisdictionConfig]);

  const handleChange = (key: string, value: string | number | Date | boolean) => {
    onChange({ ...values, [key]: value });
  };

  const renderField = (param: ParameterDefinition) => {
    const value = values[param.key];
    const error = errors[param.key];
    const fieldId = `param-${param.key}`;

    const baseInputClasses = `
      w-full px-3 py-2 border rounded-lg transition-colors
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
      ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
    `;

    switch (param.type) {
      case 'currency':
        return (
          <div key={param.key} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
              <input
                id={fieldId}
                type="number"
                value={value as number || ''}
                onChange={(e) => handleChange(param.key, parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min={param.validation?.min}
                max={param.validation?.max}
                className={`${baseInputClasses} rounded-l-none flex-1`}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={param.key} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={fieldId}
              type="number"
              value={value as number || ''}
              onChange={(e) => handleChange(param.key, parseFloat(e.target.value) || 0)}
              min={param.validation?.min}
              max={param.validation?.max}
              className={baseInputClasses}
            />
            {param.validation && (
              <p className="text-xs text-gray-500">
                Range: {param.validation.min} - {param.validation.max}
              </p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={param.key} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={fieldId}
              value={value as string || ''}
              onChange={(e) => handleChange(param.key, e.target.value)}
              className={baseInputClasses}
            >
              <option value="">Select {param.label}</option>
              {param.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={param.key} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={fieldId}
              type="date"
              value={value ? new Date(value as Date).toISOString().split('T')[0] : ''}
              onChange={(e) => handleChange(param.key, new Date(e.target.value))}
              className={baseInputClasses}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'string':
      default:
        return (
          <div key={param.key} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
              {param.label}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={fieldId}
              type="text"
              value={value as string || ''}
              onChange={(e) => handleChange(param.key, e.target.value)}
              className={baseInputClasses}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Info Header */}
      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${template.color}20` }}
        >
          {template.iconEmoji}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
        </div>
      </div>

      {/* Parameter Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {template.requiredParameters.map((param) => renderField(param))}
      </div>

      {/* Compliance Requirements Info */}
      {template.complianceRequirements.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Compliance Standards
          </h4>
          <div className="flex flex-wrap gap-2">
            {template.complianceRequirements.map((req) => (
              <Badge key={req} variant="info" size="sm">
                {req}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors Info */}
      {template.riskFactors.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Key Risk Factors
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {template.riskFactors.map((risk) => (
              <li key={risk} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductParameterForm;
