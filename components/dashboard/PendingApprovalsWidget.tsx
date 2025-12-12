import React from 'react';
import { Card, CardHeader, CardBody, Badge, Button, Avatar } from '../shared';
import { Product, UserRole } from '../../types';
import { PRODUCT_STATUS_LABELS, ASSET_TYPE_INFO } from '../../utils/constants';

interface PendingApprovalsWidgetProps {
  products: Product[];
  userRole: UserRole;
  onReview: (productId: string) => void;
}

const getStatusVariant = (status: string): 'warning' | 'info' | 'default' => {
  if (status.includes('pending')) return 'warning';
  if (status.includes('approved')) return 'info';
  return 'default';
};

export const PendingApprovalsWidget: React.FC<PendingApprovalsWidgetProps> = ({
  products,
  userRole,
  onReview,
}) => {
  const pendingProducts = products.filter((p) => p.status.includes('pending'));

  return (
    <Card>
      <CardHeader
        action={
          <Badge variant="warning" size="sm">
            {pendingProducts.length} pending
          </Badge>
        }
      >
        Pending Approvals
      </CardHeader>
      <CardBody>
        {pendingProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No pending approvals
          </p>
        ) : (
          <div className="space-y-4">
            {pendingProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    {product.assetType.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ASSET_TYPE_INFO[product.assetType]?.label || product.assetType} • {product.jurisdiction}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(product.status)} size="sm">
                    {PRODUCT_STATUS_LABELS[product.status] || product.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReview(product.id)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PendingApprovalsWidget;
