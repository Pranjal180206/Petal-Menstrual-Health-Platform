import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarDays,
    TrendingUp,
    Lightbulb,
    Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

import ChatWidget from './ChatWidget';
import Navbar from './Navbar';

const CycleTrackerLayout = () => {
    const { user } = useAuth();
    const { t } = useTranslation();


    const isMenstruating = user?.is_menstruating;
    const isFemale = user?.gender === 'female';

    const allNavLinks = [
        { to: '/cycle-tracker', end: true, icon: <LayoutDashboard size={18} />, labelKey: 'sidebar.dashboard' },
        { to: '/cycle-tracker/tracker', icon: <CalendarDays size={18} />, labelKey: 'sidebar.cycleAndMood', restricted: true },
        { to: '/cycle-tracker/risk', icon: <TrendingUp size={18} />, labelKey: 'sidebar.riskAnalysis', restricted: true },
        { to: '/cycle-tracker/insights', icon: <Lightbulb size={18} />, labelKey: 'sidebar.insights', tourId: 'nav-item-insights' },
    ];

    const navLinks = allNavLinks.filter(link => {
        // Show restricted links only if user is female or is menstruating
        if (link.restricted && !isFemale && !isMenstruating) return false;
        return true;
    });
    const showCycleSettings = isFemale;

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
            isActive
                ? 'bg-gradient-to-r from-[#FFF0F4] to-[#FFE3EE] text-[#D81B60] shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
        }`;

    return (
        <div className="min-h-screen bg-[#F7F8FA] font-sans text-[#1D1D2C] flex">

            {/* ── Sidebar ── */}
            <aside className="w-64 h-[calc(100vh-3rem)] m-6 bg-white border border-gray-100 rounded-[2rem] flex flex-col fixed left-0 top-0 z-40 shadow-card overflow-hidden">


                {/* Nav Links */}
                <nav className="flex-1 px-4 pt-6 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={linkClass}
                            {...(link.tourId ? { 'data-tour-id': link.tourId } : {})}
                        >
                            {link.icon}
                            {t(link.labelKey)}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom User Card */}
                <div className="p-4 border-t border-gray-100">
                    {showCycleSettings && (
                        <NavLink
                            to="/cycle-tracker/settings"
                            className={linkClass}
                        >
                            <Settings size={18} />
                            {t('sidebar.cycleSettings')}
                        </NavLink>
                    )}

                    <div className="flex items-center gap-3 px-4 mt-4">
                      {user?.avatar_url 
                        ? <img 
                            src={user.avatar_url} 
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-[#FCE4EC] shadow-sm"
                          />
                        : <div className="w-10 h-10 rounded-full border-2 border-[#FCE4EC] shadow-sm bg-pink-400 flex items-center justify-center text-white font-bold">
                            {user?.name?.[0]?.toUpperCase() ?? 'G'}
                          </div>
                      }
                      <div>
                        <p className="font-bold text-sm text-[#1D1D2C] leading-none mb-1">
                          {user?.name ?? 'Guest'}
                        </p>
                        <p className="text-[10px] text-[#D81B60] font-bold">
                          {user ? t('sidebar.member') : ''}
                        </p>
                      </div>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 ml-[19rem] flex flex-col min-h-screen pr-6">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* ── Floating AI Chat Widget ── */}
            <ChatWidget />
        </div>
    );
};

export default CycleTrackerLayout;
