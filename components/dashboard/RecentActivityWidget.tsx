import React from 'react';
import { Card, CardHeader, CardBody, Avatar } from '../shared';
import { AuditLog } from '../../types';

interface RecentActivityWidgetProps {
  activities?: AuditLog[];
  maxItems?: number;
}

const getActivityIcon = (action: string): React.ReactNode => {
  if (action.includes('approved')) {
    return (
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (action.includes('rejected') || action.includes('flagged')) {
    return (
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    );
  }
  if (action.includes('created') || action.includes('uploaded')) {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    );
  }
  if (action.includes('comment')) {
    return (
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// Mock default activities
const DEFAULT_ACTIVITIES: AuditLog[] = [
  {
    id: 'act-1',
    timestamp: new Date(Date.now() - 30 * 60000),
    userId: 'user-1',
    userName: 'Product Team',
    action: 'created new product',
    entityType: 'product',
    entityId: 'prod-1',
    details: {},
    hash: 'hash-1',
  },
  {
    id: 'act-2',
    timestamp: new Date(Date.now() - 2 * 3600000),
    userId: 'user-2',
    userName: 'Sharia Board',
    action: 'approved product structure',
    entityType: 'workflow',
    entityId: 'wf-1',
    details: {},
    hash: 'hash-2',
  },
  {
    id: 'act-3',
    timestamp: new Date(Date.now() - 5 * 3600000),
    userId: 'user-3',
    userName: 'Legal Team',
    action: 'uploaded contract draft',
    entityType: 'document',
    entityId: 'doc-1',
    details: {},
    hash: 'hash-3',
  },
];

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities = DEFAULT_ACTIVITIES,
  maxItems = 5,
}) => {
  const displayActivities = (activities || []).slice(0, maxItems);

  return (
    <Card>
      <CardHeader>Recent Activity</CardHeader>
      <CardBody>
        {displayActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {getActivityIcon(activity.action)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.userName}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentActivityWidget;
