import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';
import { Bell, X, Check, Trash2, Eye, UserPlus } from 'lucide-react';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    fetchNotifications,
  } = useNotifications();

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotificationCenter = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async notificationId => {
    await markAsRead(notificationId);
  };

  const handleRemoveNotification = async notificationId => {
    await removeNotification(notificationId);
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = type => {
    switch (type) {
      case 'cv_viewed':
        return <Eye className="notification-icon cv-viewed" />;
      case 'cv_saved':
        return <span className="notification-icon cv-saved">💾</span>;
      case 'cv_access_request':
        return <UserPlus className="notification-icon cv-access-request" />;
      default:
        return <Bell className="notification-icon" />;
    }
  };

  const handleNotificationClick = notification => {
    if (notification.type === 'cv_access_request') {
      setIsOpen(false);
      navigate('/app/cv-access-requests');
    }
  };

  return (
    <div className="notification-center">
      {/* Notification Bell Button */}
      <button
        className="notification-bell"
        onClick={toggleNotificationCenter}
        aria-label="Notifications"
      >
        <Bell className="bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  className="mark-all-read-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <Check size={16} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="clear-all-btn"
                  onClick={async () => await clearAllNotifications()}
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell className="no-notifications-icon" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.isRead ? 'unread' : ''
                  } ${notification.type === 'cv_access_request' ? 'notification-item-clickable' : ''}`}
                >
                  <div
                    className="notification-content"
                    role={notification.type === 'cv_access_request' ? 'button' : undefined}
                    tabIndex={notification.type === 'cv_access_request' ? 0 : undefined}
                    onClick={
                      notification.type === 'cv_access_request'
                        ? () => handleNotificationClick(notification)
                        : undefined
                    }
                    onKeyDown={
                      notification.type === 'cv_access_request'
                        ? e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNotificationClick(notification);
                            }
                          }
                        : undefined
                    }
                  >
                    <div className="notification-icon-container">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-text">
                      <h4 className="notification-title">
                        {notification.title}
                      </h4>
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <span className="notification-time">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="notification-actions-item">
                    {!notification.isRead && (
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveNotification(notification.id)}
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="notification-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;
