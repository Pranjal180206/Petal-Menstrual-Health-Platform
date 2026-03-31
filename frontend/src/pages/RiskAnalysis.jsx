import { useState, useCallback, useEffect } from 'react';
import { Calendar, Download, AlertCircle, Info, MessageSquare, Droplet, CalendarX, Frown, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Toast from '../components/Toast';
import axiosInstance from '../api/axiosInstance';

// Colors only — labels/messages come from i18n
const RISK_CONFIG = {
  low:     { color: 'green'  },
  moderate:{ color: 'yellow' },
  high:    { color: 'red'    },
  unknown: { color: 'gray'   },
};

const getIcon = (type, color) => {
    switch (type) {
        case 'calendar_x': return <CalendarX size={20} style={{ color }} />;
        case 'droplet': return <Droplet size={20} style={{ color }} />;
        case 'frown': return <Frown size={20} style={{ color }} />;
        case 'alert_circle':
        default: return <AlertCircle size={20} style={{ color }} />;
    }
};

const RiskAnalysis = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const DATE_FILTERS = [
        { label: t('riskAnalysis.dateFilters.lastMonth'),   value: 'Last Month' },
        { label: t('riskAnalysis.dateFilters.last3Months'), value: 'Last 3 Months' },
        { label: t('riskAnalysis.dateFilters.last6Months'), value: 'Last 6 Months' },
        { label: t('riskAnalysis.dateFilters.thisYear'),    value: 'This Year' },
    ];

    const [activePeriod, setActivePeriod] = useState('Last 6 Months');
    const [showAllFactors, setShowAllFactors] = useState(false);
    const [toast, setToast] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const PERIOD_TO_DAYS = {
        'Last Month': 30,
        'Last 3 Months': 90,
        'Last 6 Months': 180,
        'This Year': 365,
    };

    const fetchAnalysis = async (period) => {
        setIsLoading(true);
        try {
            const days = PERIOD_TO_DAYS[period] || 180;
            const res = await axiosInstance.get('/reports/risk-analysis', { params: { days } });
            setAnalysisResult(res.data);
        } catch (err) {
            console.error("Failed to load risk analysis:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis(activePeriod);
    }, []);

    const handleExportPDF = async () => {
        try {
            const res = await axiosInstance.get('/reports/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            
            const disposition = res.headers['content-disposition'];
            let fileName = 'petal_risk_report.pdf';
            if (disposition && disposition.indexOf('filename=') !== -1) {
                fileName = disposition.split('filename=')[1].replace(/"/g, '');
            }
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            showToast('Export downloaded successfully.', 'success');
        } catch (err) {
            console.error("Export failed:", err);
            showToast('Failed to export report.', 'error');
        }
    };

    const handleConsultSpecialist = () => {
        navigate('/community');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen border-t">
                <p className="text-gray-400 font-bold">{t('riskAnalysis.analyzingRisks')}</p>
            </div>
        );
    }

    if (!analysisResult || analysisResult.data_insufficient) {
        return (
            <div className="p-8 max-w-5xl mx-auto pb-24 relative flex flex-col">
                <div className="bg-gradient-to-r from-gray-500 to-gray-400 rounded-[1.5rem] p-6 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-md w-full">
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-[180px] font-extrabold italic pointer-events-none">!</div>
                    <div className="w-14 h-14 shrink-0 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10">
                        <AlertCircle size={28} fill="currentColor" className="text-gray-600" strokeWidth={1} />
                    </div>
                    <div className="flex-1 z-10">
                        <h2 className="text-xl font-heading font-extrabold mb-1">{t('riskAnalysis.analysisUnavailable')}</h2>
                        <p className="text-white/90 text-sm font-medium leading-relaxed max-w-2xl">
                            {t('riskAnalysis.notEnoughData')}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-10 shadow-sm flex flex-col items-center justify-center text-center py-16 w-full">
                    <h2 className="text-xl font-heading font-extrabold text-[#1D1D2C] mb-2">
                        {t('riskAnalysis.logMore')}
                    </h2>
                    <button
                        onClick={() => navigate('/cycle-tracker/tracker')}
                        className="mt-6 bg-[#FF0055] hover:bg-[#D80048] text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                    >
                        {t('riskAnalysis.goToTracker')}
                    </button>
                </div>
            </div>
        );
    }

    const { factors = [], cycle_consistency, symptom_intensity, average_cycle_length, cycles_logged, overall_risk, symptom_trend = [], cycle_comparison = [] } = analysisResult;
    const visibleFactors = showAllFactors ? factors : factors.slice(0, 3);

    const riskLevel = overall_risk || 'unknown';
    const displayKey = ["low", "moderate", "high"].includes(riskLevel) ? riskLevel : "unknown";
    
    const activeRisk = {
        ...( RISK_CONFIG[displayKey] || RISK_CONFIG.unknown ),
        label:   t(`riskAnalysis.risk.${displayKey}`),
        message: t(`riskAnalysis.risk.${displayKey}Msg`),
    };
    const getBannerStyles = (color) => {
        switch (color) {
            case 'green': return { bg: 'from-emerald-500 to-emerald-400', iconText: 'text-emerald-600', btnText: 'text-emerald-600' };
            case 'yellow': return { bg: 'from-amber-500 to-amber-400', iconText: 'text-amber-600', btnText: 'text-amber-600' };
            case 'gray': return { bg: 'from-gray-500 to-gray-400', iconText: 'text-gray-600', btnText: 'text-gray-600' };
            case 'red':
            default: return { bg: 'from-[#FF0055] to-[#FF4081]', iconText: 'text-[#FF0055]', btnText: 'text-[#FF0055]' };
        }
    };
    const bannerStyle = getBannerStyles(activeRisk.color);

    const generatePath = (data, key) => {
        if (!data || data.length === 0) return '';
        const maxVal = Math.max(...data.map(t => Math.max(t.cramps || 0, t.fatigue || 0, 1)));
        const pts = data.map((t, i) => {
            const x = (i / Math.max(data.length - 1, 1)) * 100;
            const y = 50 - ((t[key] || 0) / maxVal) * 50;
            return `${x},${y}`;
        });
        return `M${pts.join(' L')}`;
    };

    return (
        <div className="p-8 max-w-5xl mx-auto pb-24 relative">

            {/* Header Row */}
            <header className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-heading font-extrabold mb-1 text-[#1D1D2C]">{t('riskAnalysis.title')}</h1>
                    <p className="text-gray-500 font-medium text-sm">{t('riskAnalysis.showingData')} <strong>{DATE_FILTERS.find(f => f.value === activePeriod)?.label}</strong></p>
                </div>
                <div className="flex gap-3 flex-wrap justify-end">
                    {DATE_FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => {
                                setActivePeriod(f.value);
                                fetchAnalysis(f.value);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                activePeriod === f.value
                                    ? 'bg-[#D81B60] text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-[#1D1D2C] hover:bg-gray-50'
                            }`}
                        >
                            {activePeriod === f.value && <Calendar size={14} />}
                            {f.label}
                        </button>
                    ))}
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-[#FF0055] hover:bg-[#D80048] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
                    >
                        <Download size={14} />
                        {t('riskAnalysis.downloadPDF')}
                    </button>
                </div>
            </header>

            {/* Alert Banner */}
            <div className={`bg-gradient-to-r ${bannerStyle.bg} rounded-[1.5rem] p-6 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-md`}>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-[180px] font-extrabold italic pointer-events-none">!</div>

                <div className="w-14 h-14 shrink-0 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10">
                    <AlertCircle size={28} fill="currentColor" className={bannerStyle.iconText} strokeWidth={1} />
                </div>

                <div className="flex-1 z-10">
                    <h2 className="text-xl font-heading font-extrabold mb-1">{activeRisk.label}</h2>
                    <p className="text-white/90 text-sm font-medium leading-relaxed max-w-2xl">
                        {activeRisk.message}
                    </p>
                </div>

                <button
                    onClick={handleConsultSpecialist}
                    className={`hidden md:block bg-white ${bannerStyle.btnText} hover:bg-pink-50 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors z-10 whitespace-nowrap`}
                >
                    {t('riskAnalysis.consultSpecialist')}
                </button>
            </div>
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-gray-500 mb-1">{t('riskAnalysis.cycleConsistency')}</p>
                            <div className="flex justify-between items-end mb-3">
                                <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">{cycle_consistency ?? '—'}%</h3>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#FF0055] rounded-full" style={{ width: `${cycle_consistency ?? 0}%` }} />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-gray-500 mb-1">{t('riskAnalysis.symptomIntensity')}</p>
                            <div className="flex justify-between items-end mb-1">
                                <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C] capitalize">{symptom_intensity ?? '—'}</h3>
                            </div>
                            <p className="text-[10px] italic text-gray-400 font-medium">{t('riskAnalysis.basedOnData')}</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-gray-500 mb-1">{t('riskAnalysis.avgCycleLength')}</p>
                            <div className="flex justify-between items-end mb-3">
                                <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C]">{average_cycle_length ?? '—'} {t('cycleTracker.days')}</h3>
                                <span className="text-xs font-bold text-gray-400">{t('riskAnalysis.stable')}</span>
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
                        {(symptom_trend && symptom_trend.length > 0) && (
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
                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[90%] overflow-visible mt-auto transform translate-y-2">
                            <path d={generatePath(symptom_trend, 'cramps')} fill="none" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[80%] overflow-visible mt-auto transform translate-y-6">
                            <path d={generatePath(symptom_trend, 'fatigue')} fill="none" stroke="#FBCFE8" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" />
                        </svg>
                    </div>

                            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-2">
                                {symptom_trend.map((t, i) => <span key={i}>{t.week}</span>)}
                            </div>
                        </div>
                        )}

                        {/* Bar Chart */}
                        {(cycle_comparison && cycle_comparison.length > 0) && (
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
                            {cycle_comparison.map(row => {
                                const highlight = row.intensity?.toLowerCase() === 'heavy' || row.intensity?.toLowerCase() === 'high';
                                const color = highlight ? '#FF0055' : '#C62A47';
                                const days = `${row.length} Days`;
                                return (
                                <div key={row.label}>
                                    <div className={`flex justify-between text-[11px] font-bold mb-1.5 ${highlight ? 'text-[#1D1D2C]' : 'text-gray-500'}`}>
                                        <span>{row.label}</span>
                                        <span className={highlight ? 'text-[#FF0055]' : ''}>{days}</span>
                                    </div>
                                    <div className="h-6 w-full rounded-md flex overflow-hidden">
                                        <div className="h-full bg-pink-200" style={{ width: '20%' }} />
                                        <div className="h-full" style={{ width: '50%', backgroundColor: color }} />
                                        <div className="h-full bg-pink-200" style={{ width: '30%' }} />
                                    </div>
                                </div>
                                );
                            })}
                        </div>

                    <div className="mt-4 bg-[#FFFBF0] rounded-lg p-3 flex gap-3 items-start border border-yellow-100">
                        <Info size={16} fill="#F59E0B" className="shrink-0 text-white mt-0.5" />
                        <p className="text-[11px] font-medium text-gray-600 leading-tight">
                            More data will help us analyze intensity deviations.
                        </p>
                    </div>
                </div>
                )}
            </div>

            {/* Risk Factors List */}
            <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-[#1D1D2C] mb-6">{t('riskAnalysis.specificRiskFactors')}</h3>

                <div className="space-y-0 text-sm font-medium">
                    {visibleFactors.map((factor, i) => (
                        <div
                            key={factor.title}
                            className={`flex items-start gap-4 py-4 ${i < visibleFactors.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: factor.bg_color }}>
                                {getIcon(factor.icon_type, factor.badge_color)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-[#1D1D2C]">{factor.title}</h4>
                                    <span
                                        className="text-[9px] font-extrabold tracking-widest px-2 py-1 rounded uppercase"
                                        style={{ background: factor.badge_bg, color: factor.badge_color }}
                                    >
                                        {factor.badge_text}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs">{factor.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setShowAllFactors(v => !v)}
                    className="w-full mt-2 py-3 text-xs font-bold text-[#FF0055] hover:bg-pink-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {showAllFactors ? (
                        <><ChevronUp size={14} /> {t('riskAnalysis.showLess')}</>
                    ) : (
                        <><ChevronDown size={14} /> {t('riskAnalysis.viewAllFactors')} ({factors?.length ?? 0})</>
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
