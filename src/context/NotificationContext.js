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
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
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
      // Clear local state
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    } catch (error) {
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
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await api.get('/api/notifications');

      // Check if response.data is an array before mapping
      const notificationsData = Array.isArray(response.data)
        ? response.data
        : [];

      const notifications = notificationsData.map(notification => ({
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
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Failed to fetch notifications',
      });
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

    // Listen for CV saved by HR notifications
    const handleCVSavedByHR = data => {
      console.log('💾 CV saved by HR - refreshing notifications');
      // Fetch from server to get the persistent notification
      // This ensures we have the correct notification ID and all data from DB
      fetchNotifications();
    };

    // Listen for public CV viewed (also triggers when HR saves from Browse)
    const handlePublicCVViewed = data => {
      console.log('👁️ Public CV viewed - refreshing notifications');
      // Fetch from server to get the persistent notification
      fetchNotifications();
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
    socketService.addEventListener('cv-saved-by-hr', handleCVSavedByHR);
    socketService.addEventListener('public-cv-viewed', handlePublicCVViewed);
    socketService.addEventListener('notification', handleGeneralNotification);

    // Cleanup function
    return () => {
      socketService.removeEventListener('cv-viewed', handleCVViewed);
      socketService.removeEventListener('cv-saved-by-hr', handleCVSavedByHR);
      socketService.removeEventListener(
        'public-cv-viewed',
        handlePublicCVViewed
      );
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
