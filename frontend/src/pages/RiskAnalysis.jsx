import { useState, useCallback } from 'react';
import { Calendar, Download, AlertCircle, Info, MessageSquare, Droplet, CalendarX, Frown, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const DATE_FILTERS = ['Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year'];

const ALL_RISK_FACTORS = [
    {
        icon: <CalendarX size={20} className="text-[#FF0055]" />,
        bg: '#FFF0F4',
        title: 'Irregular Cycle Length',
        badge: 'High Priority',
        badgeBg: '#FFF0F4',
        badgeColor: '#FF0055',
        desc: 'Variance of >4 days across consecutive cycles. This may indicate hormonal imbalance.',
    },
    {
        icon: <Droplet size={20} className="text-orange-500" />,
        bg: '#FFF7E6',
        title: 'Flow Intensity Increase',
        badge: 'Moderate',
        badgeBg: '#FFF7E6',
        badgeColor: '#EA580C',
        desc: 'Self-reported "Heavy" flow has increased from 2 days to 5 days over the last 3 months.',
    },
    {
        icon: <Frown size={20} className="text-[#FF0055]" />,
        bg: '#FFF0F4',
        title: 'Persistent PMDD Symptoms',
        badge: 'Follow-up',
        badgeBg: '#FFF0F4',
        badgeColor: '#FF0055',
        desc: 'Severe mood shifts logged consistently 7 days prior to onset for 6 consecutive cycles.',
    },
    {
        icon: <AlertCircle size={20} className="text-amber-500" />,
        bg: '#FFFBF0',
        title: 'Late Ovulation Window',
        badge: 'Monitor',
        badgeBg: '#FFFBF0',
        badgeColor: '#D97706',
        desc: 'Ovulation has been detected 2-3 days later than expected in 4 of 6 recent cycles.',
    },
    {
        icon: <Droplet size={20} className="text-purple-500" />,
        bg: '#F3E8FF',
        title: 'Spotting Between Cycles',
        badge: 'Low',
        badgeBg: '#F3E8FF',
        badgeColor: '#7C3AED',
        desc: 'Occasional spotting logged on Day 19-21 in 3 recent cycles. Worth monitoring.',
    },
];

const RiskAnalysis = () => {
    const navigate = useNavigate();
    const [activePeriod, setActivePeriod] = useState('Last 6 Months');
    const [showAllFactors, setShowAllFactors] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const handleExportPDF = () => {
        showToast('PDF export ready — backend integration pending.', 'info');
        // TODO: POST /api/reports/export when backend is connected
    };

    const handleConsultSpecialist = () => {
        navigate('/community');
    };

    const visibleFactors = showAllFactors ? ALL_RISK_FACTORS : ALL_RISK_FACTORS.slice(0, 3);

    return (
        <div className="p-8 max-w-5xl mx-auto pb-24 relative">

            {/* Header Row */}
            <header className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-heading font-extrabold mb-1 text-[#1D1D2C]">Risk Analysis Overview</h1>
                    <p className="text-gray-500 font-medium text-sm">Showing data for: <strong>{activePeriod}</strong></p>
                </div>
                <div className="flex gap-3 flex-wrap justify-end">
                    {DATE_FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActivePeriod(f)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                activePeriod === f
                                    ? 'bg-[#D81B60] text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-[#1D1D2C] hover:bg-gray-50'
                            }`}
                        >
                            {f === activePeriod && <Calendar size={14} />}
                            {f}
                        </button>
                    ))}
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-[#FF0055] hover:bg-[#D80048] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
                    >
                        <Download size={14} />
                        Export PDF
                    </button>
                </div>
            </header>

            {/* Alert Banner */}
            <div className="bg-gradient-to-r from-[#FF0055] to-[#FF4081] rounded-[1.5rem] p-6 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-md">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-[180px] font-extrabold italic pointer-events-none">!</div>

                <div className="w-14 h-14 shrink-0 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10">
                    <AlertCircle size={28} fill="currentColor" className="text-[#FF0055]" strokeWidth={1} />
                </div>

                <div className="flex-1 z-10">
                    <h2 className="text-xl font-heading font-extrabold mb-1">Elevated Risk Detected</h2>
                    <p className="text-white/90 text-sm font-medium leading-relaxed max-w-2xl">
                        Based on your last 3 cycles, we've detected irregularities in intensity and duration. Please review the detailed factors below or consult a specialist.
                    </p>
                </div>

                <button
                    onClick={handleConsultSpecialist}
                    className="hidden md:block bg-white text-[#FF0055] hover:bg-pink-50 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors z-10 whitespace-nowrap"
                >
                    Consult a Specialist →
                </button>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-500 mb-1">Cycle Consistency</p>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">78%</h3>
                        <span className="text-xs font-bold text-[#FF0055]">↓5% this cycle</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF0055] rounded-full" style={{ width: '78%' }} />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-500 mb-1">Symptom Intensity</p>
                    <div className="flex justify-between items-end mb-1">
                        <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">Moderate</h3>
                        <span className="text-xs font-bold text-green-500">↗12%</span>
                    </div>
                    <p className="text-[10px] italic text-gray-400 font-medium">Higher intensity logged this month</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-gray-500 mb-1">Avg. Cycle Length</p>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">31 Days</h3>
                        <span className="text-xs font-bold text-gray-400">– Stable</span>
                    </div>
                    <div className="flex gap-1 h-1.5 items-end">
                        {[100, 80, 80, 100, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-pink-300 rounded-full" style={{ height: `${h}%`, background: i === 3 ? '#FF0055' : undefined }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Line Chart */}
                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm flex flex-col h-80">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">Symptom Intensity Trends</h3>
                            <p className="text-xs text-gray-400 font-medium">Tracking daily severity across 30 days</p>
                        </div>
                        <div className="flex gap-3 text-[9px] font-extrabold tracking-widest uppercase text-gray-500">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF0055]" /> Cramps</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-200" /> Fatigue</span>
                        </div>
                    </div>

                    <div className="flex-1 relative border-l border-b border-gray-100 pb-2">
                        <div className="absolute inset-0 flex flex-col justify-between pt-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="border-b border-gray-50 w-full" />)}
                        </div>
                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-[90%] overflow-visible mt-auto transform translate-y-2">
                            <path d="M0,40 Q10,35 20,25 T40,20 Q45,22 50,15 T65,8 Q70,10 80,4 T100,0" fill="none" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-[80%] overflow-visible mt-auto transform translate-y-6">
                            <path d="M0,35 Q15,30 30,32 T50,25 Q65,28 75,20 T100,10" fill="none" stroke="#FBCFE8" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-2">
                        <span>WK 01</span><span>WK 02</span><span>WK 03</span><span>WK 04</span>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm flex flex-col h-80">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">Hormonal Variation</h3>
                            <p className="text-xs text-gray-400 font-medium">Correlation between cycles</p>
                        </div>
                        <button
                            onClick={() => showToast('Legend: Pink = Follicular, Hot pink = Luteal, Light = Period', 'info')}
                            className="text-[10px] font-extrabold tracking-widest text-[#FF0055] uppercase hover:underline"
                        >
                            View Legend
                        </button>
                    </div>

                    <div className="flex-1 space-y-5">
                        {[
                            { label: 'Cycle 01 (Average)', days: '28 Days', color: '#C62A47', bars: ['20%', '50%', '30%'] },
                            { label: 'Cycle 02 (High Intensity)', days: '31 Days', color: '#FF0055', bars: ['15%', '75%', '10%'], highlight: true },
                            { label: 'Cycle 03 (Recent)', days: '29 Days', color: '#C62A47', bars: ['25%', '30%', '45%'] },
                        ].map(row => (
                            <div key={row.label}>
                                <div className={`flex justify-between text-[11px] font-bold mb-1.5 ${row.highlight ? 'text-[#1D1D2C]' : 'text-gray-500'}`}>
                                    <span>{row.label}</span>
                                    <span className={row.highlight ? 'text-[#FF0055]' : ''}>{row.days}</span>
                                </div>
                                <div className="h-6 w-full rounded-md flex overflow-hidden">
                                    <div className="h-full bg-pink-200" style={{ width: row.bars[0] }} />
                                    <div className="h-full" style={{ width: row.bars[1], backgroundColor: row.color }} />
                                    <div className="h-full bg-pink-200" style={{ width: row.bars[2] }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 bg-[#FFFBF0] rounded-lg p-3 flex gap-3 items-start border border-yellow-100">
                        <Info size={16} fill="#F59E0B" className="shrink-0 text-white mt-0.5" />
                        <p className="text-[11px] font-medium text-gray-600 leading-tight">
                            Cycle 02 shows significant deviation in length and symptom intensity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Risk Factors List */}
            <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-[#1D1D2C] mb-6">Specific Risk Factors</h3>

                <div className="space-y-0 text-sm font-medium">
                    {visibleFactors.map((factor, i) => (
                        <div
                            key={factor.title}
                            className={`flex items-start gap-4 py-4 ${i < visibleFactors.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: factor.bg }}>
                                {factor.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-[#1D1D2C]">{factor.title}</h4>
                                    <span
                                        className="text-[9px] font-extrabold tracking-widest px-2 py-1 rounded uppercase"
                                        style={{ background: factor.badgeBg, color: factor.badgeColor }}
                                    >
                                        {factor.badge}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs">{factor.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setShowAllFactors(v => !v)}
                    className="w-full mt-2 py-3 text-xs font-bold text-[#FF0055] hover:bg-pink-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {showAllFactors ? (
                        <><ChevronUp size={14} /> Show Less</>
                    ) : (
                        <><ChevronDown size={14} /> View All Risk Factors ({ALL_RISK_FACTORS.length})</>
                    )}
                </button>
            </div>

            {/* Floating Chat Button */}
            <button
                onClick={() => navigate('/community')}
                className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF0055] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#D80048] hover:scale-105 transition-all z-50"
                title="Chat with a specialist"
            >
                <MessageSquare size={24} />
            </button>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default RiskAnalysis;
