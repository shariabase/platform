import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Button } from '../shared';
import { RegulatoryAlert } from '../../types/compliance';

interface RegulatoryAlertsPanelProps {
  alerts: RegulatoryAlert[];
  onMarkReviewed: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

/**
 * RegulatoryAlertsPanel - Legal & Compliance Component
 * 
 * Purpose: Display and manage regulatory alerts and updates
 * Location: /components/legal-compliance/
 * Used by: LegalCompliancePage
 */
export const RegulatoryAlertsPanel: React.FC<RegulatoryAlertsPanelProps> = ({
  alerts,
  onMarkReviewed,
  onDismiss,
}) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'action-required'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'new') return alert.status === 'new';
    if (filter === 'action-required') return alert.actionRequired && alert.status !== 'actioned';
    return alert.status !== 'dismissed';
  });

  const newCount = alerts.filter((a) => a.status === 'new').length;
  const actionRequiredCount = alerts.filter((a) => a.actionRequired && a.status !== 'actioned').length;

  const getSeverityBadge = (severity: RegulatoryAlert['severity']) => {
    const config = {
      high: { variant: 'danger' as const, label: 'High Priority' },
      medium: { variant: 'warning' as const, label: 'Medium' },
      low: { variant: 'info' as const, label: 'Low' },
    };
    return <Badge variant={config[severity].variant} size="sm">{config[severity].label}</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader
        action={
          <div className="flex items-center space-x-2">
            {newCount > 0 && (
              <Badge variant="danger" size="sm">{newCount} new</Badge>
            )}
          </div>
        }
      >
        Regulatory Alerts
      </CardHeader>
      <CardBody>
        {/* Filters */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            New ({newCount})
          </button>
          <button
            onClick={() => setFilter('action-required')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'action-required'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Action Required ({actionRequiredCount})
          </button>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No alerts to display</p>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg ${
                  alert.status === 'new'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getSeverityBadge(alert.severity)}
                      {alert.actionRequired && (
                        <Badge variant="warning" size="sm">Action Required</Badge>
                      )}
                      {alert.status === 'new' && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>Source: {alert.source}</span>
                      <span>•</span>
                      <span>Effective: {formatDate(alert.effectiveDate)}</span>
                      {alert.affectedJurisdictions.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{alert.affectedJurisdictions.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 ml-4">
                    {alert.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMarkReviewed(alert.id)}
                      >
                        Mark Reviewed
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismiss(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RegulatoryAlertsPanel;
