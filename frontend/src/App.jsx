import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import CommunityHub from './pages/CommunityHub';
import Education from './pages/Education';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import CycleTracker from './pages/CycleTracker';
import RiskLayout from './components/RiskLayout';
import RiskAnalysis from './pages/RiskAnalysis';

const LandingPage = () => {
  return (
    <>
      {/* Top section with subtle gradient background */}
      <div className="bg-gradient-hero pb-12">
        <Navbar />
        <Hero />
      </div>

      {/* Rest of the sections */}
      <Stats />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="w-full min-h-screen bg-white font-sans text-brand-dark overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/education" element={<Education />} />

            {/* Authenticated Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="tracker" element={<CycleTracker />} />
            </Route>

            {/* Risk Analysis Routes (Different Layout) */}
            <Route path="/risk" element={<RiskLayout />}>
              <Route index element={<RiskAnalysis />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
