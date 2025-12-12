// ============================================
// NOTIFICATION CENTER
// Bell icon dropdown with notifications
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { Badge, Button, Avatar } from './index';
import { useNotifications } from '../../hooks/useNotifications';
import {
  NotificationItem,
  NotificationCategory,
  getNotificationIcon,
  getCategoryColor,
  getPriorityColor,
  formatNotificationTime,
} from '../../types/notifications';

interface NotificationCenterProps {
  onNotificationClick?: (notification: NotificationItem) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    groups,
    markAsRead,
    markAllAsRead,
    dismiss,
    filterByCategory,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = filterByCategory(filter);

  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    onNotificationClick?.(notification);
    if (notification.actionUrl) {
      // In real app, would use router navigation
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const renderNotification = (notification: NotificationItem) => (
    <div
      key={notification.id}
      className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.read ? 'bg-blue-50/50' : ''
      }`}
      onClick={() => handleNotificationClick(notification)}
    >
      <div className="flex items-start gap-3">
        {/* Icon or Avatar */}
        <div className="flex-shrink-0">
          {notification.senderName ? (
            <Avatar name={notification.senderName} size="sm" />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: getCategoryColor(notification.category) }}
            >
              {getNotificationIcon(notification.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </p>
            {notification.priority === 'urgent' || notification.priority === 'high' ? (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: getPriorityColor(notification.priority) }}
              />
            ) : null}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{notification.message}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">
              {formatNotificationTime(notification.createdAt)}
            </span>
            {notification.actionLabel && (
              <span className="text-xs text-primary-600 font-medium">
                {notification.actionLabel}
              </span>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismiss(notification.id);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 px-2 py-2 border-b bg-gray-50 overflow-x-auto">
            {(['all', 'workflow', 'document', 'meeting', 'compliance', 'risk', 'message'] as const).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                    filter === category
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto divide-y">
            {filteredNotifications.length > 0 ? (
              groups.map((group) => {
                const groupNotifications = group.notifications.filter(
                  (n) => filter === 'all' || n.category === filter
                );
                if (groupNotifications.length === 0) return null;

                return (
                  <div key={group.date}>
                    <div className="px-4 py-2 bg-gray-50 sticky top-0">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {group.label}
                      </span>
                    </div>
                    <div className="divide-y">
                      {groupNotifications.map((notification) =>
                        renderNotification(notification)
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-300 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-gray-500">No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-gray-50">
            <Button variant="ghost" className="w-full text-sm">
              View All Notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Standalone notification toast for real-time notifications
export const NotificationToast: React.FC<{
  notification: NotificationItem;
  onClose: () => void;
  onClick?: () => void;
}> = ({ notification, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border p-4 cursor-pointer animate-slide-in z-50"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: getCategoryColor(notification.category) }}
        >
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className="font-semibold text-gray-900">{notification.title}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          {notification.actionLabel && (
            <p className="text-sm text-primary-600 font-medium mt-2">
              {notification.actionLabel} →
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
