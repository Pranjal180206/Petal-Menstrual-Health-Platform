import { useState, useEffect } from 'react';
import { Lightbulb, Droplets, Activity, Zap, TrendingUp, AlertCircle, CalendarDays, Smile, Brain, CheckCircle, Info, AlertTriangle, HelpCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';

const getSymptomIcon = (symptom) => {
    const key = (symptom || '').toLowerCase();
    if (key === 'cramps') return Activity;
    if (key === 'fatigue') return Zap;
    if (key === 'headache') return AlertCircle;
    return Droplets;
};

// Child-friendly explanation card component
const ExplainCard = ({ text, className = "" }) => (
    <div className={`bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mt-4 border border-pink-100 ${className}`}>
        <div className="flex items-start gap-2">
            <HelpCircle className="text-pink-400 shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{text}</p>
        </div>
    </div>
);

const Insights = () => {
    const { t } = useTranslation();
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await axiosInstance.get('/insights/');
                console.log("API DATA:", res.data);
                setInsights(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setAuthError(true);
                }
                console.error("Insights fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInsights();
    }, []);

    if (authError) {
        return (
            <div className="flex items-center justify-center p-8 h-[70vh]">
                <div className="bg-pink-50 border border-pink-200 text-pink-600 px-8 py-6 rounded-2xl font-bold flex flex-col gap-3 items-center shadow-sm max-w-sm text-center">
                    <p className="text-lg">{t('insights.signInNeeded')}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center py-32 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D81B60]"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading your insights...</p>
            </div>
        );
    }

    const { cycle_length_history = [], symptom_frequency = [], mood_trend = [], symptom_trend = [], top_symptom, ml_summary } = insights || {};

    const hasData = cycle_length_history.length > 0 || symptom_frequency.length > 0 || mood_trend.length > 0 || symptom_trend.length > 0 || top_symptom || ml_summary?.available;

    if (!hasData) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                            <Sparkles className="text-pink-500" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">{t('insights.title')}</h1>
                            <p className="text-sm text-gray-500 font-medium">{t('insights.subtitle')}</p>
                        </div>
                    </div>
                </header>
                <div className="bg-white rounded-[2rem] p-12 shadow-card border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <Sparkles className="text-pink-500" size={28} />
                    </div>
                    <h2 className="text-2xl font-heading font-extrabold text-[#1D1D2C] mb-3">{t('insights.noInsights')}</h2>
                    <p className="text-base text-gray-500 font-medium max-w-md leading-relaxed">
                        {t('insights.noInsightsDesc')}
                    </p>
                </div>
            </div>
        );
    }

    const moodMap = {
        happy: { score: 3, label: 'Happy' },
        neutral: { score: 2, label: 'Okay' },
        sad: { score: 1, label: 'Sad' },
        irritated: { score: 0, label: 'Irritated' }
    };

    const processedMoodTrend = mood_trend.map(t => ({
        ...t,
        mood_score: t.mood ? (moodMap[t.mood.toLowerCase()]?.score ?? 2) : 2,
        mood_label: t.mood ? (moodMap[t.mood.toLowerCase()]?.label ?? 'Unknown') : 'Unknown'
    }));

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="mb-8" data-tour-id="insights-header">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <Sparkles className="text-pink-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">{t('insights.title')}</h1>
                        <p className="text-sm text-gray-500 font-medium">{t('insights.subtitle')}</p>
                    </div>
                </div>
            </header>

            {/* Top Symptom Banner - More fun and friendly */}
            {top_symptom && (
                <section>
                    <div className="rounded-[1.5rem] p-6 text-white bg-gradient-to-r from-[#D81B60] to-[#F06292] shadow-lg flex items-center gap-6 relative overflow-hidden">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                            {(() => {
                                const SymptomIcon = getSymptomIcon(top_symptom);
                                return <SymptomIcon size={96} />;
                            })()}
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm z-10 shrink-0">
                            {(() => {
                                const SymptomIcon = getSymptomIcon(top_symptom);
                                return <SymptomIcon size={28} />;
                            })()}
                        </div>
                        <div className="z-10">
                            <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">{t('insights.mostFrequentSymptom')}</p>
                            <h2 className="text-3xl font-heading font-extrabold capitalize filter drop-shadow-sm">{top_symptom}</h2>
                            <p className="text-white/90 text-sm mt-1">This is what you feel most often during your cycle</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Symptom Trends Chart - With explanation */}
            {symptom_trend.length >= 2 && (
                <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[#1D1D2C] flex items-center gap-2">
                                <TrendingUp className="text-pink-500" size={20} />
                                {t('insights.symptomTrends')}
                            </h3>
                            <p className="text-xs text-gray-400 font-medium mt-1">How your symptoms changed over time</p>
                        </div>
                        <div className="flex gap-3 text-[10px] font-extrabold tracking-widest uppercase text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#FF0055]" /> Cramps
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#A855F7]" /> Fatigue
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 relative border-l border-b border-gray-100 pb-2 h-48">
                        {/* Y-axis gridlines */}
                        <div className="absolute inset-0 flex flex-col justify-between pt-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="border-b border-gray-50 w-full" />)}
                        </div>

                        {/* Cramps line */}
                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[90%] overflow-visible mt-auto transform translate-y-2">
                            {(() => {
                                if (!symptom_trend || symptom_trend.length < 2) return null;
                                let maxVal = Math.max(...symptom_trend.map(t => Math.max(t.cramps || 0, t.fatigue || 0)), 1);
                                if (maxVal === 0) maxVal = 1;

                                const padding = 5;
                                const height = 50;

                                const crampPts = symptom_trend.map((t, i) => {
                                    const x = (i / Math.max(symptom_trend.length - 1, 1)) * 100;
                                    const value = t.cramps || 0;
                                    const y = height - ((value / maxVal) * (height - padding)) + padding;
                                    return `${x},${y}`;
                                });

                                return (
                                    <>
                                        <path d={`M${crampPts.join(' L')}`} fill="none" stroke="#FF0055" strokeWidth="2.5" strokeLinecap="round" />
                                        {crampPts.map((p, i) => {
                                            const [x, y] = p.split(",");
                                            return <circle key={i} cx={x} cy={y} r="3" fill="#FF0055" />;
                                        })}
                                    </>
                                );
                            })()}
                        </svg>

                        {/* Fatigue line */}
                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[80%] overflow-visible mt-auto transform translate-y-6">
                            {(() => {
                                if (!symptom_trend || symptom_trend.length < 2) return null;
                                let maxVal = Math.max(...symptom_trend.map(t => Math.max(t.cramps || 0, t.fatigue || 0)), 1);
                                if (maxVal === 0) maxVal = 1;

                                const padding = 5;
                                const height = 50;

                                const fatiguePts = symptom_trend.map((t, i) => {
                                    const x = (i / Math.max(symptom_trend.length - 1, 1)) * 100;
                                    const value = t.fatigue || 0;
                                    const y = height - ((value / maxVal) * (height - padding)) + padding;
                                    return `${x},${y}`;
                                });

                                return (
                                    <>
                                        <path d={`M${fatiguePts.join(' L')}`} fill="none" stroke="#A855F7" strokeWidth="2" strokeDasharray="5,5" strokeLinecap="round" />
                                        {fatiguePts.map((p, i) => {
                                            const [x, y] = p.split(",");
                                            return <circle key={i} cx={x} cy={y} r="2.5" fill="#A855F7" />;
                                        })}
                                    </>
                                );
                            })()}
                        </svg>
                    </div>

                    <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-gray-400 mt-3 px-2">
                        {symptom_trend.map((t, i) => (
                            <span key={i} className="px-1 truncate" title={t.date}>
                                {new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                        ))}
                    </div>

                    <ExplainCard text={t('insights.symptomTrendsExplain')} />
                </section>
            )}

            {/* Two-column grid for Cycle Length and Symptom Frequency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cycle Length History */}
                {cycle_length_history.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col">
                        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                            <CalendarDays className="text-pink-500" size={20} />
                            {t('insights.cycleLengthHistory')}
                        </h3>
                        <div className="flex-1 flex items-end gap-3 h-48 border-b border-gray-100 pb-2">
                            {cycle_length_history.map((cycle, i) => {
                                const heightPercent = Math.min((cycle.length / 40) * 100, 100);
                                const isAIPredicted = cycle.cycle.includes('AI');
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end group h-full">
                                        <div
                                            className={`w-full rounded-t-xl transition-all relative flex justify-center ${
                                                isAIPredicted 
                                                    ? 'bg-gradient-to-t from-purple-200 to-purple-100 group-hover:from-purple-300 border-2 border-dashed border-purple-300' 
                                                    : 'bg-[#FCE4EC] group-hover:bg-[#F48FB1]'
                                            }`}
                                            style={{ height: `${heightPercent}%` }}
                                        >
                                            <span className="absolute -top-8 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-lg shadow-sm">
                                                {cycle.length} days
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-bold mt-2 truncate max-w-full ${isAIPredicted ? 'text-purple-500' : 'text-gray-400'}`}>
                                            {isAIPredicted ? 'AI' : cycle.cycle.replace('Cycle ', 'C')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <ExplainCard text={t('insights.cycleLengthExplain')} />
                    </section>
                )}

                {/* Symptom Frequency with emojis */}
                {symptom_frequency.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col">
                        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                            <Activity className="text-pink-500" size={20} />
                            {t('insights.symptomFrequency')}
                        </h3>
                        <div className="flex-1 flex flex-col justify-center space-y-4">
                            {symptom_frequency.slice(0, 5).map((item, i) => {
                                const maxCount = symptom_frequency[0].count || 1;
                                const widthPercent = (item.count / maxCount) * 100;
                                    return (
                                    <div key={i} className="flex items-center gap-4 group">
                                        {(() => {
                                            const SymptomIcon = getSymptomIcon(item.symptom);
                                            return <SymptomIcon size={18} className="text-pink-500" />;
                                        })()}
                                        <span className="text-sm font-bold text-gray-700 w-20 truncate capitalize">{item.symptom}</span>
                                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#F48FB1] to-[#D81B60] rounded-full transition-all group-hover:from-[#D81B60] group-hover:to-[#C2185B]"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-pink-500 w-8 text-right">{item.count}x</span>
                                    </div>
                                );
                            })}
                        </div>
                        <ExplainCard text={t('insights.symptomFrequencyExplain')} />
                    </section>
                )}

                {/* Mood Trend with fun visuals */}
                {processedMoodTrend.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col lg:col-span-2">
                        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                            <Smile className="text-pink-500" size={20} />
                            {t('insights.moodTrend')}
                        </h3>
                        
                        {/* Mood legend */}
                        <div className="flex gap-4 mb-6 text-sm">
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Happy</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Okay</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> Sad</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Irritated</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-end h-48 border-b-2 border-l-2 border-gray-100 pb-2 pl-4 pr-2 pt-8 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-[-15px] bottom-2 text-xs font-bold text-gray-500">Low</div>
                            <div className="absolute left-[-15px] top-6 text-xs font-bold text-gray-500">High</div>

                            <div className="flex items-end justify-between h-full w-full gap-2">
                                {processedMoodTrend.slice(-7).map((trend, i) => {
                                    const heightPercent = (trend.mood_score / 3) * 100;
                                    return (
                                        <div key={i} className="flex flex-col items-center justify-end group flex-1 h-full relative">
                                            <div
                                                className="w-full max-w-16 rounded-t-2xl bg-gradient-to-t from-[#FFF0F4] to-[#D81B60] shadow-sm relative flex justify-center items-center transition-all group-hover:scale-105"
                                                style={{ height: `${Math.max(15, heightPercent)}%` }}
                                            >
                                                <span className="text-xs font-bold text-[#D81B60] opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {trend.mood_label}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 mt-3 whitespace-nowrap">
                                                {trend.date ? new Date(trend.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <ExplainCard text={t('insights.moodTrendExplain')} />
                    </section>
                )}
            </div>

            {/* ── AI-Powered Insights ───────────────────────────────────────── */}
            {ml_summary?.available && (
                <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF0F4] to-[#FCE4EC] flex items-center justify-center text-[#D81B60] shrink-0">
                            <Brain size={20} />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">
                                {t('insights.mlSummary.title')}
                            </h3>
                            <p className="text-xs text-gray-400 font-medium">
                                {t('insights.mlSummary.subtitle', { count: ml_summary.population_size?.toLocaleString() || ml_summary.population_insights?.population_size?.toLocaleString() || '333' })}
                            </p>
                        </div>
                        {ml_summary.ml_driven && (
                            <span className="ml-auto text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFF0F4] to-[#FCE4EC] text-[#D81B60]">
                                {t('insights.mlSummary.mlActive')}
                            </span>
                        )}
                    </div>

                    {/* Personalised insight cards */}
                    {ml_summary.personalized_insights?.length > 0 ? (
                        <div className="space-y-3">
                            {ml_summary.personalized_insights.map((insight, i) => {
                                const cfg = {
                                    positive: {
                                        border: 'border-emerald-400',
                                        bg: 'bg-emerald-50',
                                        icon: <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />,
                                    },
                                    warning: {
                                        border: 'border-amber-400',
                                        bg: 'bg-amber-50',
                                        icon: <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />,
                                    },
                                    info: {
                                        border: 'border-blue-300',
                                        bg: 'bg-blue-50',
                                        icon: <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />,
                                    },
                                }[insight.severity] || {
                                    border: 'border-gray-200',
                                    bg: 'bg-gray-50',
                                    icon: <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />,
                                };

                                return (
                                    <div
                                        key={i}
                                        className={`flex gap-3 p-4 rounded-2xl border-l-4 ${cfg.border} ${cfg.bg} transition-all hover:shadow-sm`}
                                    >
                                        {cfg.icon}
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">{insight.title}</p>
                                            <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{insight.message}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="text-4xl mb-3">🌱</div>
                            <p className="text-gray-500 text-sm font-medium">
                                {t('insights.mlSummary.emptyState')}
                            </p>
                        </div>
                    )}

                    {/* Population context bar */}
                    {ml_summary.population_insights?.available && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3">{t('insights.mlSummary.populationSnapshot')}</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-heading font-extrabold text-emerald-500">
                                        {ml_summary.population_insights.pct_low_risk}%
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{t('insights.mlSummary.lowRisk')}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-heading font-extrabold text-[#D81B60]">
                                        {ml_summary.population_insights.avg_cycle_length}d
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{t('insights.mlSummary.avgLength')}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-heading font-extrabold text-amber-500">
                                        {ml_summary.population_insights.pct_moderate_risk}%
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{t('insights.mlSummary.moderateRisk')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default Insights;
