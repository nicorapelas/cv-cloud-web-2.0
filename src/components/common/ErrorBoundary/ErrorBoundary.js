import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Log immediately when error is detected
    console.error('🚨 ErrorBoundary: getDerivedStateFromError called', error);
    
    // Log to refresh debugger if available
    if (typeof window !== 'undefined' && window.refreshDebugger) {
      window.refreshDebugger.log('ERROR_BOUNDARY_DETECTED', {
        error: error?.toString(),
        errorMessage: error?.message,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Component stack:', errorInfo.componentStack);
    
    // Log to refresh debugger if available
    if (typeof window !== 'undefined' && window.refreshDebugger) {
      window.refreshDebugger.log('ERROR_BOUNDARY', {
        error: error?.toString(),
        errorMessage: error?.message,
        errorStack: error?.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Log reload attempt
    if (typeof window !== 'undefined' && window.refreshDebugger) {
      window.refreshDebugger.log('ERROR_BOUNDARY_RELOAD', {
        timestamp: new Date().toISOString(),
        reloadOnError: this.props.reloadOnError,
        stack: new Error().stack,
      });
    }
    
    // Reset the error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Optionally reload the page - but add delay to allow logging
    if (this.props.reloadOnError) {
      console.error('🔄 ErrorBoundary: Auto-reloading page due to error...');
      // Add small delay to ensure logs are captured
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-boundary-actions">
              <button 
                className="error-boundary-button primary" 
                onClick={this.handleReload}
              >
                Try Again
              </button>
              {this.props.reloadOnError && (
                <button 
                  className="error-boundary-button secondary" 
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
