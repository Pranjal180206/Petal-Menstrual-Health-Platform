import { NavLink, Outlet } from 'react-router-dom';
import {
    Search,
    Bell,
    LayoutGrid,
    TrendingUp,
    AlertTriangle,
    FileText
} from 'lucide-react';
import PetalIcon from './PetalIcon';

const RiskLayout = () => {
    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#1D1D2C] flex flex-col">

            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2">
                        <div className="text-[#FF4081]">
                            <PetalIcon size={24} />
                        </div>
                        <span className="font-heading font-extrabold text-xl tracking-tight">Petal</span>
                    </NavLink>

                    {/* Top Links */}
                    <nav className="hidden md:flex items-center gap-6 ml-4">
                        <NavLink to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-[#1D1D2C]">Dashboard</NavLink>
                        <NavLink to="/risk" className="text-sm font-bold text-[#FF4081] border-b-2 border-[#FF4081] py-5">Risk Analysis</NavLink>
                        <NavLink to="/dashboard/tracker" className="text-sm font-bold text-gray-500 hover:text-[#1D1D2C]">Symptom Log</NavLink>
                        <NavLink to="/community" className="text-sm font-bold text-gray-500 hover:text-[#1D1D2C]">Consultations</NavLink>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search insights..."
                            className="bg-[#F8F9FA] border border-transparent rounded-md pl-9 pr-3 py-1.5 text-xs font-semibold w-56 outline-none focus:border-gray-200"
                        />
                    </div>
                    <button className="relative w-8 h-8 rounded-md bg-[#F8F9FA] flex items-center justify-center text-gray-500 hover:text-[#1D1D2C]">
                        <Bell size={16} />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF4081] rounded-full"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700">
                        <span className="text-sm">👤</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-60 bg-[#F8F9FA] border-r border-gray-200 flex flex-col pt-6 hidden lg:flex h-[calc(100vh-64px)] overflow-y-auto">
                    <div className="px-6 mb-4">
                        <p className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-1">Analytics</p>
                    </div>

                    <nav className="flex-1 px-3 space-y-1">
                        <NavLink to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100">
                            <LayoutGrid size={16} className="text-gray-400" />
                            Overview
                        </NavLink>

                        <NavLink to="/risk" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold bg-[#FFF0F4] text-[#FF4081]">
                            <TrendingUp size={16} />
                            Trend Analysis
                        </NavLink>

                        <NavLink to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100">
                            <AlertTriangle size={16} className="text-gray-400" />
                            Risk Factors
                        </NavLink>

                        <NavLink to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100">
                            <FileText size={16} className="text-gray-400" />
                            Monthly Reports
                        </NavLink>
                    </nav>

                    {/* Pro Feature Promo */}
                    <div className="m-4 mt-auto">
                        <div className="bg-[#FF0055] rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-sm p-4 text-white shadow-md">
                            <p className="text-[9px] font-extrabold tracking-widest uppercase text-white/80 mb-1">Pro Feature</p>
                            <h4 className="font-bold text-sm mb-2">AI Health Assistant</h4>
                            <p className="text-xs text-white/90 leading-tight mb-4 font-medium">Get personalized advice based on your hormonal trends.</p>
                            <button className="w-full bg-white text-[#FF0055] text-xs font-bold py-2 rounded shadow-sm hover:bg-gray-50">
                                Try Now
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-white">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};

export default RiskLayout;
