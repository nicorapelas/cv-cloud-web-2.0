import React, { createContext, useContext, useReducer, useEffect } from 'react';
import socketService from '../services/socketService';
import api from '../api/api';

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
};

// Create context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Add notification
  const addNotification = notification => {
    const notificationWithId = {
      ...notification,
      id: Date.now() + Math.random(), // Simple ID generation
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notificationWithId });
  };

  // Mark notification as read
  const markAsRead = async notificationId => {
    try {
      // Update server
      await api.put(`/api/notifications/${notificationId}/read`);
      // Update local state
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update local state even if server call fails
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  // Remove notification
  const removeNotification = async notificationId => {
    try {
      // Delete from server
      await api.delete(`/api/notifications/${notificationId}`);
      // Remove from local state
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Still remove from local state even if server call fails
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      // Delete all from server
      const response = await api.delete('/api/notifications');
      console.log('All notifications deleted:', response.data);
      // Clear local state
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      // Still clear local state even if server call fails
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    }
  };

  // Set notifications (for initial load)
  const setNotifications = notifications => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  };

  // Fetch notifications from server
  const fetchNotifications = async () => {
    console.log('Fetching notifications');
    try {
      const response = await api.get('/api/notifications');
      console.log('Notifications fetched:', response.data);
      const notifications = response.data.map(notification => ({
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: {
          recipientEmail: notification.recipientEmail,
          shareCVId: notification.shareCVId,
        },
        timestamp: notification.createdAt,
        isRead: notification.isRead,
      }));

      setNotifications(notifications);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  // Setup socket listeners
  useEffect(() => {
    // Listen for CV view notifications
    const handleCVViewed = data => {
      addNotification({
        type: 'cv_viewed',
        title: data.title || 'CV Viewed!',
        message: data.message || 'Someone has viewed your CV',
        data: {
          recipientEmail: data.recipientEmail,
          recipientName: data.recipientName,
          shareCVId: data.shareCVId,
          viewedAt: data.viewedAt,
        },
      });
    };

    // Listen for general notifications
    const handleGeneralNotification = data => {
      addNotification({
        type: data.type || 'general',
        title: data.title || 'Notification',
        message: data.message || 'You have a new notification',
        data: data.data || {},
      });
    };

    // Add event listeners
    socketService.addEventListener('cv-viewed', handleCVViewed);
    socketService.addEventListener('notification', handleGeneralNotification);

    // Cleanup function
    return () => {
      socketService.removeEventListener('cv-viewed', handleCVViewed);
      socketService.removeEventListener(
        'notification',
        handleGeneralNotification
      );
    };
  }, []);

  const value = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    setNotifications,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

export default NotificationContext;
