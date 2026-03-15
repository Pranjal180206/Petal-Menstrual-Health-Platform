import { Calendar, Download, AlertCircle, Info, MessageSquare, Droplet, CalendarX, Frown } from 'lucide-react';

const RiskAnalysis = () => {
    return (
        <div className="p-8 max-w-5xl mx-auto pb-24 relative">

            {/* Header Row */}
            <header className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-heading font-extrabold mb-1 text-[#1D1D2C]">Risk Analysis Overview</h1>
                    <p className="text-gray-500 font-medium text-sm">Showing data for the last 6 cycles (Jan - June 2024)</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#1D1D2C] px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors">
                        <Calendar size={14} />
                        Last 6 Months
                    </button>
                    <button className="flex items-center gap-2 bg-[#FF0055] hover:bg-[#D80048] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors">
                        <Download size={14} />
                        Export PDF
                    </button>
                </div>
            </header>

            {/* Alert Banner */}
            <div className="bg-gradient-to-r from-[#FF0055] to-[#FF4081] rounded-[1.5rem] p-6 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-md">
                {/* Background decorative exclamation mark */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-[180px] font-extrabold italic pointer-events-none">
                    !
                </div>

                <div className="w-14 h-14 shrink-0 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10">
                    <AlertCircle size={28} fill="currentColor" className="text-[#FF0055]" strokeWidth={1} />
                </div>

                <div className="flex-1 z-10">
                    <h2 className="text-xl font-heading font-extrabold mb-1">Elevated Risk Detected</h2>
                    <p className="text-white/90 text-sm font-medium leading-relaxed max-w-2xl">
                        Based on your last 3 cycles, we've detected some irregularities in intensity and duration that may require medical attention. Please review the detailed factors below.
                    </p>
                </div>

                <button className="hidden md:block bg-white text-[#FF0055] hover:bg-pink-50 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors z-10 whitespace-nowrap">
                    Consult a Specialist
                </button>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 mb-1">Cycle Consistency</p>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">78%</h3>
                        <span className="text-xs font-bold text-[#FF0055]">~5%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF0055] w-[78%] rounded-full"></div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 mb-1">Symptom Intensity</p>
                    <div className="flex justify-between items-end mb-1">
                        <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">Moderate</h3>
                        <span className="text-xs font-bold text-green-500">↗12%</span>
                    </div>
                    <p className="text-[10px] italic text-gray-400 font-medium">Higher intensity logged this month</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 mb-1">Avg. Cycle Length</p>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">31 Days</h3>
                        <span className="text-xs font-bold text-gray-400">– Stable</span>
                    </div>
                    {/* Mini chart visual representation */}
                    <div className="flex gap-1 h-1.5 items-end">
                        <div className="flex-1 bg-pink-200 rounded-full h-full"></div>
                        <div className="flex-1 bg-pink-300 rounded-full h-full"></div>
                        <div className="flex-1 bg-pink-300 rounded-full h-[80%]"></div>
                        <div className="flex-1 bg-[#FF0055] rounded-full h-full"></div>
                        <div className="flex-1 bg-pink-100 rounded-full h-full"></div>
                    </div>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Line Chart */}
                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm flex flex-col h-80">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">Symptom Intensity Trends</h3>
                            <p className="text-xs text-gray-400 font-medium">Tracking daily severity across 30 days</p>
                        </div>
                        <div className="flex gap-3 text-[9px] font-extrabold tracking-widest uppercase text-gray-500">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF0055]"></div> Cramps</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-200"></div> Fatigue</span>
                        </div>
                    </div>

                    <div className="flex-1 relative border-l border-b border-gray-100 pb-2">
                        {/* Horizontal Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pt-4">
                            <div className="border-b border-gray-50 w-full"></div>
                            <div className="border-b border-gray-50 w-full"></div>
                            <div className="border-b border-gray-50 w-full"></div>
                            <div className="border-b border-gray-50 w-full"></div>
                        </div>

                        {/* Mockup Line 1 (Solid) */}
                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-[90%] overflow-visible mt-auto transform translate-y-2">
                            <path d="M0,40 Q10,35 20,25 T40,20 Q45,22 50,15 T65,8 Q70,10 80,4 T100,0" fill="none" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                        {/* Mockup Line 2 (Dashed) */}
                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-[80%] overflow-visible mt-auto transform translate-y-6">
                            <path d="M0,35 Q15,30 30,32 T50,25 Q65,28 75,20 T100,10" fill="none" stroke="#FBCFE8" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-2">
                        <span>WK 01</span>
                        <span>WK 02</span>
                        <span>WK 03</span>
                        <span>WK 04</span>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm flex flex-col h-80">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">Hormonal Variation</h3>
                            <p className="text-xs text-gray-400 font-medium">Correlation between cycles</p>
                        </div>
                        <button className="text-[10px] font-extrabold tracking-widest text-[#FF0055] uppercase hover:underline">
                            View Legend
                        </button>
                    </div>

                    <div className="flex-1 space-y-5">
                        {/* Bar 1 */}
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1.5">
                                <span>Cycle 01 (Average)</span>
                                <span>28 Days</span>
                            </div>
                            <div className="h-6 w-full rounded-md flex overflow-hidden">
                                <div className="h-full bg-pink-200 w-[20%]"></div>
                                <div className="h-full bg-pink-400 w-[50%]"></div>
                                <div className="h-full bg-pink-200 w-[30%]"></div>
                            </div>
                        </div>

                        {/* Bar 2 */}
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-[#1D1D2C] mb-1.5">
                                <span>Cycle 02 (High Intensity)</span>
                                <span className="text-[#FF0055]">31 Days</span>
                            </div>
                            <div className="h-6 w-full rounded-md flex overflow-hidden">
                                <div className="h-full bg-pink-300 w-[15%]"></div>
                                <div className="h-full bg-[#E91E63] w-[75%]"></div>
                                <div className="h-full bg-pink-300 w-[10%]"></div>
                            </div>
                        </div>

                        {/* Bar 3 */}
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1.5">
                                <span>Cycle 03 (Recent)</span>
                                <span>29 Days</span>
                            </div>
                            <div className="h-6 w-[95%] rounded-md flex overflow-hidden">
                                <div className="h-full bg-[#E5E5EA] w-[25%]"></div>
                                <div className="h-full bg-pink-400 w-[30%]"></div>
                                <div className="h-full bg-[#E5E5EA] w-[45%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-[#FFFBF0] rounded-lg p-3 flex gap-3 items-start border border-yellow-100">
                        <Info size={16} fill="#F59E0B" className="shrink-0 text-white mt-0.5" />
                        <p className="text-[11px] font-medium text-gray-600 leading-tight">
                            Cycle 02 shows significant deviation in length and symptom intensity.
                        </p>
                    </div>
                </div>

            </div>

            {/* Specific Risk Factors List */}
            <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-[#1D1D2C] mb-6">Specific Risk Factors</h3>

                <div className="space-y-0 text-sm font-medium">

                    {/* Factor 1 */}
                    <div className="flex items-start gap-4 py-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center shrink-0">
                            <CalendarX size={20} className="text-[#FF0055]" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-[#1D1D2C]">Irregular Cycle Length</h4>
                                <span className="bg-[#FFF0F4] text-[#FF0055] text-[9px] font-extrabold tracking-widest px-2 py-1 rounded uppercase">High Priority</span>
                            </div>
                            <p className="text-gray-500 text-xs">Variance of {'>'}4 days across consecutive cycles. This may indicate hormonal imbalance.</p>
                        </div>
                    </div>

                    {/* Factor 2 */}
                    <div className="flex items-start gap-4 py-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF7E6] flex items-center justify-center shrink-0">
                            <Droplet size={20} className="text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-[#1D1D2C]">Flow Intensity Increase</h4>
                                <span className="bg-[#FFF7E6] text-orange-600 text-[9px] font-extrabold tracking-widest px-2 py-1 rounded uppercase">Moderate</span>
                            </div>
                            <p className="text-gray-500 text-xs">Self-reported "Heavy" flow has increased from 2 days to 5 days over the last 3 months.</p>
                        </div>
                    </div>

                    {/* Factor 3 */}
                    <div className="flex items-start gap-4 py-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center shrink-0">
                            <Frown size={20} className="text-[#FF0055]" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-[#1D1D2C]">Persistent PMDD Symptoms</h4>
                                <span className="bg-[#FFF0F4] text-[#FF0055] text-[9px] font-extrabold tracking-widest px-2 py-1 rounded uppercase">Follow-up</span>
                            </div>
                            <p className="text-gray-500 text-xs">Severe mood shifts logged consistently 7 days prior to onset for 6 consecutive cycles.</p>
                        </div>
                    </div>
                </div>

                <button className="w-full mt-2 py-3 text-xs font-bold text-[#FF0055] hover:bg-pink-50 rounded-lg transition-colors">
                    View All Risk Factors (12)
                </button>
            </div>

            {/* Floating Action Button (Chat) */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF0055] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#D80048] hover:scale-105 transition-all z-50">
                <MessageSquare size={24} />
            </button>

        </div>
    );
};

export default RiskAnalysis;
