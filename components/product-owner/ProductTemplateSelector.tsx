import React, { useState, useMemo } from 'react';
import { Card, CardBody, Badge, Button } from '../shared';
import {
  ProductTemplateWithDetails,
  ProductCategory,
  getCategoryLabel,
  PRODUCT_TEMPLATES,
} from '../../types/products';
import { ASSET_TYPE_INFO } from '../../utils/constants';

interface ProductTemplateSelectorProps {
  onSelect: (template: ProductTemplateWithDetails) => void;
  selectedTemplateId?: string;
}

/**
 * ProductTemplateSelector - Product Owner Component
 * 
 * Purpose: Select a product template to start the creation process
 * Location: /components/product-owner/
 * Used by: ProductCreationWizard
 */
export const ProductTemplateSelector: React.FC<ProductTemplateSelectorProps> = ({
  onSelect,
  selectedTemplateId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories
  const categories: ProductCategory[] = ['financing', 'investment', 'trade', 'leasing', 'partnership'];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let result = [...PRODUCT_TEMPLATES];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.assetType.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  // Popular templates (show first)
  const popularTemplates = PRODUCT_TEMPLATES.filter((t) => t.isPopular);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* View Toggle */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 px-3 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 px-3 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Templates
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>

      {/* Popular Templates (shown when no filter) */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="text-yellow-500 mr-2">⭐</span>
            Popular Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                onSelect={() => onSelect(template)}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {selectedCategory === 'all' ? 'All Templates' : getCategoryLabel(selectedCategory)}
          <span className="text-gray-400 ml-2">({filteredTemplates.length})</span>
        </h3>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No templates found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                onSelect={() => onSelect(template)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <TemplateListItem
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                onSelect={() => onSelect(template)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --------------------------------------------
// Template Card Component
// --------------------------------------------

interface TemplateCardProps {
  template: ProductTemplateWithDetails;
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  compact = false,
}) => {
  const assetInfo = ASSET_TYPE_INFO[template.assetType];

  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-lg border-2 transition-all p-4
        ${isSelected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
        }
      `}
    >
      {/* Popular Badge */}
      {template.isPopular && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⭐ Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start space-x-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ backgroundColor: `${template.color}20` }}
        >
          {template.iconEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 line-clamp-1">{template.name}</h4>
          <p className="text-sm text-gray-500">{assetInfo?.label || template.assetType}</p>
        </div>
      </div>

      {/* Description */}
      {!compact && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{template.description}</p>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="default" size="sm">
            {getCategoryLabel(template.category)}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">
          ~{template.estimatedDuration} days
        </span>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// --------------------------------------------
// Template List Item Component
// --------------------------------------------

const TemplateListItem: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  const assetInfo = ASSET_TYPE_INFO[template.assetType];

  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all
        ${isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: `${template.color}20` }}
        >
          {template.iconEmoji}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            {template.isPopular && (
              <span className="text-yellow-500 text-sm">⭐</span>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-1">{template.description}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <Badge variant="default" size="sm">
            {assetInfo?.label || template.assetType}
          </Badge>
          <p className="text-xs text-gray-400 mt-1">~{template.estimatedDuration} days</p>
        </div>
        {isSelected ? (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
        )}
      </div>
    </div>
  );
};

export default ProductTemplateSelector;
