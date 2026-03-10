import { Search, Bell, Info, Lightbulb, TrendingDown } from 'lucide-react';

const DashboardOverview = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">

            {/* Top Header Row */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-heading font-extrabold mb-1">Hello, Alex</h1>
                    <p className="text-gray-500 font-medium text-sm">Tuesday, October 24th — Your daily health summary</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search analytics..."
                            className="bg-white border border-gray-100 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium w-64 outline-none focus:border-[#D81B60] transition-colors shadow-sm"
                        />
                    </div>
                    <button className="relative text-gray-400 hover:text-[#1D1D2C] transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[#D81B60] rounded-full border border-white"></span>
                    </button>
                    <img src="https://i.pravatar.cc/100?img=5" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                </div>
            </header>

            {/* Grid Layout for Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Risk Summary Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-heading font-bold text-lg">Risk Summary</h3>
                        <Info size={16} className="text-gray-400" />
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                        {/* Donut Chart Mockup */}
                        <div className="relative w-40 h-40 mb-6">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FCE4EC" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#D81B60" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="190" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-heading font-extrabold text-3xl">24%</span>
                                <span className="text-[10px] font-bold text-[#D81B60] tracking-wider uppercase">Low Risk</span>
                            </div>
                        </div>

                        <p className="text-sm text-[#4A4A5C] text-center font-medium leading-relaxed mb-6">
                            Your hormonal patterns are currently stable. We haven't detected any significant risk deviations.
                        </p>
                    </div>

                    <button className="w-full bg-[#FFF0F4] hover:bg-pink-100 text-[#D81B60] font-bold text-sm py-3 rounded-xl transition-colors">
                        View Detailed Report
                    </button>
                </div>

                {/* Cycle Status Panel (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-10">
                        <h3 className="font-heading font-bold text-lg">Cycle Status</h3>
                        <span className="bg-[#FFF0F4] text-[#D81B60] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Follicular Phase
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-4xl font-heading font-extrabold mb-1">Day 14</h2>
                                <p className="text-sm text-gray-500 font-medium">7 days until Luteal Phase</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#D81B60]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#F48FB1]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#FCE4EC]"></div>
                            </div>
                        </div>

                        {/* Gradient Bar Mockup */}
                        <div className="w-full h-12 rounded-full overflow-hidden bg-gradient-to-r from-gray-100 via-[#FFF0F4] to-[#FCE4EC] relative mb-3">
                            <div className="absolute left-1/4 top-0 bottom-0 w-1/3 bg-gradient-to-r from-[#F48FB1] via-[#D81B60] to-[#F48FB1] blur-md opacity-50"></div>
                            <div className="absolute left-1/4 top-0 bottom-0 w-1/3 bg-gradient-to-r from-[#F48FB1] to-[#D81B60]"></div>
                        </div>

                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                            <span>Period Start</span>
                            <span className="text-[#D81B60]">Ovulation Window</span>
                            <span>Next Period</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* How are you feeling today (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-card border border-gray-100">
                    <h3 className="font-heading font-bold text-lg mb-8">How are you feeling today?</h3>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-full bg-[#F8F9FA] hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition-all">
                                <span className="text-xl">🙂</span>
                            </button>
                            <span className="text-xs font-bold text-gray-500">Fine</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-full bg-[#F8F9FA] hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition-all">
                                <span className="text-xl">💧</span>
                            </button>
                            <span className="text-xs font-bold text-gray-500">Bloated</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-full bg-[#F8F9FA] hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition-all">
                                <span className="text-xl">⚡</span>
                            </button>
                            <span className="text-xs font-bold text-gray-500">Cramps</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-full bg-[#F8F9FA] hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition-all">
                                <span className="text-xl">🛏️</span>
                            </button>
                            <span className="text-xs font-bold text-gray-500">Fatigue</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-full bg-[#F8F9FA] hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition-all">
                                <span className="text-xl">😞</span>
                            </button>
                            <span className="text-xs font-bold text-gray-500">Mood</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-full bg-[#F8F9FA] hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition-all">
                                <span className="text-xl">🤕</span>
                            </button>
                            <span className="text-xs font-bold text-gray-500">Headache</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-full bg-transparent border-2 border-dashed border-gray-200 hover:border-gray-300 text-gray-300 hover:text-gray-400 flex items-center justify-center transition-all">
                                <span className="text-xl font-light">+</span>
                            </button>
                            <span className="text-xs font-bold text-gray-400">More</span>
                        </div>
                    </div>
                </div>

                {/* Daily Insight Card */}
                <div className="bg-[#D81B60] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-soft">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-bl-full pointer-events-none"></div>

                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-widest uppercase mb-6">
                        <Lightbulb size={16} /> Daily Insight
                    </div>

                    <h3 className="font-heading font-bold text-2xl leading-snug mb-4">
                        Hydration and Follicular Health
                    </h3>

                    <p className="text-white/90 text-sm leading-relaxed mb-8 font-medium">
                        Staying hydrated during your follicular phase helps maintain optimal cervical fluid consistency. Aim for an extra glass of water today.
                    </p>

                    <button className="bg-white text-[#D81B60] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-pink-50 transition-colors shadow-sm inline-block">
                        Learn more
                    </button>
                </div>

            </div>

        </div>
    );
};

export default DashboardOverview;
