import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { TourProvider } from './context/TourContext';
import TourOverlay from './components/TourOverlay';
import TourPrompt from './components/TourPrompt';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import CommunityHub from './pages/CommunityHub';
import Education from './pages/Education';
import UserProfile from './pages/UserProfile';
import FloatingBackground from './components/FloatingBackground';

// Cycle Tracker parent layout + all sub-pages
import CycleTrackerLayout from './components/CycleTrackerLayout';
import DashboardOverview from './pages/DashboardOverview';
import CycleTracker from './pages/CycleTracker';
import RiskAnalysis from './pages/RiskAnalysis';
import ReportGenerator from './pages/ReportGenerator';
import Insights from './pages/Insights';
import Settings from './pages/Settings';

const PageWrapper = ({ children }) => {
  return (
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
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Pages */}
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/community" element={<PageWrapper><CommunityHub /></PageWrapper>} />
        <Route path="/education" element={<PageWrapper><Education /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><UserProfile /></PageWrapper>} />

        {/* Cycle Tracker — Parent Layout with Sidebar */}
        <Route path="/cycle-tracker" element={<PageWrapper><CycleTrackerLayout /></PageWrapper>}>
          <Route index element={<DashboardOverview />} />
          <Route path="tracker" element={<CycleTracker />} />
          <Route path="risk" element={<RiskAnalysis />} />
          <Route path="report" element={<ReportGenerator />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Legacy redirects — keep old URLs working */}
        <Route path="/dashboard" element={<Navigate to="/cycle-tracker" replace />} />
        <Route path="/dashboard/tracker" element={<Navigate to="/cycle-tracker/tracker" replace />} />
        <Route path="/risk" element={<Navigate to="/cycle-tracker/risk" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden">
      <FloatingBackground />
      {/* Top section with subtle gradient background */}
      <div className="bg-gradient-hero pb-12 relative z-10">
        <Navbar isHome={true} />
        <Hero />
      </div>

      {/* Rest of the sections */}
      <div className="relative z-10">
        <Stats />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

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
