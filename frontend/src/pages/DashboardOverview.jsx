import { useState, useEffect, useCallback } from 'react';
import { Search, Bell, Info, Lightbulb, TrendingDown, Activity, CalendarDays, MessageSquare, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import axiosInstance from '../api/axiosInstance';

const MOODS = [
    { emoji: '🙂', label: 'Fine' },
    { emoji: '💧', label: 'Bloated' },
    { emoji: '⚡', label: 'Cramps' },
    { emoji: '🛏️', label: 'Fatigue' },
    { emoji: '😞', label: 'Sad' },
    { emoji: '🤕', label: 'Headache' },
];

const DashboardOverview = () => {
    const navigate = useNavigate();
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);

    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const toggleMood = (label) => {
        setSelectedMoods(prev =>
            prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
        );
    };

    const handleSaveMood = () => {
        if (selectedMoods.length === 0) {
            showToast('Please select at least one mood first.', 'warning');
            return;
        }
        showToast(`Mood logged: ${selectedMoods.join(', ')} ✓`, 'success');
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
                    <span className="text-xl">🔒</span>
                    <p>Please sign in to view your dashboard</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
            {/* Top Header Row */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-heading font-extrabold mb-1">Overview Dashboard</h1>
                    <p className="text-gray-500 font-medium text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} — Your daily health summary
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search analytics..."
                            className="bg-white border border-gray-100 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium w-64 outline-none focus:border-[#D81B60] transition-colors shadow-sm"
                        />
                    </div>
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
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Cycle Streak</h4>
                            <p className="text-3xl font-black text-[#D81B60]">{summary?.cycle_streak ?? '—'} <span className="text-sm text-gray-500 font-medium">logs</span></p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Period</h4>
                            <p className="text-xl font-black text-gray-800 mt-2">{formatDate(summary?.last_period_date)}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Next Prediction</h4>
                            <p className="text-xl font-black text-[#D81B60] mt-2">{formatDate(summary?.next_period_prediction)}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Length</h4>
                            <p className="text-3xl font-black text-gray-800">{summary?.average_cycle_length ?? '—'} <span className="text-sm text-gray-500 font-medium">days</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Advanced Stats */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col justify-center gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-[#D81B60] uppercase tracking-widest mb-1">Top Symptoms & Mood</h4>
                                <h3 className="font-heading font-bold text-lg mb-4">This Week</h3>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎭</span>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold">Primary Mood</p>
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
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cycles Logged</h4>
                            <p className="text-4xl font-black text-gray-900">{summary?.cycles_logged ?? '—'}</p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col justify-center items-center text-center">
                            <MessageSquare className="text-pink-400 mb-4" size={32} />
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Community Posts</h4>
                            <p className="text-4xl font-black text-gray-900">{summary?.community_posts_count ?? '—'}</p>
                        </div>
                    </div>

                    {/* How are you feeling today (Mood logger) */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-heading font-bold text-lg">How are you feeling today?</h3>
                            {selectedMoods.length > 0 && (
                                <span className="text-xs text-gray-400 font-medium">
                                    {selectedMoods.length} selected
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            {MOODS.map(({ emoji, label }) => {
                                const active = selectedMoods.includes(label);
                                return (
                                    <div key={label} className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => toggleMood(label)}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${
                                                active
                                                    ? 'bg-[#FFF0F4] border-[#D81B60] scale-110 shadow-md'
                                                    : 'bg-[#F8F9FA] border-transparent hover:bg-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <span className="text-xl">{emoji}</span>
                                        </button>
                                        <span className={`text-xs font-bold ${active ? 'text-[#D81B60]' : 'text-gray-500'}`}>
                                            {label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={handleSaveMood}
                            className="w-full py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            Save Today's Mood
                        </button>
                    </div>
                </>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default DashboardOverview;
