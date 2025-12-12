// ============================================
// PRODUCT CREATION & TEMPLATE TYPES
// Extended types for product management
// ============================================

import { AssetType, Jurisdiction, Product, ProductTemplate, ParameterDefinition } from './index';

// --------------------------------------------
// Product Templates
// --------------------------------------------

export interface ProductTemplateWithDetails extends ProductTemplate {
  category: ProductCategory;
  iconEmoji: string;
  color: string;
  estimatedDuration: number; // days to complete workflow
  requiredDocuments: RequiredDocument[];
  complianceRequirements: string[];
  riskFactors: string[];
  isPopular?: boolean;
}

export type ProductCategory = 
  | 'financing'
  | 'investment'
  | 'trade'
  | 'leasing'
  | 'partnership';

export interface RequiredDocument {
  type: string;
  label: string;
  description: string;
  required: boolean;
  stage: 'initiation' | 'sharia-review' | 'legal-review' | 'risk-review';
}

// --------------------------------------------
// Product Creation
// --------------------------------------------

export interface ProductCreationData {
  templateId: string;
  name: string;
  description?: string;
  assetType: AssetType;
  jurisdiction: Jurisdiction;
  tenor: number;
  parameters: Record<string, string | number | Date | boolean>;
  initialDocuments?: File[];
}

export interface ProductCreationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
  fields: string[];
}

export type CreationStepId = 
  | 'template'
  | 'basic-info'
  | 'parameters'
  | 'documents'
  | 'review';

// --------------------------------------------
// Parameter Field Types
// --------------------------------------------

export interface ParameterFieldConfig extends ParameterDefinition {
  placeholder?: string;
  helpText?: string;
  suffix?: string;
  prefix?: string;
  dependsOn?: {
    field: string;
    value: string | number | boolean;
  };
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

// --------------------------------------------
// Jurisdiction Configuration
// --------------------------------------------

export interface JurisdictionConfig {
  code: Jurisdiction;
  name: string;
  flag: string;
  regulatoryBody: string;
  complianceStandards: string[];
  currency: string;
}

export const JURISDICTION_CONFIGS: Record<Jurisdiction, JurisdictionConfig> = {
  'UAE': {
    code: 'UAE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    regulatoryBody: 'Central Bank of UAE',
    complianceStandards: ['AAOIFI', 'UAE Central Bank'],
    currency: 'AED',
  },
  'Saudi Arabia': {
    code: 'Saudi Arabia',
    name: 'Kingdom of Saudi Arabia',
    flag: '🇸🇦',
    regulatoryBody: 'Saudi Central Bank (SAMA)',
    complianceStandards: ['AAOIFI', 'SAMA'],
    currency: 'SAR',
  },
  'Malaysia': {
    code: 'Malaysia',
    name: 'Malaysia',
    flag: '🇲🇾',
    regulatoryBody: 'Bank Negara Malaysia',
    complianceStandards: ['AAOIFI', 'BNM', 'IFSB'],
    currency: 'MYR',
  },
  'Bahrain': {
    code: 'Bahrain',
    name: 'Kingdom of Bahrain',
    flag: '🇧🇭',
    regulatoryBody: 'Central Bank of Bahrain',
    complianceStandards: ['AAOIFI', 'CBB'],
    currency: 'BHD',
  },
  'Qatar': {
    code: 'Qatar',
    name: 'State of Qatar',
    flag: '🇶🇦',
    regulatoryBody: 'Qatar Central Bank',
    complianceStandards: ['AAOIFI', 'QCB'],
    currency: 'QAR',
  },
  'Kuwait': {
    code: 'Kuwait',
    name: 'State of Kuwait',
    flag: '🇰🇼',
    regulatoryBody: 'Central Bank of Kuwait',
    complianceStandards: ['AAOIFI', 'CBK'],
    currency: 'KWD',
  },
  'Indonesia': {
    code: 'Indonesia',
    name: 'Republic of Indonesia',
    flag: '🇮🇩',
    regulatoryBody: 'Bank Indonesia / OJK',
    complianceStandards: ['AAOIFI', 'DSN-MUI'],
    currency: 'IDR',
  },
  'Pakistan': {
    code: 'Pakistan',
    name: 'Islamic Republic of Pakistan',
    flag: '🇵🇰',
    regulatoryBody: 'State Bank of Pakistan',
    complianceStandards: ['AAOIFI', 'SBP'],
    currency: 'PKR',
  },
  'UK': {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    regulatoryBody: 'Financial Conduct Authority',
    complianceStandards: ['AAOIFI', 'FCA'],
    currency: 'GBP',
  },
  'Other': {
    code: 'Other',
    name: 'Other Jurisdiction',
    flag: '🌍',
    regulatoryBody: 'Various',
    complianceStandards: ['AAOIFI'],
    currency: 'USD',
  },
};

// --------------------------------------------
// Pre-configured Product Templates
// --------------------------------------------

export const PRODUCT_TEMPLATES: ProductTemplateWithDetails[] = [
  {
    id: 'tpl-murabaha-home',
    name: 'Home Financing Murabaha',
    assetType: 'murabaha',
    description: 'Cost-plus financing for residential property purchases. The bank purchases the property and sells it to the customer at a disclosed markup.',
    category: 'financing',
    iconEmoji: '🏠',
    color: '#3B82F6',
    estimatedDuration: 30,
    isPopular: true,
    defaultJurisdictions: ['UAE', 'Saudi Arabia', 'Malaysia'],
    requiredParameters: [
      { key: 'propertyValue', label: 'Property Value', type: 'currency', required: true },
      { key: 'downPayment', label: 'Down Payment (%)', type: 'number', required: true, validation: { min: 10, max: 50 } },
      { key: 'profitRate', label: 'Profit Rate (%)', type: 'number', required: true, validation: { min: 1, max: 15 } },
      { key: 'tenor', label: 'Tenor (months)', type: 'number', required: true, validation: { min: 12, max: 360 } },
      { key: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['Apartment', 'Villa', 'Townhouse', 'Land'] },
    ],
    requiredDocuments: [
      { type: 'research', label: 'Property Valuation Report', description: 'Independent property valuation', required: true, stage: 'initiation' },
      { type: 'contract-draft', label: 'Sale Purchase Agreement', description: 'Draft SPA with seller', required: true, stage: 'legal-review' },
    ],
    complianceRequirements: ['AAOIFI FAS 2', 'AAOIFI SS 8'],
    riskFactors: ['Property market risk', 'Customer default risk'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tpl-murabaha-vehicle',
    name: 'Vehicle Financing Murabaha',
    assetType: 'murabaha',
    description: 'Cost-plus financing for vehicle purchases. Suitable for personal and commercial vehicles.',
    category: 'financing',
    iconEmoji: '🚗',
    color: '#10B981',
    estimatedDuration: 14,
    isPopular: true,
    defaultJurisdictions: ['UAE', 'Saudi Arabia', 'Kuwait'],
    requiredParameters: [
      { key: 'vehicleValue', label: 'Vehicle Value', type: 'currency', required: true },
      { key: 'downPayment', label: 'Down Payment (%)', type: 'number', required: true, validation: { min: 10, max: 40 } },
      { key: 'profitRate', label: 'Profit Rate (%)', type: 'number', required: true, validation: { min: 2, max: 12 } },
      { key: 'tenor', label: 'Tenor (months)', type: 'number', required: true, validation: { min: 12, max: 84 } },
      { key: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true, options: ['Sedan', 'SUV', 'Commercial', 'Luxury'] },
      { key: 'isNew', label: 'New Vehicle', type: 'select', required: true, options: ['New', 'Used'] },
    ],
    requiredDocuments: [
      { type: 'research', label: 'Vehicle Quotation', description: 'Dealer quotation for the vehicle', required: true, stage: 'initiation' },
    ],
    complianceRequirements: ['AAOIFI FAS 2', 'AAOIFI SS 8'],
    riskFactors: ['Asset depreciation', 'Customer default risk'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tpl-ijara-equipment',
    name: 'Equipment Ijara',
    assetType: 'ijara',
    description: 'Islamic leasing arrangement for equipment and machinery. The bank purchases and leases the asset to the customer.',
    category: 'leasing',
    iconEmoji: '🏭',
    color: '#F59E0B',
    estimatedDuration: 21,
    defaultJurisdictions: ['UAE', 'Saudi Arabia', 'Malaysia', 'Bahrain'],
    requiredParameters: [
      { key: 'equipmentValue', label: 'Equipment Value', type: 'currency', required: true },
      { key: 'leaseRate', label: 'Lease Rate (%)', type: 'number', required: true, validation: { min: 3, max: 15 } },
      { key: 'tenor', label: 'Lease Period (months)', type: 'number', required: true, validation: { min: 12, max: 120 } },
      { key: 'residualValue', label: 'Residual Value (%)', type: 'number', required: true, validation: { min: 0, max: 30 } },
      { key: 'equipmentType', label: 'Equipment Category', type: 'select', required: true, options: ['Manufacturing', 'Medical', 'IT', 'Construction', 'Other'] },
      { key: 'maintenanceBy', label: 'Maintenance Responsibility', type: 'select', required: true, options: ['Lessor', 'Lessee'] },
    ],
    requiredDocuments: [
      { type: 'research', label: 'Equipment Specification', description: 'Technical specifications', required: true, stage: 'initiation' },
      { type: 'research', label: 'Supplier Quote', description: 'Quote from equipment supplier', required: true, stage: 'initiation' },
    ],
    complianceRequirements: ['AAOIFI FAS 8', 'AAOIFI SS 9'],
    riskFactors: ['Equipment obsolescence', 'Maintenance costs', 'Lessee default'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tpl-musharaka-business',
    name: 'Diminishing Musharaka',
    assetType: 'musharaka',
    description: 'Partnership financing where the bank and customer jointly own an asset, with the customer gradually buying out the bank\'s share.',
    category: 'partnership',
    iconEmoji: '🤝',
    color: '#8B5CF6',
    estimatedDuration: 45,
    defaultJurisdictions: ['Malaysia', 'Pakistan', 'UAE'],
    requiredParameters: [
      { key: 'projectValue', label: 'Total Project Value', type: 'currency', required: true },
      { key: 'bankShare', label: 'Bank Share (%)', type: 'number', required: true, validation: { min: 30, max: 90 } },
      { key: 'expectedReturn', label: 'Expected Return (%)', type: 'number', required: true, validation: { min: 5, max: 25 } },
      { key: 'tenor', label: 'Partnership Period (months)', type: 'number', required: true, validation: { min: 24, max: 240 } },
      { key: 'buyoutSchedule', label: 'Buyout Schedule', type: 'select', required: true, options: ['Monthly', 'Quarterly', 'Annual'] },
    ],
    requiredDocuments: [
      { type: 'research', label: 'Business Plan', description: 'Detailed business plan', required: true, stage: 'initiation' },
      { type: 'research', label: 'Financial Projections', description: '5-year financial projections', required: true, stage: 'initiation' },
      { type: 'audit-report', label: 'Due Diligence Report', description: 'Independent due diligence', required: true, stage: 'risk-review' },
    ],
    complianceRequirements: ['AAOIFI FAS 4', 'AAOIFI SS 12'],
    riskFactors: ['Business performance risk', 'Partner default', 'Market risk'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tpl-mudaraba-investment',
    name: 'Mudaraba Investment',
    assetType: 'mudaraba',
    description: 'Trust-based financing where the bank provides capital and the customer provides expertise/management.',
    category: 'investment',
    iconEmoji: '💼',
    color: '#EC4899',
    estimatedDuration: 60,
    defaultJurisdictions: ['Saudi Arabia', 'Bahrain', 'Kuwait'],
    requiredParameters: [
      { key: 'investmentAmount', label: 'Investment Amount', type: 'currency', required: true },
      { key: 'profitShareBank', label: 'Bank Profit Share (%)', type: 'number', required: true, validation: { min: 20, max: 80 } },
      { key: 'profitShareMudarib', label: 'Mudarib Profit Share (%)', type: 'number', required: true, validation: { min: 20, max: 80 } },
      { key: 'tenor', label: 'Investment Period (months)', type: 'number', required: true, validation: { min: 12, max: 120 } },
      { key: 'investmentSector', label: 'Investment Sector', type: 'select', required: true, options: ['Real Estate', 'Trade', 'Manufacturing', 'Technology', 'Services'] },
    ],
    requiredDocuments: [
      { type: 'research', label: 'Investment Proposal', description: 'Detailed investment proposal', required: true, stage: 'initiation' },
      { type: 'research', label: 'Track Record', description: 'Mudarib track record', required: true, stage: 'initiation' },
      { type: 'audit-report', label: 'Risk Assessment', description: 'Investment risk assessment', required: true, stage: 'risk-review' },
    ],
    complianceRequirements: ['AAOIFI FAS 3', 'AAOIFI SS 13'],
    riskFactors: ['Investment performance', 'Mudarib capability', 'Market conditions'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tpl-sukuk',
    name: 'Sukuk Issuance',
    assetType: 'sukuk',
    description: 'Islamic bond issuance representing ownership in tangible assets, services, or investment projects.',
    category: 'investment',
    iconEmoji: '📈',
    color: '#14B8A6',
    estimatedDuration: 90,
    defaultJurisdictions: ['Malaysia', 'UAE', 'Saudi Arabia', 'Bahrain'],
    requiredParameters: [
      { key: 'issuanceSize', label: 'Issuance Size', type: 'currency', required: true },
      { key: 'expectedYield', label: 'Expected Yield (%)', type: 'number', required: true, validation: { min: 2, max: 15 } },
      { key: 'tenor', label: 'Sukuk Tenor (months)', type: 'number', required: true, validation: { min: 12, max: 360 } },
      { key: 'sukukType', label: 'Sukuk Structure', type: 'select', required: true, options: ['Ijara', 'Murabaha', 'Musharaka', 'Wakala', 'Hybrid'] },
      { key: 'listing', label: 'Listing Exchange', type: 'select', required: false, options: ['NASDAQ Dubai', 'Bursa Malaysia', 'London Stock Exchange', 'Private Placement'] },
    ],
    requiredDocuments: [
      { type: 'research', label: 'Information Memorandum', description: 'Detailed IM for investors', required: true, stage: 'initiation' },
      { type: 'contract-draft', label: 'Trust Deed', description: 'Sukuk trust deed', required: true, stage: 'legal-review' },
      { type: 'regulatory-filing', label: 'Regulatory Submission', description: 'Regulatory approval documents', required: true, stage: 'legal-review' },
    ],
    complianceRequirements: ['AAOIFI FAS 17', 'AAOIFI SS 17', 'IFSB-7'],
    riskFactors: ['Market liquidity', 'Credit risk', 'Asset performance'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tpl-salam-commodity',
    name: 'Commodity Salam',
    assetType: 'salam',
    description: 'Forward sale contract with advance payment for future delivery of commodities.',
    category: 'trade',
    iconEmoji: '🌾',
    color: '#84CC16',
    estimatedDuration: 21,
    defaultJurisdictions: ['Saudi Arabia', 'UAE', 'Pakistan'],
    requiredParameters: [
      { key: 'contractValue', label: 'Contract Value', type: 'currency', required: true },
      { key: 'commodityType', label: 'Commodity Type', type: 'select', required: true, options: ['Agricultural', 'Metals', 'Energy', 'Other'] },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true },
      { key: 'unit', label: 'Unit of Measure', type: 'select', required: true, options: ['Tons', 'Barrels', 'Kilograms', 'Units'] },
      { key: 'deliveryDate', label: 'Delivery Date', type: 'date', required: true },
      { key: 'deliveryLocation', label: 'Delivery Location', type: 'string', required: true },
    ],
    requiredDocuments: [
      { type: 'research', label: 'Commodity Specification', description: 'Detailed commodity specs', required: true, stage: 'initiation' },
      { type: 'contract-draft', label: 'Salam Agreement', description: 'Draft Salam contract', required: true, stage: 'legal-review' },
    ],
    complianceRequirements: ['AAOIFI FAS 7', 'AAOIFI SS 10'],
    riskFactors: ['Delivery risk', 'Price volatility', 'Quality risk'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tpl-wakala-deposit',
    name: 'Wakala Deposit',
    assetType: 'wakala',
    description: 'Agency arrangement where funds are invested on behalf of the customer with an expected profit rate.',
    category: 'investment',
    iconEmoji: '🏦',
    color: '#6366F1',
    estimatedDuration: 7,
    isPopular: true,
    defaultJurisdictions: ['UAE', 'Bahrain', 'Qatar', 'Kuwait'],
    requiredParameters: [
      { key: 'depositAmount', label: 'Deposit Amount', type: 'currency', required: true },
      { key: 'expectedProfit', label: 'Expected Profit Rate (%)', type: 'number', required: true, validation: { min: 1, max: 10 } },
      { key: 'tenor', label: 'Deposit Period (months)', type: 'number', required: true, validation: { min: 1, max: 60 } },
      { key: 'wakalaFee', label: 'Wakala Fee (%)', type: 'number', required: false, validation: { min: 0, max: 2 } },
      { key: 'autoRenew', label: 'Auto Renewal', type: 'select', required: true, options: ['Yes', 'No'] },
    ],
    requiredDocuments: [
      { type: 'contract-draft', label: 'Wakala Agreement', description: 'Standard Wakala agreement', required: true, stage: 'legal-review' },
    ],
    complianceRequirements: ['AAOIFI FAS 23', 'AAOIFI SS 23'],
    riskFactors: ['Investment performance', 'Liquidity risk'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// --------------------------------------------
// Helper Functions
// --------------------------------------------

export const getTemplateById = (id: string): ProductTemplateWithDetails | undefined => {
  return PRODUCT_TEMPLATES.find((t) => t.id === id);
};

export const getTemplatesByCategory = (category: ProductCategory): ProductTemplateWithDetails[] => {
  return PRODUCT_TEMPLATES.filter((t) => t.category === category);
};

export const getTemplatesByAssetType = (assetType: AssetType): ProductTemplateWithDetails[] => {
  return PRODUCT_TEMPLATES.filter((t) => t.assetType === assetType);
};

export const getPopularTemplates = (): ProductTemplateWithDetails[] => {
  return PRODUCT_TEMPLATES.filter((t) => t.isPopular);
};

export const getCategoryLabel = (category: ProductCategory): string => {
  const labels: Record<ProductCategory, string> = {
    financing: 'Financing',
    investment: 'Investment',
    trade: 'Trade Finance',
    leasing: 'Leasing',
    partnership: 'Partnership',
  };
  return labels[category];
};
