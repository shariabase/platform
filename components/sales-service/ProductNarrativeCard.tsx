// ============================================
// PRODUCT NARRATIVE CARD
// Simplified product info for sales & customers
// ============================================

import React, { useState } from 'react';
import { Button, Card, Badge, Modal } from '../shared';
import { ProductNarrative } from '../../types/sales';

interface ProductNarrativeCardProps {
  narrative: ProductNarrative;
  compact?: boolean;
  onEdit?: (narrative: ProductNarrative) => void;
  canEdit?: boolean;
}

// Mock narratives for demo
export const MOCK_NARRATIVES: ProductNarrative[] = [
  {
    id: 'narr-1',
    productId: 'prod-1',
    version: 2,
    title: 'Home Murabaha Financing',
    summary: 'A Sharia-compliant home financing solution where the bank purchases the property and sells it to you at a fixed profit margin. No interest charges - just transparent, agreed-upon costs.',
    keyBenefits: [
      'Fixed monthly payments with no hidden fees',
      'Own your home from day one',
      'Fully Sharia-compliant structure approved by our Sharia Board',
      'Competitive profit rates',
      'Flexible tenure up to 25 years',
    ],
    shariaCompliance: 'This product uses the Murabaha (cost-plus sale) structure where the bank first purchases the property, then sells it to you at an agreed profit margin. You know the exact cost from the beginning. There is no interest (riba) involved - the profit is from a legitimate sale transaction.',
    eligibility: [
      'UAE Nationals and Residents',
      'Minimum age: 21 years',
      'Minimum salary: AED 15,000/month',
      'Employment tenure: 6 months for salaried, 2 years for self-employed',
      'Good credit history',
    ],
    documentationRequired: [
      'Valid Emirates ID',
      'Passport copy',
      'Salary certificate or trade license',
      'Bank statements (3 months)',
      'Property documents',
    ],
    faq: [
      {
        question: 'How is this different from a conventional mortgage?',
        answer: 'Unlike conventional mortgages that charge interest, our Murabaha financing is based on an actual sale transaction. The bank buys the property and sells it to you at a disclosed profit. The total amount is fixed from day one.',
      },
      {
        question: 'Can I make early payments?',
        answer: 'Yes, you can make early payments at any time. We may offer a discount (rebate) on the remaining profit, subject to our policies.',
      },
      {
        question: 'What happens if I miss a payment?',
        answer: 'We encourage you to contact us immediately if you face difficulties. Late payment fees apply but are donated to charity as per Sharia requirements.',
      },
    ],
    disclaimers: [
      'Subject to credit approval and property valuation',
      'Terms and conditions apply',
      'Approved by Sharia Supervisory Board - Fatwa Reference: FSB-2024-001',
    ],
    approvedBy: 'Sharia Board',
    approvedAt: new Date('2024-01-15'),
    status: 'approved',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'narr-2',
    productId: 'prod-2',
    version: 1,
    title: 'Sukuk Investment Fund',
    summary: 'Invest in a diversified portfolio of Islamic bonds (sukuk) with competitive returns. Your money works in Sharia-compliant assets generating halal income.',
    keyBenefits: [
      'Regular income distribution',
      'Capital preservation focus',
      'Diversified sukuk portfolio',
      'Professional fund management',
      'Lower risk than equities',
    ],
    shariaCompliance: 'Sukuk are Islamic investment certificates backed by real assets. Unlike conventional bonds, sukuk represent ownership in tangible assets and generate returns from asset performance rather than interest payments.',
    eligibility: [
      'Minimum investment: AED 10,000',
      'UAE Residents and Non-Residents',
      'KYC documentation required',
    ],
    documentationRequired: [
      'Valid ID document',
      'Proof of address',
      'Source of funds declaration',
    ],
    faq: [
      {
        question: 'What is a sukuk?',
        answer: 'Sukuk are Islamic financial certificates representing ownership in real assets. Returns come from the performance of these assets, not from interest.',
      },
      {
        question: 'How often are profits distributed?',
        answer: 'Profits are typically distributed quarterly, subject to fund performance.',
      },
    ],
    disclaimers: [
      'Past performance is not indicative of future results',
      'Investment value may go down as well as up',
      'Sharia Board approved structure',
    ],
    status: 'approved',
    approvedBy: 'Sharia Board',
    approvedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
  },
];

export const ProductNarrativeCard: React.FC<ProductNarrativeCardProps> = ({
  narrative,
  compact = false,
  onEdit,
  canEdit = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'faq'>('overview');

  if (compact) {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowDetails(true)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{narrative.title}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{narrative.summary}</p>
          </div>
          <Badge variant={narrative.status === 'approved' ? 'success' : 'warning'}>
            {narrative.status === 'approved' ? 'Approved' : 'Draft'}
          </Badge>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span>Version {narrative.version}</span>
          {narrative.approvedAt && (
            <span>Approved {narrative.approvedAt.toLocaleDateString()}</span>
          )}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{narrative.title}</h3>
              <p className="mt-2 text-primary-100">{narrative.summary}</p>
            </div>
            {narrative.status === 'approved' && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">Sharia Compliant</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex">
            {(['overview', 'eligibility', 'faq'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'eligibility' && 'Eligibility'}
                {tab === 'faq' && 'FAQ'}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Benefits */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
                <ul className="space-y-2">
                  {narrative.keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sharia Compliance */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h5 className="font-semibold text-emerald-900">Sharia Compliance</h5>
                </div>
                <p className="text-emerald-800 text-sm">{narrative.shariaCompliance}</p>
              </div>

              {/* Disclaimers */}
              <div className="text-xs text-gray-500 space-y-1">
                {narrative.disclaimers.map((disclaimer, index) => (
                  <p key={index}>* {disclaimer}</p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              {/* Eligibility Criteria */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h4>
                <ul className="space-y-2">
                  {narrative.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Documentation Required</h4>
                <div className="grid grid-cols-2 gap-2">
                  {narrative.documentationRequired.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              {narrative.faq.map((item, index) => (
                <div key={index} className="border rounded-lg">
                  <div className="p-4 bg-gray-50 font-medium text-gray-900">
                    Q: {item.question}
                  </div>
                  <div className="p-4 text-gray-700">
                    A: {item.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Version {narrative.version} • Last updated {narrative.updatedAt.toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </Button>
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </Button>
            {canEdit && (
              <Button size="sm" onClick={() => onEdit?.(narrative)}>
                Edit Narrative
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Details Modal for compact view */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={narrative.title}
        size="lg"
      >
        <ProductNarrativeCard narrative={narrative} canEdit={canEdit} onEdit={onEdit} />
      </Modal>
    </>
  );
};

export default ProductNarrativeCard;
