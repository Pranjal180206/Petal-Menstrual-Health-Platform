import { Search, Bell, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Hourglass } from 'lucide-react';

const CycleTracker = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8">

            {/* Left Column (Calendar & Cycle Stats) */}
            <div className="flex-1 space-y-6">

                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-heading font-extrabold">Cycle & Symptom Tracker</h1>
                </header>

                {/* Calendar Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-heading font-extrabold flex items-center gap-2">
                            October 2023
                            <span className="text-gray-400 rotate-90 inline-block text-xs ml-1">›</span>
                        </h2>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid Header */}
                    <div className="grid grid-cols-7 gap-2 mb-6 text-center text-[10px] font-bold text-[#D81B60] tracking-widest uppercase">
                        <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                    </div>

                    {/* Calendar Grid (Hardcoded Mockup for October 2023 View) */}
                    <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center text-sm font-bold text-[#1D1D2C]">

                        {/* Week 1 */}
                        <div></div><div></div><div></div>
                        <div className="flex flex-col items-center justify-center gap-1 relative">
                            <span>1</span>
                            <div className="w-1 h-1 rounded-full bg-gray-300 absolute -bottom-3"></div>
                        </div>
                        <div className="flex items-center justify-center">2</div>
                        <div className="flex items-center justify-center">3</div>
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center shadow-md">4</div>
                        </div>

                        {/* Week 2 */}
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center shadow-md">5</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center shadow-md">6</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center shadow-md">7</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center shadow-md">8</div>
                        </div>
                        <div className="flex items-center justify-center">9</div>
                        <div className="flex flex-col items-center justify-center gap-1 relative">
                            <span>10</span>
                            <div className="w-1 h-1 rounded-full bg-gray-300 absolute -bottom-3"></div>
                        </div>
                        <div className="flex flex-col items-center justify-center relative">
                            <div className="w-12 h-12 rounded-[14px] border-2 border-[#F48FB1] bg-[#FFF0F4] text-[#D81B60] flex flex-col items-center justify-center absolute -top-1">
                                <span className="leading-tight">11</span>
                                <span className="text-[7px] font-extrabold tracking-widest uppercase opacity-80">Today</span>
                            </div>
                        </div>

                        {/* Week 3 */}
                        <div className="flex items-center justify-center pt-2">12</div>
                        <div className="flex items-center justify-center pt-2">13</div>
                        <div className="flex items-center justify-center pt-2">14</div>
                        <div className="flex items-center justify-center pt-2">15</div>
                        <div className="flex items-center justify-center pt-2">
                            <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#F48FB1] flex items-center justify-center text-[#F48FB1]">16</div>
                        </div>
                        <div className="flex items-center justify-center pt-2">
                            <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#F48FB1] flex items-center justify-center text-[#F48FB1]">17</div>
                        </div>
                        <div className="flex items-center justify-center pt-2">
                            <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#F48FB1] flex items-center justify-center text-[#F48FB1]">18</div>
                        </div>
                    </div>

                    <p className="text-[10px] font-bold italic text-[#F48FB1] mt-8 mb-6">Predicted period: Oct 31 - Nov 4</p>

                    <div className="flex items-center gap-6 border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#D81B60]"></div>
                            <span className="text-xs font-bold text-[#1D1D2C]">Period</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-dashed border-[#F48FB1]"></div>
                            <span className="text-xs font-bold text-[#1D1D2C]">Predicted Period</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-1"></div>
                            <span className="text-xs font-bold text-[#1D1D2C]">Logged Symptoms</span>
                        </div>
                    </div>
                </div>

                {/* Small Stats Cards */}
                <div className="flex gap-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-card border border-gray-100 flex-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#D81B60] flex items-center justify-center">
                            <CalendarIcon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#D81B60] tracking-wider mb-0.5">Cycle Day</p>
                            <h3 className="text-xl font-heading font-extrabold text-[#1D1D2C]">8 of 28</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-card border border-gray-100 flex-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FAFAFA] text-gray-400 flex items-center justify-center">
                            <Hourglass size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#D81B60] tracking-wider mb-0.5">Next Period</p>
                            <h3 className="text-xl font-heading font-extrabold text-[#1D1D2C]">20 days</h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column (Daily Log Panel) */}
            <div className="w-[420px] bg-white rounded-[2rem] shadow-card border border-gray-100 p-8 flex flex-col h-full sticky top-8">

                {/* Top Header Row within Right Panel */}
                <div className="flex justify-between items-center mb-8 absolute -top-16 right-0 left-0 px-2 lg:hidden">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search insights..."
                            className="bg-white border border-gray-100 rounded-full pl-10 pr-4 py-2 text-sm font-medium w-64 outline-none focus:border-[#D81B60] shadow-sm"
                        />
                    </div>
                    <button className="relative text-gray-400">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[#D81B60] rounded-full border border-white"></span>
                    </button>
                </div>

                {/* Real Header for Desktop Right Align */}
                <div className="hidden lg:flex justify-end items-center mb-8 gap-6 absolute -top-16 right-0 w-[500px]">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search insights..."
                            className="w-full bg-white border border-gray-100 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors shadow-sm"
                        />
                    </div>
                    <button className="relative text-[#1D1D2C]">
                        <Bell size={20} fill="currentColor" className="text-gray-300" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[#1D1D2C] rounded-full border border-white"></span>
                    </button>
                </div>

                <div className="flex justify-between items-center mb-8 mt-2">
                    <h2 className="text-xl font-heading font-extrabold">Daily Log</h2>
                    <span className="bg-gray-100 text-[#1D1D2C] text-xs font-bold px-3 py-1.5 rounded-md">Oct 11, 2023</span>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">

                    {/* Flow Intensity */}
                    <div>
                        <h4 className="text-xs font-bold text-[#D81B60] tracking-widest uppercase mb-4">Flow Intensity</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-500 hover:border-gray-300 transition-colors">Spotting</button>
                            <button className="border-2 border-[#D81B60] bg-[#FFF0F4] rounded-xl py-3 text-sm font-bold text-[#D81B60] transition-colors shadow-sm">Light</button>
                            <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-500 hover:border-gray-300 transition-colors">Medium</button>
                            <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-500 hover:border-gray-300 transition-colors">Heavy</button>
                            <button className="border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-500 hover:border-gray-300 transition-colors col-span-2">None</button>
                        </div>
                    </div>

                    {/* Physical Symptoms */}
                    <div>
                        <h4 className="text-xs font-bold text-[#D81B60] tracking-widest uppercase mb-4">Physical</h4>
                        <div className="flex flex-wrap gap-3">
                            <button className="border-2 border-[#D81B60] text-[#D81B60] rounded-full px-4 py-2 text-sm font-bold shadow-sm">Cramps</button>
                            <button className="border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm font-bold hover:border-gray-300 transition-colors">Headache</button>
                            <button className="border-2 border-[#D81B60] text-[#D81B60] rounded-full px-4 py-2 text-sm font-bold shadow-sm">Bloating</button>
                            <button className="border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm font-bold hover:border-gray-300 transition-colors">Breast Tenderness</button>
                            <button className="border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm font-bold hover:border-gray-300 transition-colors">Backache</button>
                            <button className="border-2 border-[#D81B60] text-[#D81B60] rounded-full px-4 py-2 text-sm font-bold shadow-sm">Acne</button>
                        </div>
                    </div>

                    {/* Mood */}
                    <div>
                        <h4 className="text-xs font-bold text-[#D81B60] tracking-widest uppercase mb-4">Mood</h4>
                        <div className="flex flex-wrap gap-3">
                            <button className="border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm font-bold hover:border-gray-300 transition-colors flex items-center gap-2">
                                <span>🙂</span> Calm
                            </button>
                            <button className="border-2 border-[#D81B60] text-[#D81B60] rounded-full px-4 py-2 text-sm font-bold shadow-sm flex items-center gap-2">
                                <span>😫</span> Tired
                            </button>
                            <button className="border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm font-bold hover:border-gray-300 transition-colors flex items-center gap-2">
                                <span>😠</span> Irritable
                            </button>
                            <button className="border border-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm font-bold hover:border-gray-300 transition-colors flex items-center gap-2">
                                <span>😟</span> Anxious
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h4 className="text-xs font-bold text-[#8C8C8C] tracking-widest uppercase mb-4">Notes</h4>
                        <textarea
                            placeholder="How are you feeling today?"
                            className="w-full bg-[#FAFAFA] border border-transparent focus:border-gray-200 rounded-2xl p-5 text-sm font-medium resize-none h-32 outline-none placeholder:text-gray-400"
                        />
                    </div>

                </div>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                    <button className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white rounded-2xl py-4 font-bold text-lg transition-colors shadow-soft flex justify-center items-center gap-2 mb-3">
                        <CalendarIcon size={20} /> Save Daily Log
                    </button>
                    <p className="text-[9px] text-gray-400 font-bold text-center leading-tight mx-4">
                        Information logged is used for personalized health risk insights.
                    </p>
                </div>

            </div>

        </div>
    );
};

export default CycleTracker;
