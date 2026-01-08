import { io } from 'socket.io-client';
import keys from '../config/keys';

/**
 * Socket.io Client Service for Real-time Communication
 *
 * This service handles:
 * - Connection to the server's Socket.io instance
 * - Authentication with the server
 * - Receiving real-time updates
 * - Automatic reconnection
 * - User activity tracking
 */

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map(); // Store event listeners
  }

  /**
   * Connect to the Socket.io server
   */
  connect() {
    console.log('🔌 SocketService.connect() called');
    
    // If socket exists and is connected, don't create a new one
    if (this.socket && this.isConnected) {
      console.log('🔌 Socket already connected');
      return;
    }

    // If socket exists but not connected, check if it's still valid
    if (this.socket && !this.isConnected) {
      // Check if socket is in a valid state (not disconnected permanently)
      if (this.socket.disconnected) {
        console.log('🔌 Existing socket is disconnected, will reconnect automatically');
        // Socket.io will handle reconnection automatically, just return
        return;
      }
    }

    try {
      // Only create new socket if one doesn't exist
      if (!this.socket) {
        // Create Socket.io connection
        this.socket = io(keys.serverUrl, {
          withCredentials: true,
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          maxReconnectionAttempts: this.maxReconnectAttempts,
          timeout: 20000,
          forceNew: false, // Changed from true - reuse existing connection if possible
        });

        this.setupEventHandlers();
        console.log(`🔌 Socket.io client connecting to ${keys.serverUrl}...`);
      } else {
        // Socket exists but might need to reconnect
        if (this.socket.disconnected) {
          console.log('🔌 Attempting to reconnect existing socket...');
          this.socket.connect();
        }
      }
    } catch (error) {
      console.error('❌ Socket connection failed:', error);
      // Don't throw error, just log it to prevent ErrorBoundary from catching it
    }
  }

  /**
   * Setup Socket.io event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    // Remove existing listeners to prevent duplicates
    this.socket.removeAllListeners('connect');
    this.socket.removeAllListeners('disconnect');
    this.socket.removeAllListeners('connect_error');
    this.socket.removeAllListeners('reconnect');
    this.socket.removeAllListeners('reconnect_error');
    this.socket.removeAllListeners('reconnect_failed');

    // Connection events
    this.socket.on('connect', () => {
      try {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log('✅ Socket connected:', this.socket.id);
        console.log('✅ Socket transport:', this.socket.io.engine.transport.name);

        // Re-authenticate if we have a userId
        if (this.userId) {
          this.authenticate(this.userId);
        }
      } catch (error) {
        console.error('❌ Error in connect handler:', error);
        // Don't throw - prevent ErrorBoundary from catching
      }
    });

    this.socket.on('disconnect', reason => {
      try {
        this.isConnected = false;
        console.log('🔌 Socket disconnected:', reason);
      } catch (error) {
        console.error('❌ Error in disconnect handler:', error);
      }
    });

    this.socket.on('connect_error', error => {
      try {
        console.error('❌ Socket connection error:', error);
        
        // Log to refresh debugger if available
        if (typeof window !== 'undefined' && window.refreshDebugger) {
          window.refreshDebugger.log('SOCKET_ERROR', {
            type: 'connect_error',
            error: error?.toString(),
            message: error?.message,
            timestamp: new Date().toISOString(),
          });
        }
        
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached');
        }
      } catch (err) {
        console.error('❌ Error in connect_error handler:', err);
      }
    });

    this.socket.on('reconnect', attemptNumber => {
      try {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // Re-authenticate after reconnection
        if (this.userId) {
          this.authenticate(this.userId);
        }
      } catch (error) {
        console.error('❌ Error in reconnect handler:', error);
      }
    });

    this.socket.on('reconnect_error', error => {
      try {
        console.error('❌ Socket reconnection error:', error);
        
        // Log to refresh debugger if available
        if (typeof window !== 'undefined' && window.refreshDebugger) {
          window.refreshDebugger.log('SOCKET_ERROR', {
            type: 'reconnect_error',
            error: error?.toString(),
            message: error?.message,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('❌ Error in reconnect_error handler:', err);
      }
    });

    this.socket.on('reconnect_failed', () => {
      try {
        console.error('❌ Socket reconnection failed after max attempts');
        
        // Log to refresh debugger if available
        if (typeof window !== 'undefined' && window.refreshDebugger) {
          window.refreshDebugger.log('SOCKET_ERROR', {
            type: 'reconnect_failed',
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('❌ Error in reconnect_failed handler:', error);
      }
    });

    // Remove existing data event listeners to prevent duplicates
    this.socket.removeAllListeners('data-updated');
    this.socket.removeAllListeners('notification');
    this.socket.removeAllListeners('cv-viewed');
    this.socket.removeAllListeners('public-cv-toggled');
    this.socket.removeAllListeners('public-cv-list-updated');
    this.socket.removeAllListeners('public-cv-viewed');
    this.socket.removeAllListeners('cv-saved-by-hr');
    this.socket.removeAllListeners('saved-cv-updated');

    // Real-time data updates
    this.socket.on('data-updated', data => {
      try {
        // Validate data before processing
        if (!data || typeof data !== 'object') {
          console.warn('⚠️ Invalid data-updated event received:', data);
          return;
        }
        
        console.log('📨 Received data update:', data);
        this.notifyListeners('data-updated', data);
      } catch (error) {
        console.error('❌ Error handling data-updated:', error);
        console.error('❌ Error stack:', error?.stack);
        
        // Log to refresh debugger if available
        if (typeof window !== 'undefined' && window.refreshDebugger) {
          window.refreshDebugger.log('SOCKET_EVENT_ERROR', {
            event: 'data-updated',
            error: error?.toString(),
            errorMessage: error?.message,
            errorStack: error?.stack,
            timestamp: new Date().toISOString(),
          });
        }
        
        // Don't rethrow - prevent ErrorBoundary from catching
      }
    });

    // General notifications
    this.socket.on('notification', data => {
      try {
        console.log('📢 Received notification:', data);
        this.notifyListeners('notification', data);
      } catch (error) {
        console.error('❌ Error handling notification:', error);
      }
    });

    // CV view notifications
    this.socket.on('cv-viewed', data => {
      try {
        console.log('👁️ CV viewed notification:', data);
        this.notifyListeners('cv-viewed', data);
      } catch (error) {
        console.error('❌ Error handling cv-viewed:', error);
      }
    });

    // Public CV notifications
    this.socket.on('public-cv-toggled', data => {
      try {
        console.log('🔄 Public CV toggled:', data);
        this.notifyListeners('public-cv-toggled', data);
      } catch (error) {
        console.error('❌ Error handling public-cv-toggled:', error);
      }
    });

    this.socket.on('public-cv-list-updated', data => {
      try {
        console.log('📋 Public CV list updated:', data);
        this.notifyListeners('public-cv-list-updated', data);
      } catch (error) {
        console.error('❌ Error handling public-cv-list-updated:', error);
      }
    });

    this.socket.on('public-cv-viewed', data => {
      try {
        console.log('👁️ Public CV viewed:', data);
        this.notifyListeners('public-cv-viewed', data);
      } catch (error) {
        console.error('❌ Error handling public-cv-viewed:', error);
      }
    });

    // CV saved by HR notification
    this.socket.on('cv-saved-by-hr', data => {
      try {
        console.log('💾 CV saved by HR:', data);
        this.notifyListeners('cv-saved-by-hr', data);
      } catch (error) {
        console.error('❌ Error handling cv-saved-by-hr:', error);
      }
    });

    // CV update notifications
    this.socket.on('saved-cv-updated', data => {
      try {
        console.log('✨ Saved CV updated:', data);
        this.notifyListeners('saved-cv-updated', data);
      } catch (error) {
        console.error('❌ Error handling saved-cv-updated:', error);
      }
    });
  }

  /**
   * Authenticate user with the server
   * This tells the server which user this socket belongs to
   */
  authenticate(userId) {
    try {
      if (!this.socket || !this.isConnected) {
        console.log('⚠️ Socket not connected, will authenticate when connected');
        this.userId = userId;
        return;
      }

      this.userId = userId;
      this.socket.emit('authenticate', userId);
      console.log('🔐 Authenticated socket with user:', userId);
    } catch (error) {
      console.error('❌ Error authenticating socket:', error);
      // Store userId for later authentication attempt
      this.userId = userId;
    }
  }

  /**
   * Send user activity to server
   */
  sendUserActivity(userId) {
    try {
      if (!this.socket || !this.isConnected) return;

      this.socket.emit('user-activity', userId);
    } catch (error) {
      console.error('❌ Error sending user activity:', error);
    }
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    try {
      if (this.socket) {
        // Remove all listeners before disconnecting
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
        this.userId = null;
        this.reconnectAttempts = 0;
        console.log('🔌 Socket disconnected');
      }
    } catch (error) {
      console.error('❌ Error disconnecting socket:', error);
      // Reset state even if disconnect fails
      this.socket = null;
      this.isConnected = false;
      this.userId = null;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Add event listener
   * @param {string} event - Event name to listen for
   * @param {function} callback - Function to call when event occurs
   */
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} callback - Function to remove
   */
  removeEventListener(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of an event
   * @param {string} event - Event name
   * @param {any} data - Data to pass to listeners
   */
  notifyListeners(event, data) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('❌ Error in socket event listener:', error);
        console.error('❌ Error stack:', error?.stack);
        
        // Log to refresh debugger if available
        if (typeof window !== 'undefined' && window.refreshDebugger) {
          window.refreshDebugger.log('SOCKET_LISTENER_ERROR', {
            event,
            error: error?.toString(),
            errorMessage: error?.message,
            errorStack: error?.stack,
            timestamp: new Date().toISOString(),
          });
        }
        
        // Don't rethrow - prevent ErrorBoundary from catching
        // This is critical - we must not let socket errors bubble up
      }
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      userId: this.userId,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Create and export a singleton instance
const socketService = new SocketService();

export default socketService;
