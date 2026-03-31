import { useState, useEffect } from 'react';
import { Lightbulb, Droplets, Activity, Zap, TrendingUp, AlertCircle, CalendarDays, Smile } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';

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
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl font-bold flex flex-col gap-2 items-center shadow-sm">
                    <span className="text-xl">🔒</span>
                    <p>{t('insights.signInNeeded')}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D81B60]"></div>
            </div>
        );
    }

    const { cycle_length_history = [], symptom_frequency = [], mood_trend = [], symptom_trend = [], top_symptom } = insights || {};

    const hasData = cycle_length_history.length > 0 || symptom_frequency.length > 0 || mood_trend.length > 0 || symptom_trend.length > 0 || top_symptom;

    if (!hasData) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                            <Lightbulb size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">{t('insights.title')}</h1>
                            <p className="text-sm text-gray-500 font-medium">{t('insights.subtitle')}</p>
                        </div>
                    </div>
                </header>
                <div className="bg-white rounded-[2rem] p-16 shadow-card border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">🌱</div>
                    <h2 className="text-xl font-heading font-extrabold text-[#1D1D2C] mb-2">{t('insights.noInsights')}</h2>
                    <p className="text-sm text-gray-500 font-medium max-w-sm">
                        {t('insights.noInsightsDesc')}
                    </p>
                </div>
            </div>
        );
    }

    const moodMap = {
        happy: 3,
        neutral: 2,
        sad: 1,
        irritated: 0
    };

    const processedMoodTrend = mood_trend.map(t => ({
        ...t,
        mood_score: t.mood ? moodMap[t.mood.toLowerCase()] ?? 2 : 2
    }));

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">{t('insights.title')}</h1>
                        <p className="text-sm text-gray-500 font-medium">{t('insights.subtitle')}</p>
                    </div>
                </div>
            </header>

            {top_symptom && (
                <section>
                    <div className="rounded-[1.5rem] p-6 text-white bg-gradient-to-r from-[#D81B60] to-[#F06292] shadow-md flex items-center gap-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm z-10 shrink-0">
                            <AlertCircle size={32} />
                        </div>
                        <div className="z-10">
                            <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">{t('insights.mostFrequentSymptom')}</p>
                            <h2 className="text-3xl font-heading font-extrabold capitalize filter drop-shadow-sm">{top_symptom}</h2>
                        </div>
                    </div>
                </section>
            )}

            {symptom_trend.length >= 2 && (
                <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col h-80">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[#1D1D2C]">Symptom Intensity Trends</h3>
                            <p className="text-xs text-gray-400 font-medium">Tracking daily severity explicitly over logs</p>
                        </div>
                        <div className="flex gap-3 text-[9px] font-extrabold tracking-widest uppercase text-gray-500">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF0055]" /> Cramps</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-200" /> Fatigue</span>
                        </div>
                    </div>

                    <div className="flex-1 relative border-l border-b border-gray-100 pb-2">
                        {/* Fake Y-axis gridlines */}
                        <div className="absolute inset-0 flex flex-col justify-between pt-4">
                            {[...Array(4)].map((_, i) => <div key={i} className="border-b border-gray-50 w-full" />)}
                        </div>

                        {/* Custom SVGs mapping directly over 0 to 50 bounding bounds mathematically */}
                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[90%] overflow-visible mt-auto transform translate-y-2">
                            {(() => {
                                if (!symptom_trend || symptom_trend.length < 2) return null;
                                let maxVal = Math.max(...symptom_trend.map(t => Math.max(t.cramps || 0, t.fatigue || 0)), 1);
                                const minVal = Math.min(...symptom_trend.map(t => Math.min(t.cramps || 0, t.fatigue || 0)));

                                if (maxVal === minVal) {
                                    maxVal += 1;
                                }

                                const padding = 5;
                                const height = 50;

                                const crampPts = symptom_trend.map((t, i) => {
                                    const x = (i / Math.max(symptom_trend.length - 1, 1)) * 100;
                                    const value = t.cramps || 0;
                                    const y = height - ((value / maxVal) * (height - padding)) + padding;
                                    return `${x},${y}`;
                                });

                                console.log("TREND DATA:", symptom_trend);
                                console.log("POINTS (Cramps):", crampPts);

                                return (
                                    <>
                                        <path d={`M${crampPts.join(' L')}`} fill="none" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" />
                                        {crampPts.map((p, i) => {
                                            const [x, y] = p.split(",");
                                            return <circle key={i} cx={x} cy={y} r="1.5" fill="#FF0055" />;
                                        })}
                                    </>
                                );
                            })()}
                        </svg>

                        <svg viewBox="-5 -5 110 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-[80%] overflow-visible mt-auto transform translate-y-6">
                            {(() => {
                                if (!symptom_trend || symptom_trend.length < 2) return null;
                                let maxVal = Math.max(...symptom_trend.map(t => Math.max(t.cramps || 0, t.fatigue || 0)), 1);
                                const minVal = Math.min(...symptom_trend.map(t => Math.min(t.cramps || 0, t.fatigue || 0)));

                                if (maxVal === minVal) {
                                    maxVal += 1;
                                }

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
                                        <path d={`M${fatiguePts.join(' L')}`} fill="none" stroke="#FBCFE8" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" />
                                        {fatiguePts.map((p, i) => {
                                            const [x, y] = p.split(",");
                                            return <circle key={i} cx={x} cy={y} r="1.5" fill="#FBCFE8" />;
                                        })}
                                    </>
                                );
                            })()}
                        </svg>
                    </div>

                    <div className="flex justify-between text-[8px] sm:text-[10px] font-bold text-gray-400 mt-3 px-2">
                        {/* Render X-axis date labels */}
                        {symptom_trend.map((t, i) => (
                            <span key={i} className="px-1 truncate" title={t.date}>
                                {new Date(t.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {cycle_length_history.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col">
                        <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                            <CalendarDays className="text-[#D81B60]" size={20} />
                            {t('insights.cycleLengthHistory')}
                        </h3>
                        <div className="flex-1 flex items-end gap-3 h-48 border-b border-gray-100 pb-2">
                            {cycle_length_history.map((cycle, i) => {
                                const heightPercent = Math.min((cycle.length / 40) * 100, 100);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end group h-full">
                                        <div
                                            className="w-full rounded-t-xl bg-[#FCE4EC] group-hover:bg-[#F48FB1] transition-all relative flex justify-center"
                                            style={{ height: `${heightPercent}%` }}
                                        >
                                            <span className="absolute -top-6 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {cycle.length}d
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 mt-2 truncate max-w-full">
                                            {cycle.cycle.replace('Cycle ', 'C')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-400 font-medium text-center mt-4">{t('insights.lengthNote')}</p>
                    </section>
                )}

                {symptom_frequency.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col">
                        <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                            <Activity className="text-[#D81B60]" size={20} />
                            {t('insights.symptomFrequency')}
                        </h3>
                        <div className="flex-1 flex flex-col justify-center space-y-4">
                            {symptom_frequency.map((item, i) => {
                                const maxCount = symptom_frequency[0].count || 1;
                                const widthPercent = (item.count / maxCount) * 100;
                                return (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-gray-700 w-24 truncate capitalize">{item.symptom}</span>
                                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#F48FB1] to-[#D81B60] rounded-full transition-all"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 w-6 text-right">{item.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {processedMoodTrend.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col lg:col-span-2">
                        <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                            <Smile className="text-[#D81B60]" size={20} />
                            {t('insights.moodTrend')}
                        </h3>
                        <div className="flex-1 flex flex-col justify-end h-48 border-b-2 border-l-2 border-gray-100 pb-2 pl-4 pr-2 pt-8 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-[-16px] bottom-2 text-[10px] font-bold text-gray-400">{t('insights.low')}</div>
                            <div className="absolute left-[-16px] top-6 text-[10px] font-bold text-gray-400">{t('insights.high')}</div>

                            <div className="flex items-end justify-between h-full w-full">
                                {processedMoodTrend.map((trend, i) => {
                                    const heightPercent = (trend.mood_score / 3) * 100;
                                    return (
                                        <div key={i} className="flex flex-col items-center justify-end group w-1/4 h-full relative" style={{ minWidth: '40px' }}>
                                            <div
                                                className="w-8 sm:w-12 rounded-t-2xl bg-gradient-to-t from-[#FFF0F4] to-[#D81B60] shadow-sm relative flex justify-center transition-all group-hover:scale-105"
                                                style={{ height: `${Math.max(10, heightPercent)}%` }}
                                            >
                                                <span className="absolute -top-6 text-xs font-bold text-[#D81B60] bg-pink-50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {trend.mood ? trend.mood.charAt(0).toUpperCase() + trend.mood.slice(1) : "Unknown"}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 mt-3 absolute -bottom-7 pr-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px]" title={trend.date ? new Date(trend.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}>
                                                {trend.date ? new Date(trend.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Insights;
