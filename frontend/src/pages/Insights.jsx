import { useState, useEffect } from 'react';
import { Lightbulb, Droplets, Activity, Zap, TrendingUp, AlertCircle, CalendarDays, Smile } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const Insights = () => {
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await axiosInstance.get('/insights/');
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
                    <p>Please sign in to view your insights.</p>
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

    const { cycle_length_history = [], symptom_frequency = [], mood_trend = [], top_symptom } = insights || {};

    const hasData = cycle_length_history.length > 0 || symptom_frequency.length > 0 || mood_trend.length > 0 || top_symptom;

    if (!hasData) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                            <Lightbulb size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">Data Insights</h1>
                            <p className="text-sm text-gray-500 font-medium">Your health analytics based on logged data</p>
                        </div>
                    </div>
                </header>
                <div className="bg-white rounded-[2rem] p-16 shadow-card border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">🌱</div>
                    <h2 className="text-xl font-heading font-extrabold text-[#1D1D2C] mb-2">No insights yet</h2>
                    <p className="text-sm text-gray-500 font-medium max-w-sm">
                        Start logging your cycle dates, symptoms, and moods in the Cycle Tracker. Insights appear after a few logs!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">Data Insights</h1>
                        <p className="text-sm text-gray-500 font-medium">Your health analytics based on logged data</p>
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
                            <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">Most Frequent Symptom</p>
                            <h2 className="text-3xl font-heading font-extrabold capitalize filter drop-shadow-sm">{top_symptom}</h2>
                        </div>
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {cycle_length_history.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col">
                        <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                            <CalendarDays className="text-[#D81B60]" size={20} />
                            Cycle Length History
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
                        <p className="text-xs text-gray-400 font-medium text-center mt-4">Length in days (capped at 40 in view)</p>
                    </section>
                )}

                {symptom_frequency.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col">
                        <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                            <Activity className="text-[#D81B60]" size={20} />
                            Symptom Frequency
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

                {mood_trend.length > 0 && (
                    <section className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col lg:col-span-2">
                        <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                            <Smile className="text-[#D81B60]" size={20} />
                            Mood Trend (Last 4 Weeks)
                        </h3>
                        <div className="flex-1 flex flex-col justify-end h-48 border-b-2 border-l-2 border-gray-100 pb-2 pl-4 pr-2 pt-8 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-[-16px] bottom-2 text-[10px] font-bold text-gray-400">Low</div>
                            <div className="absolute left-[-16px] top-6 text-[10px] font-bold text-gray-400">High</div>
                            
                            <div className="flex items-end justify-between h-full w-full">
                                {mood_trend.map((trend, i) => {
                                    const heightPercent = (trend.mood_score / 5) * 100;
                                    return (
                                        <div key={i} className="flex flex-col items-center justify-end group w-1/4 h-full relative">
                                            <div 
                                                className="w-12 sm:w-16 rounded-t-2xl bg-gradient-to-t from-[#FFF0F4] to-[#D81B60] shadow-sm relative flex justify-center transition-all group-hover:scale-105"
                                                style={{ height: `${Math.max(10, heightPercent)}%` }}
                                            >
                                                <span className="absolute -top-6 text-xs font-bold text-[#D81B60] bg-pink-50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    Score: {trend.mood_score}/5
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 mt-3 absolute -bottom-7">
                                                {trend.week}
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
