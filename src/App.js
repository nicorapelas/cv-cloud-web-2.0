import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  Context as AuthContext,
  Provider as AuthProvider,
} from './context/AuthContext';
import { Provider as NavProvider } from './context/NavContext';
import { Provider as PersonalInfoProvider } from './context/PersonalInfoContext';
import { Provider as ContactInfoProvider } from './context/ContactInfoContext';
import { Provider as PersonalSummaryProvider } from './context/PersonalSummaryContext';
import { Provider as ExperienceProvider } from './context/ExperienceContext';
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
import EmailVerification from './components/Auth/EmailVerification/EmailVerification';

// Common Components
import Loader from './components/common/loader/Loader';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const {
    state: { token, user },
  } = useContext(AuthContext);

  // Check if user is authenticated (either has token or is web-authenticated)
  if (!token && !user) {
    const currentPath = window.location.pathname;
    return (
      <Navigate to={`/login?from=${encodeURIComponent(currentPath)}`} replace />
    );
  }
  return children;
};

// App Routes Component
const AppRoutes = () => {
  const {
    state: { loading, token, user },
    tryLocalSignin,
    fetchUser,
  } = useContext(AuthContext);

  React.useEffect(() => {
    tryLocalSignin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Periodic session check for authenticated users
  React.useEffect(() => {
    if (token || user) {
      // Check session validity every 5 minutes
      const sessionCheckInterval = setInterval(
        async () => {
          try {
            await fetchUser();
          } catch (error) {
            console.log(
              'Session check failed, user may need to re-authenticate'
            );
          }
        },
        5 * 60 * 1000
      ); // 5 minutes

      return () => clearInterval(sessionCheckInterval);
    }
  }, [token, user, fetchUser]);

  return (
    <>
      <Loader show={loading} message="Authenticating..." />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/hr-introduction" element={<HRIntroduction />} />
        <Route path="/email-verified/:id" element={<EmailVerification />} />
        <Route path="/view-shared-cv/:id" element={<SharedCVView />} />

        {/* Protected App Routes */}
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

        {/* Default /app route - redirect to dashboard */}
        {/* This must come AFTER all other /app/* routes to avoid conflicts */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Navigate to="/app/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary reloadOnError={true}>
      <Router>
        <AuthProvider>
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
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
