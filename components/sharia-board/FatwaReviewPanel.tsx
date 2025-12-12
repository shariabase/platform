import React from 'react';
import { Card, CardHeader, CardBody, Button, Badge } from '../shared';
import { Product, Document } from '../../types';

interface FatwaReviewPanelProps {
  product: Product;
  documents: Document[];
  onApprove: () => void;
  onRequestChanges: () => void;
  onAttachFatwa: () => void;
}

/**
 * FatwaReviewPanel - Sharia Scholar Component
 * 
 * Purpose: Displays product details for Sharia review with approval actions
 * Location: /components/sharia-board/
 * Used by: ShariaBoardPage
 */
export const FatwaReviewPanel: React.FC<FatwaReviewPanelProps> = ({
  product,
  documents,
  onApprove,
  onRequestChanges,
  onAttachFatwa,
}) => {
  const fatwas = documents.filter((d) => d.type === 'fatwa');
  const researchDocs = documents.filter((d) => d.type === 'research');

  return (
    <Card>
      <CardHeader>
        Sharia Review: {product.name}
      </CardHeader>
      <CardBody>
        {/* Product Summary */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Asset Type:</span>
              <span className="ml-2 font-medium">{product.assetType}</span>
            </div>
            <div>
              <span className="text-gray-500">Jurisdiction:</span>
              <span className="ml-2 font-medium">{product.jurisdiction}</span>
            </div>
            <div>
              <span className="text-gray-500">Tenor:</span>
              <span className="ml-2 font-medium">{product.tenor} months</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <Badge variant="warning" size="sm" className="ml-2">
                Pending Review
              </Badge>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Supporting Documents ({researchDocs.length})
          </h4>
          {/* Document list would go here */}
        </div>

        {/* Existing Fatwas */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Attached Fatwas ({fatwas.length})
          </h4>
          {fatwas.length === 0 && (
            <p className="text-sm text-gray-500">No fatwas attached yet</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button variant="primary" onClick={onApprove}>
            Approve Structure
          </Button>
          <Button variant="outline" onClick={onRequestChanges}>
            Request Modifications
          </Button>
          <Button variant="ghost" onClick={onAttachFatwa}>
            Attach Fatwa
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default FatwaReviewPanel;
