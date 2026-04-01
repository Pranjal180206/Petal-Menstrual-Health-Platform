import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { TourProvider } from './context/TourContext';
import TourOverlay from './components/TourOverlay';
import TourPrompt from './components/TourPrompt';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import CommunityHub from './pages/CommunityHub';
import Education from './pages/Education';
import Quizzes from './pages/Quizzes';
import UserProfile from './pages/UserProfile';
import Onboarding from './pages/Onboarding';
import TrackerRestrictionPage from './pages/TrackerRestrictionPage';
import FloatingBackground from './components/FloatingBackground';
import AdminPanel from './pages/AdminPanel';
import AboutUpay from './pages/AboutUpay';

// Cycle Tracker parent layout + all sub-pages
import CycleTrackerLayout from './components/CycleTrackerLayout';
import DashboardOverview from './pages/DashboardOverview';
import CycleTracker from './pages/CycleTracker';
import RiskAnalysis from './pages/RiskAnalysis';
import Insights from './pages/Insights';
import CycleSettings from './pages/CycleSettings';

// ── Page transition wrapper ──
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="w-full flex-1 flex flex-col outline-none"
  >
    {children}
  </motion.div>
);

// ── Protected route — redirects to /login if not authenticated ──
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// ── Tracker Guard — Allows logged-in female users and anyone who menstruates ──
const TrackerGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow access if user is female OR is menstruating
  const hasAccess = user.gender === 'female' || user.is_menstruating;
  
  // If user doesn't have access, redirect to restricted page
  if (!hasAccess) {
    return <Navigate to="/tracker-restricted" replace />;
  }
  
  return children;
};

// ── Female-only guard for cycle settings ──
const FemaleCycleSettingsGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.gender !== 'female') {
    return <Navigate to="/tracker-restricted" replace />;
  }

  return children;
};

// ── Onboarding Redirect — Forces onboarding if not complete ──
const OnboardingRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return null;
  
  // If logged in but onboarding not complete, force redirect
  if (user && !user.onboarding_complete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If onboarding IS complete but user tries to go back to /onboarding
  if (user && user.onboarding_complete && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ── Stub pages for legal / support links ──
const SimpleInfoPage = ({ title, children }) => (
  <div className="min-h-screen bg-[#FAFAFA] font-sans">
    <Navbar />
    <main className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-heading font-extrabold text-[#1D1D2C] mb-4">{title}</h1>
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 text-left text-gray-600 text-sm leading-relaxed space-y-4">
        {children}
      </div>
    </main>
  </div>
);

const ContactPage = () => (
  <SimpleInfoPage title="Upay Contact & Help Center">
    <p>Need support or have feedback? Reach out to the Upay team at:</p>
    <p className="font-bold text-[#D81B60]">support@upay.org (placeholder)</p>
    <p>Our team usually responds within 24–48 hours. For urgent health concerns, please contact a qualified healthcare professional.</p>
    <p className="font-bold">Parent/Guardian Inquiries:</p>
    <p>If you're a parent or guardian and need guidance, contact us at <span className="text-[#D81B60] font-bold">parents@upay.org (placeholder)</span></p>
  </SimpleInfoPage>
);

const PrivacyPage = () => (
  <SimpleInfoPage title="Teen Privacy Policy">
    <p className="font-bold">Last updated: 2026</p>
    <p>Upay designed this platform with privacy as a top priority. All health data you log is encrypted, stored securely, and never sold to third parties.</p>
    <p className="font-bold">What we collect:</p>
    <ul className="list-disc ml-5 space-y-1">
      <li>Cycle dates and flow intensity (only what you log)</li>
      <li>Mood and symptom logs</li>
      <li>Account information (name, email)</li>
    </ul>
    <p className="font-bold">What we never do:</p>
    <ul className="list-disc ml-5 space-y-1">
      <li>Sell your data to advertisers</li>
      <li>Share identifiable health data with third parties</li>
      <li>Use your data for purposes other than improving your experience</li>
    </ul>
    <p>Full privacy policy available at launch. Questions? Email <span className="text-[#D81B60] font-bold">privacy@upay.org (placeholder)</span></p>
  </SimpleInfoPage>
);

const TermsPage = () => (
  <SimpleInfoPage title="Terms of Service">
    <p className="font-bold">Last updated: 2026</p>
    <p>By using this Upay platform, you agree to these terms. This is an informational health platform designed for educational purposes.</p>
    <p className="font-bold">Medical Disclaimer:</p>
    <p>Petal does not provide medical advice. Information on this platform is for educational purposes only. Always consult a qualified healthcare provider for medical concerns.</p>
    <p className="font-bold">Age:</p>
    <p>The platform is designed for users aged 13 and above. Users under 18 should have parental awareness while using this platform.</p>
    <p>For the full terms, contact <span className="text-[#D81B60] font-bold">legal@upay.org (placeholder)</span></p>
  </SimpleInfoPage>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <OnboardingRedirect>
        <Routes location={location} key={location.pathname}>
          {/* Public Pages */}
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/community" element={<PageWrapper><CommunityHub /></PageWrapper>} />
          <Route path="/education" element={<PageWrapper><Education /></PageWrapper>} />
          <Route path="/quizzes" element={<PageWrapper><Quizzes /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
          <Route path="/about-upay" element={<PageWrapper><AboutUpay /></PageWrapper>} />
          <Route path="/tracker-restricted" element={<PageWrapper><TrackerRestrictionPage /></PageWrapper>} />
          <Route path="/account/settings" element={<Navigate to="/profile" replace />} />

          {/* Onboarding Flow */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          {/* Admin Panel */}
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          {/* Protected Pages */}
          <Route path="/profile" element={<ProtectedRoute><PageWrapper><UserProfile /></PageWrapper></ProtectedRoute>} />

          {/* Cycle Tracker — open during testing, wrap with ProtectedRoute when ready to lock */}
          <Route path="/cycle-tracker" element={<ProtectedRoute><TrackerGuard><CycleTrackerLayout /></TrackerGuard></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="tracker" element={<CycleTracker />} />
            <Route path="risk" element={<RiskAnalysis />} />
            <Route path="insights" element={<Insights />} />
            <Route path="settings" element={<FemaleCycleSettingsGuard><CycleSettings /></FemaleCycleSettingsGuard>} />
          </Route>

          {/* Legacy redirects — keep old URLs working */}
          <Route path="/dashboard" element={<Navigate to="/cycle-tracker" replace />} />
          <Route path="/dashboard/tracker" element={<Navigate to="/cycle-tracker/tracker" replace />} />
          <Route path="/risk" element={<Navigate to="/cycle-tracker/risk" replace />} />
        </Routes>
      </OnboardingRedirect>
    </AnimatePresence>
  );
};

const LandingPage = () => (
  <div className="relative overflow-hidden">
    <FloatingBackground />
    <div className="bg-gradient-hero pb-24 md:pb-28 lg:pb-32 relative z-10">
      <Navbar isHome={true} />
      <Hero />
    </div>
    <div className="relative z-10">
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <TourProvider>
          <div className="w-full min-h-screen bg-white font-sans text-brand-dark overflow-x-hidden">
            <TourOverlay />
            <TourPrompt />
            <AnimatedRoutes />
          </div>
        </TourProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
