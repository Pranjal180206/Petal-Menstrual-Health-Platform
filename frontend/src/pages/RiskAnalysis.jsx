import { useState, useCallback, useEffect } from 'react';
import { Calendar, Download, AlertCircle, Info, MessageSquare, Droplet, CalendarX, Frown, ChevronDown, ChevronUp, HelpCircle, Sparkles, Heart, CheckCircle, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Toast from '../components/Toast';
import axiosInstance from '../api/axiosInstance';

// Child-friendly emoji mapping for risk levels
const RISK_EMOJI = {
    low: '🌟',
    moderate: '👀',
    high: '⚠️',
    unknown: '📝'
};

// Colors and emojis
const RISK_CONFIG = {
  low:     { color: 'green', emoji: '🌟', bgGradient: 'from-emerald-500 to-emerald-400' },
  moderate:{ color: 'yellow', emoji: '👀', bgGradient: 'from-amber-500 to-amber-400' },
  high:    { color: 'red', emoji: '⚠️', bgGradient: 'from-[#FF0055] to-[#FF4081]' },
  unknown: { color: 'gray', emoji: '📝', bgGradient: 'from-gray-500 to-gray-400' },
};

// Child-friendly explanation card
const ExplainCard = ({ text, className = "" }) => (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mt-3 border border-blue-100 ${className}`}>
        <div className="flex items-start gap-2">
            <HelpCircle className="text-blue-400 shrink-0 mt-0.5" size={14} />
            <p className="text-xs text-gray-600 font-medium leading-relaxed">{text}</p>
        </div>
    </div>
);

// Tips card based on risk level
const TipsCard = ({ riskLevel, t }) => {
    const tips = {
        low: { emoji: '💪', title: t('riskAnalysis.whatToDo.lowTitle'), text: t('riskAnalysis.whatToDo.lowTips'), bg: 'bg-emerald-50', border: 'border-emerald-200', text_color: 'text-emerald-700' },
        moderate: { emoji: '📋', title: t('riskAnalysis.whatToDo.moderateTitle'), text: t('riskAnalysis.whatToDo.moderateTips'), bg: 'bg-amber-50', border: 'border-amber-200', text_color: 'text-amber-700' },
        high: { emoji: '💬', title: t('riskAnalysis.whatToDo.highTitle'), text: t('riskAnalysis.whatToDo.highTips'), bg: 'bg-pink-50', border: 'border-pink-200', text_color: 'text-pink-700' }
    };
    
    const tip = tips[riskLevel] || tips.moderate;
    
    return (
        <div className={`${tip.bg} ${tip.border} border rounded-2xl p-5 mt-6`}>
            <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.emoji}</span>
                <div>
                    <h4 className={`font-bold ${tip.text_color} mb-1`}>{tip.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.text}</p>
                </div>
            </div>
        </div>
    );
};

const getIcon = (type, color) => {
    switch (type?.toLowerCase()) {
        case 'calendarx':
        case 'calendar_x': return <CalendarX size={20} style={{ color }} />;
        case 'droplet': return <Droplet size={20} style={{ color }} />;
        case 'frown': return <Frown size={20} style={{ color }} />;
        case 'checkcircle':
        case 'check_circle': return <CheckCircle size={20} style={{ color }} />;
        case 'activity': return <Activity size={20} style={{ color }} />;
        case 'alerttriangle':
        case 'alert_triangle': return <AlertCircle size={20} style={{ color }} />;
        case 'info': return <Info size={20} style={{ color }} />;
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
            <div className="flex flex-col justify-center items-center h-screen border-t gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="text-gray-500 font-bold animate-pulse">{t('riskAnalysis.analyzingRisks')}</p>
            </div>
        );
    }

    if (!analysisResult || analysisResult.data_insufficient) {
        return (
            <div className="p-8 max-w-5xl mx-auto pb-24 relative flex flex-col">
                {/* Friendly banner for insufficient data */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-400 rounded-[1.5rem] p-8 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-lg w-full">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl opacity-20 pointer-events-none">📝</div>
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10 text-4xl">
                        🌱
                    </div>
                    <div className="flex-1 z-10">
                        <h2 className="text-2xl font-heading font-extrabold mb-2">{t('riskAnalysis.analysisUnavailable')}</h2>
                        <p className="text-white/90 text-base font-medium leading-relaxed max-w-xl">
                            {t('riskAnalysis.notEnoughData')}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-10 shadow-sm flex flex-col items-center justify-center text-center py-16 w-full">
                    <div className="flex gap-4 text-5xl mb-6">
                        <span>📅</span>
                        <span>➡️</span>
                        <span>📊</span>
                        <span>➡️</span>
                        <span>🌟</span>
                    </div>
                    <h2 className="text-xl font-heading font-extrabold text-[#1D1D2C] mb-3">
                        {t('riskAnalysis.logMore')}
                    </h2>
                    <p className="text-gray-500 max-w-md mb-6">
                        Keep tracking your cycles in the Cycle Tracker. After 3 cycles, we'll show you your personalized health check-up!
                    </p>
                    <button
                        onClick={() => navigate('/cycle-tracker/tracker')}
                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                        <Calendar size={20} />
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

            {/* Header Row - Child Friendly */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative z-10 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <Sparkles className="text-pink-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">{t('riskAnalysis.title')}</h1>
                        <p className="text-gray-500 font-medium text-sm">{t('riskAnalysis.showingData')} <strong>{DATE_FILTERS.find(f => f.value === activePeriod)?.label}</strong></p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {DATE_FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => {
                                setActivePeriod(f.value);
                                fetchAnalysis(f.value);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                activePeriod === f.value
                                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md scale-105'
                                    : 'bg-white border border-gray-200 text-[#1D1D2C] hover:bg-pink-50 hover:border-pink-200'
                            }`}
                        >
                            {activePeriod === f.value && <span>✓</span>}
                            {f.label}
                        </button>
                    ))}
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-white border-2 border-pink-200 hover:bg-pink-50 text-pink-600 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                    >
                        <Download size={14} />
                        {t('riskAnalysis.downloadPDF')}
                    </button>
                </div>
            </header>

            {/* Main Risk Banner - Child Friendly */}
            <div className={`bg-gradient-to-r ${activeRisk.bgGradient} rounded-[1.5rem] p-6 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-lg`}>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl opacity-20 pointer-events-none">
                    {activeRisk.emoji}
                </div>

                <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10 text-4xl">
                    {activeRisk.emoji}
                </div>

                <div className="flex-1 z-10">
                    <h2 className="text-2xl font-heading font-extrabold mb-2">{activeRisk.label}</h2>
                    <p className="text-white/90 text-base font-medium leading-relaxed max-w-xl">
                        {activeRisk.message}
                    </p>
                </div>

                <button
                    onClick={handleConsultSpecialist}
                    className="hidden md:flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-all hover:scale-105 z-10"
                >
                    <MessageSquare size={16} />
                    {t('riskAnalysis.consultSpecialist')}
                </button>
            </div>

            {/* Tips Card based on risk level */}
            {displayKey !== 'unknown' && <TipsCard riskLevel={displayKey} t={t} />}

            {/* KPI Cards Row - Child Friendly */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
                {/* Cycle Consistency Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🎯</span>
                        <p className="text-sm font-bold text-gray-600">{t('riskAnalysis.cycleConsistency')}</p>
                    </div>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-4xl font-heading font-extrabold text-[#1D1D2C]">{cycle_consistency ?? '—'}%</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            (cycle_consistency ?? 0) >= 80 ? 'bg-green-100 text-green-600' : 
                            (cycle_consistency ?? 0) >= 60 ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-pink-100 text-pink-600'
                        }`}>
                            {(cycle_consistency ?? 0) >= 80 ? '👍 Great!' : (cycle_consistency ?? 0) >= 60 ? '👌 Good' : '📈 Building'}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all ${
                                (cycle_consistency ?? 0) >= 80 ? 'bg-green-400' : 
                                (cycle_consistency ?? 0) >= 60 ? 'bg-yellow-400' : 
                                'bg-pink-400'
                            }`} 
                            style={{ width: `${cycle_consistency ?? 0}%` }} 
                        />
                    </div>
                    <ExplainCard text={t('riskAnalysis.cycleConsistencyExplain')} />
                </div>

                {/* Symptom Intensity Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">📊</span>
                        <p className="text-sm font-bold text-gray-600">{t('riskAnalysis.symptomIntensity')}</p>
                    </div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-3xl font-heading font-extrabold text-[#1D1D2C] capitalize">{symptom_intensity ?? '—'}</h3>
                        <span className="text-2xl">
                            {symptom_intensity?.toLowerCase() === 'decreasing' ? '📉' : 
                             symptom_intensity?.toLowerCase() === 'increasing' ? '📈' : '➡️'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{t('riskAnalysis.basedOnData')}</p>
                    <ExplainCard text={t('riskAnalysis.symptomIntensityExplain')} />
                </div>

                {/* Average Cycle Length Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">📅</span>
                        <p className="text-sm font-bold text-gray-600">{t('riskAnalysis.avgCycleLength')}</p>
                    </div>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-4xl font-heading font-extrabold text-[#1D1D2C]">{average_cycle_length ?? '—'} <span className="text-lg text-gray-400">days</span></h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-lg ${
                            (average_cycle_length ?? 28) >= 21 && (average_cycle_length ?? 28) <= 35 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                            {(average_cycle_length ?? 28) >= 21 && (average_cycle_length ?? 28) <= 35 
                            ? '✅ Normal range!' 
                            : '👀 A bit different'}
                        </span>
                    </div>
                    <ExplainCard text={t('riskAnalysis.avgCycleLengthExplain')} />
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Symptom Trends Line Chart - Child Friendly */}
                {(symptom_trend && symptom_trend.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📈</span>
                            <div>
                                <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">{t('riskAnalysis.symptomTrendsTitle')}</h3>
                                <p className="text-xs text-gray-400 font-medium">{t('riskAnalysis.symptomTrendsExplain')}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-[10px] font-extrabold tracking-widest uppercase text-gray-500">
                            <span className="flex items-center gap-1.5"><span className="text-lg">😣</span> Cramps</span>
                            <span className="flex items-center gap-1.5"><span className="text-lg">😴</span> Fatigue</span>
                        </div>
                    </div>

                    <div className="flex-1 relative border-l border-b border-gray-100 pb-2 h-48">
                        <div className="absolute inset-0 flex flex-col justify-between pt-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="border-b border-gray-50 w-full" />)}
                        </div>
                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[90%] overflow-visible mt-auto transform translate-y-2">
                            <path d={generatePath(symptom_trend, 'cramps')} fill="none" stroke="#FF0055" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[80%] overflow-visible mt-auto transform translate-y-6">
                            <path d={generatePath(symptom_trend, 'fatigue')} fill="none" stroke="#A855F7" strokeWidth="2" strokeDasharray="5,5" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-2">
                        {symptom_trend.map((t, i) => <span key={i}>{t.week}</span>)}
                    </div>
                </div>
                )}

                {/* Cycle Comparison Bar Chart - Child Friendly */}
                {(cycle_comparison && cycle_comparison.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌈</span>
                            <div>
                                <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">{t('riskAnalysis.hormonalVariationTitle')}</h3>
                                <p className="text-xs text-gray-400 font-medium">{t('riskAnalysis.hormonalVariationExplain')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => showToast('Light pink = Period days, Dark pink = Middle of cycle, Light = End of cycle', 'info')}
                            className="text-[10px] font-extrabold tracking-widest text-[#FF0055] uppercase hover:underline flex items-center gap-1"
                        >
                            <HelpCircle size={12} />
                            {t('riskAnalysis.viewLegend')}
                        </button>
                    </div>

                    <div className="flex-1 space-y-5">
                        {cycle_comparison.map((row, idx) => {
                            const highlight = row.intensity?.toLowerCase() === 'heavy' || row.intensity?.toLowerCase() === 'high';
                            const color = highlight ? '#FF0055' : '#EC4899';
                            const emoji = idx === 0 ? '🆕' : idx === 1 ? '📆' : '📊';
                            return (
                            <div key={row.label}>
                                <div className={`flex justify-between text-sm font-bold mb-2 ${highlight ? 'text-[#1D1D2C]' : 'text-gray-600'}`}>
                                    <span className="flex items-center gap-2">
                                        <span>{emoji}</span>
                                        {row.label}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-lg ${highlight ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {row.length} days
                                    </span>
                                </div>
                                <div className="h-8 w-full rounded-xl flex overflow-hidden shadow-inner bg-gray-100">
                                    <div className="h-full bg-pink-200 transition-all" style={{ width: '20%' }} />
                                    <div className="h-full transition-all" style={{ width: '50%', backgroundColor: color }} />
                                    <div className="h-full bg-pink-200 transition-all" style={{ width: '30%' }} />
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 flex gap-3 items-start border border-blue-100">
                        <span className="text-xl">💡</span>
                        <p className="text-xs font-medium text-gray-600 leading-relaxed">
                            {t('riskAnalysis.moreDataNeeded')}
                        </p>
                    </div>
                </div>
                )}
            </div>

            {/* Risk Factors List - Child Friendly */}
            <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">🔍</span>
                    <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">{t('riskAnalysis.specificRiskFactors')}</h3>
                </div>

                {visibleFactors.length === 0 ? (
                    <div className="text-center py-8">
                        <span className="text-4xl mb-4 block">✨</span>
                        <p className="text-gray-500 font-medium">Everything looks good! No concerns to show.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {visibleFactors.map((factor, i) => (
                            <div
                                key={factor.title || i}
                                className={`flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors`}
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ background: factor.bg_color || '#FFF0F4' }}>
                                    {factor.icon_type?.toLowerCase().includes('check') ? '✅' :
                                     factor.icon_type?.toLowerCase().includes('calendar') ? '📅' :
                                     factor.icon_type?.toLowerCase().includes('droplet') ? '💧' :
                                     factor.icon_type?.toLowerCase().includes('frown') ? '😟' :
                                     factor.icon_type?.toLowerCase().includes('activity') ? '📈' :
                                     factor.icon_type?.toLowerCase().includes('info') ? 'ℹ️' : '⚠️'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                                        <h4 className="font-bold text-[#1D1D2C] text-base">{factor.title}</h4>
                                        <span
                                            className="text-[10px] font-extrabold tracking-wider px-3 py-1.5 rounded-lg uppercase"
                                            style={{ background: factor.badge_bg || '#FFF0F4', color: factor.badge_color || '#FF0055' }}
                                        >
                                            {factor.badge_text === 'High Priority' ? '⚡ Important' : 
                                             factor.badge_text === 'Monitor' ? '👀 Watch' :
                                             factor.badge_text === 'Moderate' ? '📋 Note' :
                                             factor.badge_text === 'Good' ? '✨ Great' :
                                             factor.badge_text === 'Low' ? '👍 Good' : factor.badge_text}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{factor.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {factors.length > 3 && (
                    <button
                        onClick={() => setShowAllFactors(v => !v)}
                        className="w-full mt-4 py-3 text-sm font-bold text-pink-600 hover:bg-pink-50 rounded-xl transition-colors flex items-center justify-center gap-2 border border-pink-200"
                    >
                        {showAllFactors ? (
                            <><ChevronUp size={16} /> {t('riskAnalysis.showLess')}</>
                        ) : (
                            <><ChevronDown size={16} /> {t('riskAnalysis.viewAllFactors')} ({factors?.length ?? 0})</>
                        )}
                    </button>
                )}
            </div>

            {/* Floating Chat Button - More friendly */}
            <button
                onClick={() => navigate('/community')}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-white hover:from-pink-600 hover:to-pink-700 hover:scale-110 transition-all z-50"
                title="Chat with someone"
            >
                <span className="text-2xl">💬</span>
            </button>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default RiskAnalysis;
