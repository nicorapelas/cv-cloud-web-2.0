import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  Context as AuthContext,
  Provider as AuthProvider,
} from './context/AuthContext';
import {
  Provider as AdvertisementProvider,
  Context as AdvertisementContext,
} from './context/AdvertisementContext';
import { Provider as NavProvider } from './context/NavContext';
import { Provider as PersonalInfoProvider } from './context/PersonalInfoContext';
import { Provider as ContactInfoProvider } from './context/ContactInfoContext';
import { Provider as PersonalSummaryProvider } from './context/PersonalSummaryContext';
import { Provider as ExperienceProvider } from './context/ExperienceContext';
import './styles/cv-templates-responsive.css';
import { Provider as SecondEduProvider } from './context/SecondEduContext';
import { Provider as SkillProvider } from './context/SkillContext';
import { Provider as LanguageProvider } from './context/LanguageContext';
import { Provider as ReferenceProvider } from './context/ReferenceContext';
import { Provider as TertEduProvider } from './context/TertEduContext';
import { Provider as InterestProvider } from './context/InterestContext';
import { Provider as AttributeProvider } from './context/AttributeContext';
import { Provider as EmployHistoryProvider } from './context/EmployHistoryContext';
import { Provider as PhotoProvider } from './context/PhotoContext';
import { Provider as FirstImpressionProvider } from './context/FirstImpressionContext';
import { Provider as CertificateProvider } from './context/CertificateContext';
import { Provider as ShareCVProvider } from './context/ShareCVContext';
import { Provider as UniversalProvider } from './context/UniversalContext';
import { Provider as SaveCVProvider } from './context/SaveCVContext';
import { Provider as PublicCVProvider } from './context/PublicCVContext';
import { RealTimeProvider } from './context/RealTimeContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import refreshDebugger from './utils/debugRefresh';

// Landing and Auth Components
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login/Login';
import Signup from './components/Auth/Signup/Signup';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword';

// App Components (to be created)
import Dashboard from './components/App/Dashboard/Dashboard';
import CVBuilder from './components/App/CVBuilder/CVBuilder';
import ViewCV from './components/App/ViewCV/ViewCV';
import ShareCV from './components/App/ShareCV/ShareCV';
import SharedCVView from './components/App/SharedCVView/SharedCVView';
import HRIntroduction from './components/HRIntroduction/HRIntroduction';
import HRDashboard from './components/App/HR/HRDashboard/HRDashboard';
import HRViewCV from './components/App/HR/HRViewCV/HRViewCV';
import HRBrowseCVs from './components/App/HR/HRBrowseCVs/HRBrowseCVs';
import AdminPanel from './components/App/AdminPanel/AdminPanel';
import EmailVerification from './components/Auth/EmailVerification/EmailVerification';

// Common Components
import Loader from './components/common/loader/Loader';
import AdBanner from './components/common/AdBanner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const {
    state: { token, user },
  } = useContext(AuthContext);
  const location = useLocation(); // Get location to preserve query params

  // Check if user is authenticated (either has token or is web-authenticated)
  if (!token && !user) {
    // Preserve full path including query params
    const currentPath = location.pathname + location.search;
    
    // Log redirect for debugging
    if (typeof window !== 'undefined' && window.refreshDebugger) {
      window.refreshDebugger.log('AUTH_REDIRECT', {
        reason: 'No token and no user',
        currentPath,
        redirectTo: `/login?from=${encodeURIComponent(currentPath)}`,
        timestamp: new Date().toISOString(),
        stack: new Error().stack,
      });
      console.warn('🔄 ProtectedRoute: Redirecting to login - no token and no user');
    }
    
    return (
      <Navigate to={`/login?from=${encodeURIComponent(currentPath)}`} replace />
    );
  }
  return (
    <>
      {children}
      <AdBanner />
    </>
  );
};

// App Routes Component
const AppRoutes = () => {
  const {
    state: { loading, token, user },
    tryLocalSignin,
    fetchUser,
  } = useContext(AuthContext);

  const { fetchSystemSettings } = useContext(AdvertisementContext);

  React.useEffect(() => {
    tryLocalSignin();
    fetchSystemSettings(); // Fetch system settings on app load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Periodic session check for authenticated users
  React.useEffect(() => {
    if (token || user) {
      // Check session validity every 5 minutes
      const sessionCheckInterval = setInterval(
        async () => {
          try {
            console.log('🔐 Running periodic session check...');
            // Silent mode: don't show loading or trigger UI changes
            const userData = await fetchUser(true);
            if (!userData) {
              console.warn('⚠️ Session check returned no user data - user may be logged out');
              if (typeof window !== 'undefined' && window.refreshDebugger) {
                window.refreshDebugger.log('SESSION_CHECK_FAILED', {
                  reason: 'fetchUser returned null/undefined',
                  timestamp: new Date().toISOString(),
                });
              }
            } else {
              console.log('✅ Session check passed');
            }
          } catch (error) {
            console.error('❌ Session check failed:', error);
            if (typeof window !== 'undefined' && window.refreshDebugger) {
              window.refreshDebugger.log('SESSION_CHECK_ERROR', {
                error: error?.toString(),
                errorMessage: error?.message,
                status: error?.response?.status,
                timestamp: new Date().toISOString(),
              });
            }
          }
        },
        5 * 60 * 1000
      ); // 5 minutes

      return () => clearInterval(sessionCheckInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]); // fetchUser is stable, don't include it

  if (loading) {
    return <Loader show={loading} message="Authenticating..." />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/hr-introduction" element={<HRIntroduction />} />
        <Route path="/email-verified/:id" element={<EmailVerification />} />
        <Route path="/view-shared-cv/:id" element={<SharedCVView />} />
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/hr-dashboard"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <HRDashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/hr-view-cv/:id"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <HRViewCV />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/hr-browse-cvs"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <HRBrowseCVs />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/cv-builder/:section"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <CVBuilder />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/cv-builder"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <CVBuilder />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/view-cv"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <ViewCV />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/share-cv"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <ShareCV />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/admin"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <AdminPanel />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Navigate to="/app/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  // Initialize debugger and show instructions
  React.useEffect(() => {
    console.log('%c🔍 Refresh Debugger Active', 'color: #06b6d4; font-size: 16px; font-weight: bold;');
    console.log('%c💡 Use window.refreshDebugger.printSummary() to see all debug logs', 'color: #06b6d4;');
    console.log('%c💡 Use window.refreshDebugger.getLogs() to get all logs', 'color: #06b6d4;');
    console.log('%c💡 Use window.refreshDebugger.getLogsByType("ERROR_BOUNDARY") to filter logs', 'color: #06b6d4;');
    
    // Check if HMR is enabled
    if (typeof module !== 'undefined' && module.hot) {
      console.log('%c🔥 HMR (Hot Module Replacement) is enabled', 'color: #f59e0b;');
      console.log('%c⚠️ If you see random refreshes, HMR might be the cause', 'color: #f59e0b;');
      console.log('%c💡 To disable HMR, set FAST_REFRESH=false in .env file', 'color: #f59e0b;');
    } else {
      console.log('%c✅ HMR is disabled', 'color: #10b981;');
    }
  }, []);

  return (
    <ErrorBoundary reloadOnError={false}>
      <Router>
        <AuthProvider>
          <AdvertisementProvider>
            <NavProvider>
              <PersonalInfoProvider>
                <ContactInfoProvider>
                  <PersonalSummaryProvider>
                    <ExperienceProvider>
                      <SecondEduProvider>
                        <SkillProvider>
                          <LanguageProvider>
                            <ReferenceProvider>
                              <TertEduProvider>
                                <InterestProvider>
                                  <AttributeProvider>
                                    <EmployHistoryProvider>
                                      <PhotoProvider>
                                        <FirstImpressionProvider>
                                          <CertificateProvider>
                                            <ShareCVProvider>
                                              <UniversalProvider>
                                                <RealTimeProvider>
                                                  <NotificationProvider>
                                                    <SaveCVProvider>
                                                      <PublicCVProvider>
                                                        <AppRoutes />
                                                      </PublicCVProvider>
                                                    </SaveCVProvider>
                                                  </NotificationProvider>
                                                </RealTimeProvider>
                                              </UniversalProvider>
                                            </ShareCVProvider>
                                          </CertificateProvider>
                                        </FirstImpressionProvider>
                                      </PhotoProvider>
                                    </EmployHistoryProvider>
                                  </AttributeProvider>
                                </InterestProvider>
                              </TertEduProvider>
                            </ReferenceProvider>
                          </LanguageProvider>
                        </SkillProvider>
                      </SecondEduProvider>
                    </ExperienceProvider>
                  </PersonalSummaryProvider>
                </ContactInfoProvider>
              </PersonalInfoProvider>
            </NavProvider>
          </AdvertisementProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
