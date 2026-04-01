import {
    LayoutDashboard,
    CalendarDays,
    LineChart,
    BookOpen,
    Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const { user } = useAuth();
    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">

            {/* Logo */}
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <img src="/upay-logo.png" alt="Upay Logo" className="h-[40px] w-auto object-contain" />
                    <div className="flex flex-col leading-none">
                        <span className="font-heading font-bold text-xl tracking-tight text-[#1D1D2C]">Petal</span>
                        <span className="text-xs text-gray-500 font-medium mt-1">by Upay</span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors
            ${isActive
                            ? 'bg-[#FFF0F4] text-[#D81B60]'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
                        }
          `}
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/dashboard/tracker"
                    className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors
            ${isActive
                            ? 'bg-[#FFF0F4] text-[#D81B60]'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
                        }
          `}
                >
                    <CalendarDays size={18} />
                    Cycle Tracker
                </NavLink>

                <NavLink
                    to="/risk"
                    className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors
            ${isActive
                            ? 'bg-[#FFF0F4] text-[#D81B60]'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
                        }
          `}
                >
                    <LineChart size={18} />
                    Insights
                </NavLink>

                <NavLink
                    to="/dashboard/resources"
                    className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors
            ${isActive
                            ? 'bg-[#FFF0F4] text-[#D81B60]'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
                        }
          `}
                >
                    <BookOpen size={18} />
                    Resources
                </NavLink>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-soft mb-6">
                    <span className="text-lg leading-none">+</span> Log Data
                </button>

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors mb-4
            ${isActive
                            ? 'bg-[#FFF0F4] text-[#D81B60]'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
                        }
          `}
                >
                    <Settings size={18} />
                    Settings
                </NavLink>

                <div className="flex items-center gap-3 px-4">
                    {user?.avatar_url 
                      ? <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
                      : <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold">
                          {user?.name?.[0]?.toUpperCase() ?? 'G'}
                        </div>
                    }
                    <div>
                        <p className="font-bold text-sm text-[#1D1D2C] leading-none mb-1">{user?.name ?? 'Guest'}</p>
                        <p className="text-[10px] text-[#D81B60] font-bold">{user ? 'Member' : ''}</p>
                    </div>
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;
