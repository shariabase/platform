// ============================================
// SHARIA EDUCATION CENTER
// Educational content for customers
// ============================================

import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../shared';
import { ShariaEducationItem, getAssetTypeDescription } from '../../types/customer';
import { AssetType } from '../../types';

interface ShariaEducationProps {
  items?: ShariaEducationItem[];
  onItemRead?: (itemId: string) => void;
}

const EDUCATION_ITEMS: ShariaEducationItem[] = [
  {
    id: 'edu-1',
    title: 'Understanding Islamic Finance',
    category: 'basics',
    content: `
# What is Islamic Finance?

Islamic finance is a financial system based on Sharia (Islamic law) principles. It prohibits certain activities considered harmful to society and promotes ethical, responsible investing.

## Core Principles

### 1. Prohibition of Riba (Interest)
Earning money from money (interest) is prohibited. Instead, profit must come from real economic activity and risk-sharing.

### 2. Asset-Backed Transactions
All financial transactions must be backed by real assets or services. Speculation and uncertainty are minimized.

### 3. Prohibition of Gharar (Excessive Uncertainty)
Contracts must have clearly defined terms. Both parties must know exactly what they're agreeing to.

### 4. Ethical Investment
Investments in activities deemed harmful (alcohol, gambling, weapons, etc.) are prohibited.

### 5. Profit and Loss Sharing
Risk and reward should be shared between parties, promoting fairness and partnership.
    `,
    readTime: 5,
  },
  {
    id: 'edu-2',
    title: 'Murabaha: Cost-Plus Financing',
    category: 'contracts',
    content: `
# Murabaha Explained

Murabaha is one of the most common Islamic financing structures. It's a cost-plus sale arrangement used for home financing, vehicle purchases, and trade financing.

## How It Works

1. **You identify an asset** you want to purchase (house, car, equipment)
2. **The bank purchases the asset** directly from the seller
3. **The bank sells it to you** at an agreed profit margin
4. **You pay in installments** over an agreed period

## Key Features

- **Transparent pricing**: You know the exact cost and profit from day one
- **Fixed payments**: Monthly payments remain constant throughout the term
- **Ownership**: You own the asset from the start (or at the end, depending on structure)

## Why It's Sharia Compliant

Unlike conventional loans where interest grows on money, Murabaha involves an actual sale transaction. The bank takes genuine ownership risk before selling to you, and the profit is from a legitimate trade activity, not interest on money.
    `,
    relatedProducts: ['murabaha'],
    readTime: 4,
  },
  {
    id: 'edu-3',
    title: 'Ijara: Islamic Leasing',
    category: 'contracts',
    content: `
# Ijara: Islamic Lease Financing

Ijara (meaning "to give something on rent") is an Islamic leasing structure where the bank purchases and owns an asset, then leases it to you.

## Structure

1. **Bank purchases the asset** based on your requirements
2. **Bank leases the asset to you** for a fixed rental payment
3. **At lease end**, ownership transfers to you through a separate gift (hiba) or sale contract

## Ijara vs Conventional Lease

| Ijara | Conventional Lease |
|-------|-------------------|
| Bank bears ownership risks | Risks often transferred to lessee |
| Clear separation of lease and ownership transfer | Often bundled |
| Compliant with Sharia | Interest-based |

## Common Uses

- Vehicle financing
- Equipment leasing
- Home financing (Ijara wa Iqtina - lease to own)
    `,
    relatedProducts: ['ijara'],
    readTime: 4,
  },
  {
    id: 'edu-4',
    title: 'Sukuk: Islamic Investment Certificates',
    category: 'contracts',
    content: `
# Understanding Sukuk

Sukuk (plural of Sakk) are Islamic investment certificates that represent ownership in real assets, as opposed to conventional bonds which represent debt.

## How Sukuk Work

1. **Asset-backed**: Sukuk must be backed by tangible assets
2. **Returns from assets**: Investors earn returns from the performance of the underlying assets
3. **Risk sharing**: Investors share in both profits and potential losses

## Types of Sukuk

- **Sukuk al-Ijara**: Based on lease income
- **Sukuk al-Murabaha**: Based on trade transactions
- **Sukuk al-Musharaka**: Based on partnership profits

## Why Invest in Sukuk?

- Regular income from real assets
- Lower volatility compared to equities
- Sharia-compliant alternative to bonds
- Diversification benefits
    `,
    relatedProducts: ['sukuk'],
    readTime: 5,
  },
  {
    id: 'edu-5',
    title: 'Frequently Asked Questions',
    category: 'faq',
    content: `
# Frequently Asked Questions

## Is Islamic finance only for Muslims?
No! Islamic finance is available to everyone. Many non-Muslims choose Islamic products for their ethical principles and transparent pricing.

## Are Islamic products more expensive?
Not necessarily. While structures differ, competitive Islamic products often have similar or even better pricing than conventional alternatives.

## What happens if I miss a payment?
Late fees may apply, but unlike conventional products, any late fees collected are donated to charity - they don't add to the bank's profit.

## How do I know a product is truly Sharia compliant?
All our products are approved by our independent Sharia Supervisory Board. You can view the fatwa (religious ruling) for each product.

## Can I make early payments?
Yes, you can make early payments. Many Islamic banks offer rebates on early settlement.

## What is a fatwa?
A fatwa is a religious ruling issued by qualified Islamic scholars. Our Sharia Board issues fatwas confirming that each product structure complies with Islamic principles.
    `,
    readTime: 4,
  },
];

export const ShariaEducation: React.FC<ShariaEducationProps> = ({
  items = EDUCATION_ITEMS,
  onItemRead,
}) => {
  const [selectedItem, setSelectedItem] = useState<ShariaEducationItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: '📚' },
    { id: 'basics', label: 'Basics', icon: '🌟' },
    { id: 'contracts', label: 'Contract Types', icon: '📄' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      basics: 'bg-blue-100 text-blue-700',
      contracts: 'bg-green-100 text-green-700',
      principles: 'bg-purple-100 text-purple-700',
      faq: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Learn About Islamic Finance</h2>
            <p className="text-emerald-100">Understand the principles behind your Sharia-compliant products</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
            }`}
          >
            <span>{cat.icon}</span>
            <span className="font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedItem(item);
              onItemRead?.(item.id);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(item.category)}`}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </span>
              <span className="text-xs text-gray-500">{item.readTime} min read</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.content.split('\n').filter(line => line.trim() && !line.startsWith('#'))[0]}
            </p>
            {item.relatedProducts && item.relatedProducts.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500 mb-1">Related to:</p>
                <div className="flex gap-1">
                  {item.relatedProducts.map((type) => (
                    <Badge key={type} variant="info" className="text-xs capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Product Types Quick Reference */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Islamic Finance Product Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['murabaha', 'ijara', 'musharaka', 'sukuk'] as AssetType[]).map((type) => (
            <div key={type} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 capitalize mb-2">{type}</h4>
              <p className="text-xs text-gray-600 line-clamp-3">
                {getAssetTypeDescription(type)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Article Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || ''}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadge(selectedItem.category)}`}>
                {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                {selectedItem.readTime} min read
              </span>
            </div>

            {/* Render content as markdown-style */}
            <div className="prose prose-sm max-w-none">
              {selectedItem.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-semibold text-gray-900 mt-5 mb-3">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4 text-gray-700">{line.slice(2)}</li>;
                }
                if (line.startsWith('|')) {
                  return null; // Skip table rows for simplicity
                }
                if (line.trim()) {
                  return <p key={index} className="text-gray-700 mb-3">{line}</p>;
                }
                return null;
              })}
            </div>

            {selectedItem.relatedProducts && selectedItem.relatedProducts.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">This article relates to:</p>
                <div className="flex gap-2">
                  {selectedItem.relatedProducts.map((type) => (
                    <Badge key={type} variant="info" className="capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              <Button variant="outline" className="flex-1">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShariaEducation;
