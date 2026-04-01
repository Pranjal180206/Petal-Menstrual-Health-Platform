import { useState, useEffect, useCallback } from 'react';
import { Bell, Info, Lightbulb, TrendingDown, Activity, CalendarDays, MessageSquare, Zap, BookOpen, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import axiosInstance from '../api/axiosInstance';

const DashboardOverview = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();

    const MOODS = [
        { emoji: '🙂', labelKey: 'dashboard.moods.fine',     apiLabel: 'Fine' },
        { emoji: '💧', labelKey: 'dashboard.moods.bloated',  apiLabel: 'Bloated' },
        { emoji: '⚡', labelKey: 'dashboard.moods.cramps',   apiLabel: 'Cramps' },
        { emoji: '🛏️', labelKey: 'dashboard.moods.fatigue',  apiLabel: 'Fatigue' },
        { emoji: '😞', labelKey: 'dashboard.moods.sad',      apiLabel: 'Sad' },
        { emoji: '🤕', labelKey: 'dashboard.moods.headache', apiLabel: 'Headache' },
    ];

    const [selectedMoods, setSelectedMoods] = useState([]);
    const [toast, setToast] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const toggleMood = (apiLabel) => {
        setSelectedMoods(prev =>
            prev.includes(apiLabel) ? prev.filter(m => m !== apiLabel) : [...prev, apiLabel]
        );
    };

    const handleSaveMood = async () => {
        if (selectedMoods.length === 0) {
            showToast('Please select at least one mood first.', 'warning');
            return;
        }
        try {
            await axiosInstance.post('/period-tracker/mood-today', {
                mood: selectedMoods[0].toLowerCase(),
            });
            setSelectedMoods([]);
            showToast(`Mood logged: ${selectedMoods.join(', ')} ✓`, 'success');
            const res = await axiosInstance.get('/dashboard/summary');
            setSummary(res.data);
        } catch (err) {
            console.error('Failed to save mood:', err);
            showToast('Failed to log mood. Please try again.', 'error');
        }
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axiosInstance.get('/dashboard/summary');
                setSummary(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setAuthError(true);
                }
                console.error("Dashboard fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (authError) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl font-bold flex flex-col gap-2 items-center shadow-sm">
                    <p>{t('dashboard.signInNeeded')}</p>
                </div>
            </div>
        );
    }

    // Show alternate dashboard for non-female users who are not menstruating
    // Female users (even if not menstruating yet) should see the full dashboard
    const isFemale = user?.gender === 'female';
    if (!isFemale && !user?.is_menstruating) {
        return (
            <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-heading font-extrabold mb-1">
                        {t('boyDashboard.title', { name: user?.name || 'Friend' })}
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">
                        {t('boyDashboard.subtitle')}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col items-center text-center">
                        <MessageSquare className="text-blue-500 mb-4" size={32} />
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('boyDashboard.communityStats')}</h4>
                        <p className="text-4xl font-black text-gray-900">{summary?.community_posts_count ?? '0'}</p>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col items-center text-center">
                        <BookOpen className="text-green-500 mb-4" size={32} />
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('boyDashboard.educationStats')}</h4>
                        <p className="text-4xl font-black text-gray-900">12</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col items-center text-center">
                        <Zap className="text-yellow-500 mb-4" size={32} />
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Streak</h4>
                        <p className="text-4xl font-black text-gray-900">5</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-card border border-gray-100">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <Lightbulb className="text-yellow-500" />
                            {t('boyDashboard.didYouKnow')}
                        </h3>
                        <div className="p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
                            <p className="text-yellow-800 font-medium leading-relaxed">
                                "The menstrual cycle is more than just a period. It's a complex hormone cycle that affects energy, mood, and health every single day!"
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/education')}
                            className="mt-8 w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            <BookOpen size={20} />
                            {t('boyDashboard.viewEducation')}
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] p-10 shadow-lg text-white">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <Heart className="fill-white" />
                            {t('boyDashboard.supportTip')}
                        </h3>
                        <p className="text-blue-50 font-medium leading-relaxed mb-10">
                            "Being a supportive friend means listening without judgment. Sometimes a small act of kindness or just being there makes a huge difference."
                        </p>
                        <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-200">New Discussion</p>
                                <p className="font-bold text-sm">How to be an ally?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
            {/* Top Header Row */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-heading font-extrabold mb-1">{t('dashboard.title')}</h1>
                    <p className="text-gray-500 font-medium text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — {t('dashboard.dailySummary')}
                    </p>
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D81B60]"></div>
                </div>
            ) : (
                <>
                    {/* Status Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.cycleStreak')}</h4>
                            <p className="text-3xl font-black text-[#D81B60]">{summary?.cycle_streak ?? '—'} <span className="text-sm text-gray-500 font-medium">{t('dashboard.logs')}</span></p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.lastPeriod')}</h4>
                            <p className="text-xl font-black text-gray-800 mt-2">{formatDate(summary?.last_period_date)}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.nextPrediction')}</h4>
                            <p className="text-xl font-black text-[#D81B60] mt-2">{formatDate(summary?.next_period_prediction)}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.avgLength')}</h4>
                            <p className="text-3xl font-black text-gray-800">{summary?.average_cycle_length ?? '—'} <span className="text-sm text-gray-500 font-medium">{t('dashboard.days')}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Advanced Stats */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col justify-center gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-[#D81B60] uppercase tracking-widest mb-1">{t('dashboard.topSymptoms')}</h4>
                                <h3 className="font-heading font-bold text-lg mb-4">{t('dashboard.thisWeek')}</h3>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="text-sm text-gray-500 font-bold">{t('dashboard.primaryMood')}</p>
                                    <p className="font-black text-gray-900 capitalize">{summary?.mood_this_week ?? '—'}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 flex-wrap mt-2">
                                {(summary?.top_symptoms_this_week?.length > 0 ? summary.top_symptoms_this_week : ['—']).map((symp, i) => (
                                    <span key={i} className="px-3 py-1 bg-pink-50 text-[#D81B60] text-xs font-bold rounded-full capitalize">
                                        {symp}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col justify-center items-center text-center">
                            <Activity className="text-[#D81B60] mb-4" size={32} />
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.totalCycles')}</h4>
                            <p className="text-4xl font-black text-gray-900">{summary?.cycles_logged ?? '—'}</p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col justify-center items-center text-center">
                            <MessageSquare className="text-pink-400 mb-4" size={32} />
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('dashboard.communityPosts')}</h4>
                            <p className="text-4xl font-black text-gray-900">{summary?.community_posts_count ?? '—'}</p>
                        </div>
                    </div>

                    {/* How are you feeling today (Mood logger) */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-heading font-bold text-lg">{t('dashboard.howFeeling')}</h3>
                            {selectedMoods.length > 0 && (
                                <span className="text-xs text-gray-400 font-medium">
                                    {selectedMoods.length} {t('dashboard.selected')}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            {MOODS.map(({ emoji, labelKey, apiLabel }) => {
                                const active = selectedMoods.includes(apiLabel);
                                return (
                                    <div key={apiLabel} className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => toggleMood(apiLabel)}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${
                                                active
                                                    ? 'bg-[#FFF0F4] border-[#D81B60] scale-110 shadow-md'
                                                    : 'bg-[#F8F9FA] border-transparent hover:bg-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <span className="text-xl">{emoji}</span>
                                        </button>
                                        <span className={`text-xs font-bold ${active ? 'text-[#D81B60]' : 'text-gray-500'}`}>
                                            {t(labelKey)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={handleSaveMood}
                            className="w-full py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            {t('dashboard.saveMood')}
                        </button>
                    </div>
                </>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default DashboardOverview;
