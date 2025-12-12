// ============================================
// USE NOTIFICATIONS HOOK
// Real-time notification management
// ============================================

import { useState, useCallback, useEffect } from 'react';
import {
  NotificationItem,
  NotificationCategory,
  NotificationPriority,
  NotificationPreferences,
  NotificationSummary,
  groupNotificationsByDate,
} from '../types/notifications';

// Mock notifications
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'approval-required',
    category: 'workflow',
    priority: 'high',
    title: 'Approval Required',
    message: 'Home Murabaha Product needs your Sharia review',
    entityType: 'product',
    entityId: 'prod-1',
    entityName: 'Home Murabaha Product',
    read: false,
    dismissed: false,
    actionUrl: '/products/prod-1',
    actionLabel: 'Review Now',
    createdAt: new Date(Date.now() - 30 * 60000), // 30 mins ago
  },
  {
    id: 'notif-2',
    type: 'comment-added',
    category: 'message',
    priority: 'normal',
    title: 'New Comment',
    message: 'Dr. Hassan commented on Sukuk Structure documentation',
    entityType: 'document',
    entityId: 'doc-1',
    entityName: 'Sukuk Structure',
    senderId: 'user-2',
    senderName: 'Dr. Hassan',
    senderRole: 'sharia-scholar',
    read: false,
    dismissed: false,
    createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
  },
  {
    id: 'notif-3',
    type: 'meeting-reminder',
    category: 'meeting',
    priority: 'normal',
    title: 'Meeting in 1 hour',
    message: 'Sharia Board Review Meeting starts at 2:00 PM',
    entityType: 'meeting',
    entityId: 'meet-1',
    entityName: 'Sharia Board Review',
    read: true,
    dismissed: false,
    actionUrl: '/meetings/meet-1',
    actionLabel: 'Join Meeting',
    createdAt: new Date(Date.now() - 3 * 3600000), // 3 hours ago
  },
  {
    id: 'notif-4',
    type: 'compliance-alert',
    category: 'compliance',
    priority: 'urgent',
    title: 'Compliance Alert',
    message: 'New AAOIFI standard update requires product review',
    entityType: 'compliance',
    read: false,
    dismissed: false,
    actionUrl: '/compliance',
    actionLabel: 'View Details',
    createdAt: new Date(Date.now() - 5 * 3600000), // 5 hours ago
  },
  {
    id: 'notif-5',
    type: 'document-uploaded',
    category: 'document',
    priority: 'low',
    title: 'Document Uploaded',
    message: 'New fatwa document uploaded for Vehicle Ijara',
    entityType: 'document',
    entityId: 'doc-2',
    entityName: 'Fatwa - Vehicle Ijara',
    senderId: 'user-3',
    senderName: 'Legal Team',
    read: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 24 * 3600000), // Yesterday
  },
  {
    id: 'notif-6',
    type: 'workflow-stage-change',
    category: 'workflow',
    priority: 'normal',
    title: 'Workflow Update',
    message: 'Working Capital Murabaha moved to Legal Review stage',
    entityType: 'product',
    entityId: 'prod-2',
    entityName: 'Working Capital Murabaha',
    read: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 26 * 3600000), // Yesterday
  },
  {
    id: 'notif-7',
    type: 'approval-received',
    category: 'workflow',
    priority: 'normal',
    title: 'Approval Received',
    message: 'Sukuk Investment Fund received Sharia approval',
    entityType: 'product',
    entityId: 'prod-3',
    read: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 48 * 3600000), // 2 days ago
  },
  {
    id: 'notif-8',
    type: 'risk-alert',
    category: 'risk',
    priority: 'high',
    title: 'Risk Assessment Required',
    message: 'New product pending risk evaluation',
    entityType: 'product',
    entityId: 'prod-4',
    read: false,
    dismissed: false,
    actionUrl: '/risk/prod-4',
    actionLabel: 'Assess Risk',
    createdAt: new Date(Date.now() - 4 * 3600000), // 4 hours ago
  },
];

interface UseNotificationsOptions {
  userId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseNotificationsReturn {
  notifications: NotificationItem[];
  unreadCount: number;
  summary: NotificationSummary;
  groups: ReturnType<typeof groupNotificationsByDate>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismiss: (notificationId: string) => void;
  dismissAll: () => void;
  refresh: () => Promise<void>;
  
  // Filters
  filterByCategory: (category: NotificationCategory | 'all') => NotificationItem[];
  filterByPriority: (priority: NotificationPriority | 'all') => NotificationItem[];
  filterUnread: () => NotificationItem[];
  
  // Preferences
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const { userId = 'current-user', autoRefresh = false, refreshInterval = 30000 } = options;

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    userId,
    email: true,
    push: true,
    inApp: true,
    categories: {
      workflow: true,
      document: true,
      meeting: true,
      compliance: true,
      risk: true,
      system: true,
      message: true,
    },
  });

  // Calculate summary
  const summary: NotificationSummary = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read && !n.dismissed).length,
    byCategory: {
      workflow: notifications.filter(n => n.category === 'workflow').length,
      document: notifications.filter(n => n.category === 'document').length,
      meeting: notifications.filter(n => n.category === 'meeting').length,
      compliance: notifications.filter(n => n.category === 'compliance').length,
      risk: notifications.filter(n => n.category === 'risk').length,
      system: notifications.filter(n => n.category === 'system').length,
      message: notifications.filter(n => n.category === 'message').length,
    },
    byPriority: {
      low: notifications.filter(n => n.priority === 'low').length,
      normal: notifications.filter(n => n.priority === 'normal').length,
      high: notifications.filter(n => n.priority === 'high').length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
    },
  };

  // Group notifications
  const activeNotifications = notifications.filter(n => !n.dismissed);
  const groups = groupNotificationsByDate(activeNotifications);

  // Actions
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    const now = new Date();
    setNotifications(prev =>
      prev.map(n => (n.read ? n : { ...n, read: true, readAt: now }))
    );
  }, []);

  const dismiss = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, dismissed: true } : n
      )
    );
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, dismissed: true })));
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real app, fetch from API
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      // setNotifications(data);
    } catch (err) {
      setError('Failed to refresh notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filters
  const filterByCategory = useCallback(
    (category: NotificationCategory | 'all') =>
      category === 'all'
        ? activeNotifications
        : activeNotifications.filter(n => n.category === category),
    [activeNotifications]
  );

  const filterByPriority = useCallback(
    (priority: NotificationPriority | 'all') =>
      priority === 'all'
        ? activeNotifications
        : activeNotifications.filter(n => n.priority === priority),
    [activeNotifications]
  );

  const filterUnread = useCallback(
    () => activeNotifications.filter(n => !n.read),
    [activeNotifications]
  );

  // Preferences
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    notifications: activeNotifications,
    unreadCount: summary.unread,
    summary,
    groups,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    dismiss,
    dismissAll,
    refresh,
    filterByCategory,
    filterByPriority,
    filterUnread,
    preferences,
    updatePreferences,
  };
};

export default useNotifications;
