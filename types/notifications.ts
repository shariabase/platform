// ============================================
// NOTIFICATION TYPES
// Real-time notification system types
// ============================================

import { UserRole } from './index';

// --------------------------------------------
// Notification Categories
// --------------------------------------------

export type NotificationCategory = 
  | 'workflow'
  | 'document'
  | 'meeting'
  | 'compliance'
  | 'risk'
  | 'system'
  | 'message';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

// --------------------------------------------
// Extended Notification Type
// --------------------------------------------

export interface NotificationItem {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  
  // Entity reference
  entityType?: 'product' | 'document' | 'workflow' | 'meeting' | 'user' | 'compliance';
  entityId?: string;
  entityName?: string;
  
  // Metadata
  read: boolean;
  dismissed: boolean;
  actionUrl?: string;
  actionLabel?: string;
  
  // Sender info (for messages/comments)
  senderId?: string;
  senderName?: string;
  senderRole?: UserRole;
  
  // Timestamps
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}

export type NotificationType =
  | 'approval-required'
  | 'approval-received'
  | 'approval-rejected'
  | 'comment-added'
  | 'comment-reply'
  | 'document-uploaded'
  | 'document-updated'
  | 'meeting-scheduled'
  | 'meeting-reminder'
  | 'meeting-cancelled'
  | 'workflow-stage-change'
  | 'workflow-completed'
  | 'compliance-alert'
  | 'risk-alert'
  | 'system-announcement'
  | 'mention';

// --------------------------------------------
// Notification Preferences
// --------------------------------------------

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: Record<NotificationCategory, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string; // HH:MM
    end: string;
  };
}

// --------------------------------------------
// Notification Group
// --------------------------------------------

export interface NotificationGroup {
  date: string; // 'today' | 'yesterday' | 'YYYY-MM-DD'
  label: string;
  notifications: NotificationItem[];
}

// --------------------------------------------
// Notification Summary
// --------------------------------------------

export interface NotificationSummary {
  total: number;
  unread: number;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
}

// --------------------------------------------
// Helper Functions
// --------------------------------------------

export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    'approval-required': '📋',
    'approval-received': '✅',
    'approval-rejected': '❌',
    'comment-added': '💬',
    'comment-reply': '↩️',
    'document-uploaded': '📄',
    'document-updated': '📝',
    'meeting-scheduled': '📅',
    'meeting-reminder': '⏰',
    'meeting-cancelled': '🚫',
    'workflow-stage-change': '🔄',
    'workflow-completed': '🎉',
    'compliance-alert': '⚠️',
    'risk-alert': '🚨',
    'system-announcement': '📢',
    'mention': '@',
  };
  return icons[type];
};

export const getCategoryColor = (category: NotificationCategory): string => {
  const colors: Record<NotificationCategory, string> = {
    workflow: '#3B82F6',
    document: '#10B981',
    meeting: '#8B5CF6',
    compliance: '#F59E0B',
    risk: '#EF4444',
    system: '#6B7280',
    message: '#EC4899',
  };
  return colors[category];
};

export const getPriorityColor = (priority: NotificationPriority): string => {
  const colors: Record<NotificationPriority, string> = {
    low: '#6B7280',
    normal: '#3B82F6',
    high: '#F59E0B',
    urgent: '#EF4444',
  };
  return colors[priority];
};

export const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const groupNotificationsByDate = (notifications: NotificationItem[]): NotificationGroup[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, NotificationItem[]> = {};

  notifications.forEach(notification => {
    const notifDate = new Date(notification.createdAt);
    notifDate.setHours(0, 0, 0, 0);

    let key: string;
    let label: string;

    if (notifDate.getTime() === today.getTime()) {
      key = 'today';
      label = 'Today';
    } else if (notifDate.getTime() === yesterday.getTime()) {
      key = 'yesterday';
      label = 'Yesterday';
    } else {
      key = notifDate.toISOString().split('T')[0];
      label = notifDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notification);
  });

  return Object.entries(groups).map(([date, notifications]) => ({
    date,
    label: date === 'today' ? 'Today' : date === 'yesterday' ? 'Yesterday' : notifications[0].createdAt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
    notifications: notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  }));
};
