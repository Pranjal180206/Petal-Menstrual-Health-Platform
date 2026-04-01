import { useState, useCallback, useEffect } from 'react';
import { Save } from 'lucide-react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CycleSettings = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [toast, setToast] = useState(null);

    /* ── Cycle Preferences ── */
    const [cycleLength, setCycleLength] = useState(user?.cycle_preferences?.average_cycle_length || 28);
    const [periodLength, setPeriodLength] = useState(user?.cycle_preferences?.average_period_length || 5);
    const [lutealLength, setLutealLength] = useState(user?.cycle_preferences?.luteal_phase_length || 14);

    useEffect(() => {
        if (user?.cycle_preferences) {
            setCycleLength(user.cycle_preferences.average_cycle_length || 28);
            setPeriodLength(user.cycle_preferences.average_period_length || 5);
            setLutealLength(user.cycle_preferences.luteal_phase_length || 14);
        }
    }, [user]);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const handleSaveCycle = async () => {
        try {
            const res = await axiosInstance.patch('/users/cycle-preferences', {
                average_cycle_length: cycleLength,
                average_period_length: periodLength,
                luteal_phase_length: lutealLength,
            });
            setUser(res.data);
            showToast('Cycle preferences updated! ✓', 'success');
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            else showToast('Failed to save cycle preferences.', 'error');
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C] mb-1">{t('sidebar.cycleSettings')}</h1>
                <p className="text-sm text-gray-500 font-medium">Fine-tune your period predictions and health insights.</p>
            </header>

            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-pink-100 rounded-2xl flex items-center justify-center text-xl">🌸</div>
                    <div>
                        <h2 className="font-heading font-bold text-lg text-[#1D1D2C]">Cycle Preferences</h2>
                        <p className="text-xs text-gray-400 font-medium tracking-tight">Used to personalize your tracking experience</p>
                    </div>
                </div>

                <div className="space-y-10">
                    {[
                        { 
                            label: 'Average Cycle Length', 
                            value: cycleLength, 
                            set: setCycleLength, 
                            min: 21, 
                            max: 45, 
                            unit: 'days', 
                            desc: 'Number of days from the start of one period to the start of the next.' 
                        },
                        { 
                            label: 'Average Period Length', 
                            value: periodLength, 
                            set: setPeriodLength, 
                            min: 2, 
                            max: 10, 
                            unit: 'days', 
                            desc: 'How many days your bleeding typically lasts.' 
                        },
                        { 
                            label: 'Luteal Phase Length', 
                            value: lutealLength, 
                            set: setLutealLength, 
                            min: 10, 
                            max: 16, 
                            unit: 'days', 
                            desc: 'The time from ovulation until your next period starts.' 
                        },
                    ].map(({ label, value, set, min, max, unit, desc }) => (
                        <div key={label} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <label className="text-sm font-black text-[#1D1D2C] uppercase tracking-wider">{label}</label>
                                    <p className="text-xs text-gray-400 font-medium">{desc}</p>
                                </div>
                                <span className="text-xl font-black text-[#D81B60] bg-pink-50 px-3 py-1 rounded-xl">{value} <span className="text-xs opacity-60 uppercase">{unit}</span></span>
                            </div>
                            <div className="relative pt-2">
                                <input
                                    type="range"
                                    min={min}
                                    max={max}
                                    value={value}
                                    onChange={e => set(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#D81B60] transition-all hover:bg-gray-200"
                                />
                                <div className="flex justify-between text-[10px] text-gray-400 font-black mt-2 uppercase tracking-tighter">
                                    <span>{min} days</span>
                                    <span>{max} days</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col md:flex-row items-center gap-4 bg-pink-50/50 p-6 rounded-[1.5rem] border border-pink-100/50">
                    <div className="text-center md:text-left flex-1">
                        <p className="text-sm font-bold text-[#D81B60]">Wait, looking for account settings?</p>
                        <p className="text-xs text-gray-500 font-medium">Profile, notifications, and privacy have moved to the top-right account menu.</p>
                    </div>
                    <button
                        onClick={handleSaveCycle}
                        className="flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-pink-200 active:scale-95"
                    >
                        <Save size={18} /> Save Preferences
                    </button>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default CycleSettings;
