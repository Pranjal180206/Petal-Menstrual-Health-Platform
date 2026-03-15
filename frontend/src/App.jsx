import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
            <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/education" element={<Education />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Cycle Tracker — Parent Layout with Sidebar */}
            <Route path="/cycle-tracker" element={<CycleTrackerLayout />}>
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
        </div>
        </TourProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
