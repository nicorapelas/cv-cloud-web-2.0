/**
 * Debug utility to track page refreshes and identify causes
 * 
 * This utility helps identify what's causing random page refreshes
 * by logging various events and state changes.
 */

class RefreshDebugger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
    this.startTime = Date.now();
    this.lastSummaryTime = Date.now();
    this.summaryInterval = null;
    this.init();
  }

  init() {
    // Try to restore logs from previous session if available
    try {
      const savedLogs = sessionStorage.getItem('refreshDebuggerLogs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
        sessionStorage.removeItem('refreshDebuggerLogs');
      }
    } catch (e) {
      // Ignore if sessionStorage is not available
    }
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.log('VISIBILITY_CHANGE', {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
        timestamp: new Date().toISOString(),
      });
    });

    // Track beforeunload (page is about to unload)
    window.addEventListener('beforeunload', (e) => {
      const stack = new Error().stack;
      // Check if this is an HMR-related reload
      const isHMRReload = stack && (
        stack.includes('hot-update') || 
        stack.includes('webpack') ||
        stack.includes('HMR')
      );
      
      this.log('BEFORE_UNLOAD', {
        type: e.type,
        timestamp: new Date().toISOString(),
        stack: stack,
        isHMRReload: isHMRReload,
        stackSnippet: stack?.split('\n').slice(0, 5).join('\n'), // First 5 lines of stack
      });
    });

    // Track unload (page is unloading)
    window.addEventListener('unload', () => {
      this.log('UNLOAD', {
        timestamp: new Date().toISOString(),
      });
      // Try to persist logs to sessionStorage before page unloads
      try {
        sessionStorage.setItem('refreshDebuggerLogs', JSON.stringify(this.logs));
      } catch (e) {
        // Ignore if sessionStorage is not available
      }
    });

    // Track unhandled errors
    window.addEventListener('error', (e) => {
      this.log('UNHANDLED_ERROR', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error?.toString(),
        stack: e.error?.stack,
        timestamp: new Date().toISOString(),
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.log('UNHANDLED_PROMISE_REJECTION', {
        reason: e.reason?.toString(),
        stack: e.reason?.stack,
        timestamp: new Date().toISOString(),
      });
    });

    // Note: window.location.reload is read-only, so we can't intercept it directly
    // Instead, we rely on beforeunload/unload events to track page reloads
    // We can also track navigation changes via history API

    // Track any navigation changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      const [state, title, url] = args;
      const stack = new Error().stack;
      const isHMRRelated = stack && (
        stack.includes('hot-update') ||
        stack.includes('webpack') ||
        stack.includes('HMR') ||
        stack.includes('react-refresh')
      );
      
      // Get caller information from stack
      const stackLines = stack?.split('\n') || [];
      const callerLine = stackLines[2] || 'unknown'; // Skip Error and this function
      
      self.log('HISTORY_PUSH_STATE', {
        url,
        state,
        isHMRRelated,
        caller: callerLine,
        fullStack: stack,
        stackSnippet: stackLines.slice(0, 15).join('\n'), // First 15 lines
        timestamp: new Date().toISOString(),
      });
      
      return originalPushState.apply(this, args);
    };

    const originalReplaceState = window.history.replaceState;
    const self = this;
    window.history.replaceState = function(...args) {
      const [state, title, url] = args;
      const stack = new Error().stack;
      const stackLines = stack?.split('\n') || [];
      const callerLine = stackLines[2] || 'unknown';
      
      self.log('HISTORY_REPLACE_STATE', {
        url,
        state,
        caller: callerLine,
        fullStack: stack,
        stackSnippet: stackLines.slice(0, 15).join('\n'),
        timestamp: new Date().toISOString(),
        isLoginRedirect: url && url.includes('/login'),
      });
      
      return originalReplaceState.apply(this, args);
    };

    // Track webpack HMR (Hot Module Replacement) events
    if (typeof module !== 'undefined' && module.hot) {
      // Track HMR status
      module.hot.status((status) => {
        this.log('HMR_STATUS', {
          status,
          timestamp: new Date().toISOString(),
        });
        
        if (status === 'abort' || status === 'fail') {
          this.log('HMR_FAILED', {
            status,
            timestamp: new Date().toISOString(),
          });
        }
      });
      
      // Track when HMR tries to accept updates
      // Note: module.hot.accept is a function that takes a callback, not a function itself
      // We'll track status changes instead
      
      // Track HMR errors
      module.hot.addStatusHandler((status) => {
        if (status === 'abort' || status === 'fail') {
          this.log('HMR_ERROR', {
            status,
            timestamp: new Date().toISOString(),
          });
        }
      });
      
      // Track when modules are disposed
      module.hot.dispose((data) => {
        this.log('HMR_DISPOSE', {
          data: typeof data === 'object' ? Object.keys(data) : data,
          timestamp: new Date().toISOString(),
        });
      });
    }

    // Log initialization
    this.log('INIT', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      hasHMR: typeof module !== 'undefined' && !!module.hot,
    });
    
    // Start automatic periodic summary logging (every 30 seconds)
    // Disabled console logging - logs are still stored internally for debugging
    // this.startPeriodicLogging();
  }
  
  startPeriodicLogging() {
    // Log summary every 30 seconds
    this.summaryInterval = setInterval(() => {
      const timeSinceLastSummary = Date.now() - this.lastSummaryTime;
      const recentLogs = this.logs.filter(log => 
        (Date.now() - this.startTime) - log.time < 30000 // Last 30 seconds
      );
      
      // Periodic logging disabled - logs are still stored internally
      
      this.lastSummaryTime = Date.now();
    }, 30000); // Every 30 seconds
  }
  
  stopPeriodicLogging() {
    if (this.summaryInterval) {
      clearInterval(this.summaryInterval);
      this.summaryInterval = null;
    }
  }

  log(type, data) {
    const logEntry = {
      type,
      data,
      time: Date.now() - this.startTime,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Logging to console disabled - logs are still stored internally
    // Use window.refreshDebugger.printSummary() to view logs when needed
    
    // Auto-log summary for critical events (disabled console output, logs still stored)
    // if (['ERROR_BOUNDARY', 'ERROR_BOUNDARY_DETECTED', 'ERROR_BOUNDARY_RELOAD', 'UNHANDLED_ERROR', 'UNHANDLED_PROMISE_REJECTION', 'BEFORE_UNLOAD', 'UNLOAD', 'HMR_FAILED', 'HMR_ERROR', 'SOCKET_LISTENER_ERROR', 'REALTIME_CONTEXT_ERROR'].includes(type)) {
    //   this.printSummary();
    // }
  }

  getEmoji(type) {
    const emojiMap = {
      'INIT': '🚀',
      'VISIBILITY_CHANGE': '👁️',
      'BEFORE_UNLOAD': '⚠️',
      'UNLOAD': '🔄',
      'UNHANDLED_ERROR': '❌',
      'UNHANDLED_PROMISE_REJECTION': '💥',
      'MANUAL_RELOAD': '🔄',
      'ERROR_BOUNDARY': '🛡️',
      'ERROR_BOUNDARY_DETECTED': '🛡️',
      'ERROR_BOUNDARY_RELOAD': '🔄',
      'SOCKET_ERROR': '🔌',
      'HMR_ACCEPT': '🔥',
      'HMR_ACCEPT_ERROR': '🔥',
      'HMR_DISPOSE': '🔥',
      'HMR_STATUS': '🔥',
      'HMR_FAILED': '🔥',
      'HMR_ERROR': '🔥',
      'HISTORY_PUSH_STATE': '🧭',
      'HISTORY_REPLACE_STATE': '🧭',
      'AUTH_REDIRECT': '🔐',
      'SOCKET_LISTENER_ERROR': '🔌',
      'REALTIME_CONTEXT_ERROR': '📡',
      'SOCKET_EVENT_ERROR': '🔌',
    };
    return emojiMap[type] || '📝';
  }

  getLogs() {
    return this.logs;
  }

  getLogsByType(type) {
    return this.logs.filter(log => log.type === type);
  }

  clearLogs() {
    this.logs = [];
  }

  printSummary() {
    console.log('\n🔍 ========== Refresh Debug Summary ==========');
    console.log(`Total logs: ${this.logs.length}`);
    console.log(`Uptime: ${Math.round((Date.now() - this.startTime) / 1000)} seconds`);
    
    const typeCounts = {};
    this.logs.forEach(log => {
      typeCounts[log.type] = (typeCounts[log.type] || 0) + 1;
    });
    
    console.log('Event counts:', typeCounts);
    
    // Show critical events first
    const criticalTypes = ['ERROR_BOUNDARY', 'ERROR_BOUNDARY_DETECTED', 'ERROR_BOUNDARY_RELOAD', 'UNHANDLED_ERROR', 'UNHANDLED_PROMISE_REJECTION', 'SOCKET_ERROR', 'SOCKET_LISTENER_ERROR', 'SOCKET_EVENT_ERROR', 'REALTIME_CONTEXT_ERROR', 'BEFORE_UNLOAD', 'UNLOAD', 'HMR_FAILED', 'HMR_ERROR', 'HMR_ACCEPT', 'HMR_STATUS', 'HISTORY_REPLACE_STATE', 'HISTORY_PUSH_STATE', 'AUTH_REDIRECT'];
    const criticalLogs = this.logs.filter(log => criticalTypes.includes(log.type));
    if (criticalLogs.length > 0) {
      console.log('\n⚠️ Critical Events:');
      criticalLogs.forEach(log => {
        console.log(`  [${log.type}] at ${log.timestamp}:`, log.data);
        if (log.data?.caller) {
          console.log(`    Caller: ${log.data.caller}`);
        }
        if (log.data?.stackSnippet) {
          console.log(`    Stack:\n${log.data.stackSnippet}`);
        }
      });
    }
    
    // Show recent logs (last 20)
    const recentLogs = this.logs.slice(-20);
    console.log('\n📝 Recent logs (last 20):');
    recentLogs.forEach(log => {
      const emoji = this.getEmoji(log.type);
      console.log(`  ${emoji} [${log.type}] (${Math.round(log.time / 1000)}s ago):`, log.data);
    });
    
    console.log('\n===========================================\n');
    
    return {
      totalLogs: this.logs.length,
      uptime: Date.now() - this.startTime,
      typeCounts,
      logs: this.logs,
    };
  }
}

// Create global instance
const refreshDebuggerInstance = new RefreshDebugger();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.refreshDebugger = refreshDebuggerInstance;
  // Logs are stored internally - use refreshDebugger.printSummary() to view when needed
}

export default refreshDebuggerInstance;
