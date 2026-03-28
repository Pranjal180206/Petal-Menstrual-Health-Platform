import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarDays,
    TrendingUp,
    FileText,
    Lightbulb,
    Settings,
    ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import PetalIcon from './PetalIcon';
import ChatWidget from './ChatWidget';

const CycleTrackerLayout = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navLinks = [
        { to: '/cycle-tracker', end: true, icon: <LayoutDashboard size={18} />, labelKey: 'sidebar.dashboard' },
        { to: '/cycle-tracker/tracker', icon: <CalendarDays size={18} />, labelKey: 'sidebar.cycleAndMood' },
        { to: '/cycle-tracker/risk', icon: <TrendingUp size={18} />, labelKey: 'sidebar.riskAnalysis' },
        { to: '/cycle-tracker/report', icon: <FileText size={18} />, labelKey: 'sidebar.reportGenerator' },
        { to: '/cycle-tracker/insights', icon: <Lightbulb size={18} />, labelKey: 'sidebar.insights', tourId: 'nav-item-insights' },
    ];

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
            isActive
                ? 'bg-gradient-to-r from-[#FFF0F4] to-[#FFE3EE] text-[#D81B60] shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
        }`;

    return (
        <div className="min-h-screen bg-[#F7F8FA] font-sans text-[#1D1D2C] flex">

            {/* ── Sidebar ── */}
            <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40 shadow-sm">

                {/* Logo */}
                <div className="px-5 pt-5 pb-3">
                    <div 
                        data-tour-id="petal-logo-sidebar"
                        className="flex items-center gap-3 px-1 mb-4"
                    >
                        <div className="bg-gradient-to-br from-[#D81B60] to-[#F06292] text-white p-2 rounded-xl shadow-sm">
                            <PetalIcon size={20} />
                        </div>
                        <div>
                            <span className="font-heading font-bold text-xl tracking-tight text-[#1D1D2C] block leading-none">
                                Petal
                            </span>
                            <span className="text-[10px] text-[#D81B60] font-bold tracking-wide uppercase">
                                {t('sidebar.tagline')}
                            </span>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-[#D81B60] transition-colors group w-full px-1"
                    >
                        <span className="w-6 h-6 rounded-lg bg-gray-200 group-hover:bg-[#FFF0F4] text-gray-700 group-hover:text-[#D81B60] flex items-center justify-center transition-colors">
                            <ChevronLeft size={14} />
                        </span>
                        {t('sidebar.backToHome')}
                    </button>
                </div>

                {/* Section Label */}
                <div className="px-5 pt-4 pb-2">
                    <p className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase">
                        {t('sidebar.navigation')}
                    </p>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                    <NavLink
                        to="/cycle-tracker/settings"
                        className={linkClass}
                    >
                        <Settings size={18} />
                        {t('sidebar.settings')}
                    </NavLink>

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
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
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
