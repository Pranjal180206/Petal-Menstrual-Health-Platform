import { useState, useCallback, useEffect } from 'react';
import { User, Bell, Shield, Palette, Trash2, ChevronRight, Camera, Save, Globe } from 'lucide-react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
    { id: 'cycle', icon: <span className="text-base">🌸</span>, label: 'Cycle Preferences' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'privacy', icon: <Shield size={18} />, label: 'Privacy & Data' },
    { id: 'language', icon: <Globe size={18} />, label: 'Language' },
    { id: 'appearance', icon: <Palette size={18} />, label: 'Appearance' },
    { id: 'account', icon: <Trash2 size={18} />, label: 'Account', danger: true },
];

const Toggle = ({ checked, onChange }) => (
    <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-[#D81B60]' : 'bg-gray-200'}`}
    >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

const Settings = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('profile');
    const [toast, setToast] = useState(null);

    /* ── Profile State ── */
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.profile?.bio || '',
    });

    /* ── Cycle Preferences ── */
    const [cycleLength, setCycleLength] = useState(user?.cycle_preferences?.average_cycle_length || 28);
    const [periodLength, setPeriodLength] = useState(user?.cycle_preferences?.average_period_length || 5);
    const [lutealLength, setLutealLength] = useState(user?.cycle_preferences?.luteal_phase_length || 14);

    /* ── Notifications ── */
    const [notifs, setNotifs] = useState({
        email: user?.notification_preferences?.email ?? true,
        push: user?.notification_preferences?.push ?? true,
        reminders: user?.notification_preferences?.reminders ?? true,
    });

    /* ── Privacy ── */
    const [privacy, setPrivacy] = useState({
        data_sharing: user?.privacy_settings?.data_sharing ?? false,
        anonymous_by_default: user?.privacy_settings?.anonymous_by_default ?? true,
    });

    /* ── Language ── */
    const [language, setLanguage] = useState(user?.language_preference || 'en');

    /* ── Appearance ── */
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accent') || '#D81B60');

    // Sync state on user change
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setProfile(p => ({ ...p, name: user.name || '', email: user.email || '', bio: user.profile?.bio || '' }));
        setNotifs({
            email: user.notification_preferences?.email ?? true,
            push: user.notification_preferences?.push ?? true,
            reminders: user.notification_preferences?.reminders ?? true,
        });
        setPrivacy({
            data_sharing: user.privacy_settings?.data_sharing ?? false,
            anonymous_by_default: user.privacy_settings?.anonymous_by_default ?? true,
        });
        setLanguage(user.language_preference || 'en');
        // If we had cycle preferences in user object, we'd sync them here
    }, [user, navigate]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('accent', accentColor);
        document.documentElement.style.setProperty('--color-primary', accentColor);
    }, [accentColor]);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const handleSaveProfile = async () => {
        try {
            const res = await axiosInstance.patch('/users/profile', {
                name: profile.name,
                profile: { bio: profile.bio }
            });
            setUser(res.data);
            showToast('Profile saved successfully! ✓', 'success');
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            else showToast('Failed to save profile.', 'error');
        }
    };

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

    const handleSaveNotifs = async () => {
        try {
            const res = await axiosInstance.patch('/users/settings', { notification_preferences: notifs });
            setUser(res.data);
            showToast('Notification settings saved! ✓', 'success');
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            else showToast('Failed to save notification settings.', 'error');
        }
    };

    const handleSavePrivacy = async () => {
        try {
            const res = await axiosInstance.patch('/users/settings', { privacy_settings: privacy });
            setUser(res.data);
            showToast('Privacy settings updated! ✓', 'success');
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            else showToast('Failed to save privacy settings.', 'error');
        }
    };

    const handleSaveLanguage = async () => {
        try {
            const res = await axiosInstance.patch('/users/settings', { language_preference: language });
            setUser(res.data);
            showToast('Language preferences updated! ✓', 'success');
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            else showToast('Failed to save language preferences.', 'error');
        }
    };

    const handleDeleteAccount = () => {
        showToast('Account deletion requires email confirmation.', 'warning');
    };

    const ACCENT_COLORS = ['#D81B60', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#009688', '#FF5722'];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C] mb-1">Settings</h1>
                <p className="text-sm text-gray-500 font-medium">Manage your account, preferences, and privacy.</p>
            </header>

            <div className="flex gap-6">
                <nav className="w-48 shrink-0 space-y-1">
                    {SECTIONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all text-left ${
                                activeSection === s.id
                                    ? s.danger
                                        ? 'bg-red-50 text-red-600'
                                        : 'bg-[#FFF0F4] text-[#D81B60]'
                                    : s.danger
                                        ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#1D1D2C]'
                            }`}
                        >
                            <span className={s.danger && activeSection !== s.id ? 'text-red-400' : ''}>{s.icon}</span>
                            {s.label}
                            <ChevronRight size={14} className="ml-auto opacity-50" />
                        </button>
                    ))}
                </nav>

                <div className="flex-1 space-y-4">
                    {/* ── PROFILE ── */}
                    {activeSection === 'profile' && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-6">Profile Information</h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="w-20 h-20 rounded-full border-4 border-[#FCE4EC] object-cover" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full border-4 border-[#FCE4EC] bg-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                                            {profile.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => showToast('Photo upload coming soon.', 'info')}
                                        className="absolute bottom-0 right-0 w-7 h-7 bg-[#D81B60] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C2185B] transition-colors"
                                    >
                                        <Camera size={12} />
                                    </button>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1D1D2C]">{profile.name}</p>
                                    <p className="text-sm text-gray-500">{user ? 'Member' : ''}</p>
                                    <button
                                        onClick={() => showToast('Photo upload coming soon.', 'info')}
                                        className="text-xs font-bold text-[#D81B60] hover:underline mt-1"
                                    >
                                        Change photo
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                        className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Email</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={profile.email}
                                        className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Bio</label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors resize-none"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                className="mt-6 flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Save size={16} /> Save Profile
                            </button>
                        </div>
                    )}

                    {/* ── CYCLE PREFERENCES ── */}
                    {activeSection === 'cycle' && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-2">Cycle Preferences</h2>
                            <p className="text-sm text-gray-500 mb-6">Used to personalize predictions and insights.</p>
                            <div className="space-y-6">
                                {[
                                    { label: 'Average Cycle Length', value: cycleLength, set: setCycleLength, min: 21, max: 45, unit: 'days', desc: 'From start of one period to start of next' },
                                    { label: 'Average Period Length', value: periodLength, set: setPeriodLength, min: 2, max: 10, unit: 'days', desc: 'How many days your period typically lasts' },
                                    { label: 'Luteal Phase Length', value: lutealLength, set: setLutealLength, min: 10, max: 16, unit: 'days', desc: 'From ovulation to next period' },
                                ].map(({ label, value, set, min, max, unit, desc }) => (
                                    <div key={label}>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-sm font-bold text-[#1D1D2C]">{label}</label>
                                            <span className="text-sm font-extrabold text-[#D81B60]">{value} {unit}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">{desc}</p>
                                        <input
                                            type="range"
                                            min={min}
                                            max={max}
                                            value={value}
                                            onChange={e => set(Number(e.target.value))}
                                            className="w-full accent-[#D81B60]"
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                                            <span>{min}</span><span>{max}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleSaveCycle}
                                className="mt-6 flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Save size={16} /> Save Preferences
                            </button>
                        </div>
                    )}

                    {/* ── NOTIFICATIONS ── */}
                    {activeSection === 'notifications' && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-2">Notification Settings</h2>
                            <p className="text-sm text-gray-500 mb-6">Choose what you want to be reminded about.</p>

                            <div className="space-y-1">
                                {[
                                    { key: 'email', label: 'Email Notifications', desc: 'Receive important updates and digests via email' },
                                    { key: 'push', label: 'Push Notifications', desc: 'Receive alerts and rapid updates on your device' },
                                    { key: 'reminders', label: 'Daily Reminders', desc: 'Evening reminders to log your daily symptoms and mood' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#FAFAFA] transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-[#1D1D2C]">{label}</p>
                                            <p className="text-xs text-gray-400 font-medium">{desc}</p>
                                        </div>
                                        <Toggle
                                            checked={notifs[key]}
                                            onChange={v => setNotifs(p => ({ ...p, [key]: v }))}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSaveNotifs}
                                className="mt-6 flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Save size={16} /> Save Notifications
                            </button>
                        </div>
                    )}

                    {/* ── PRIVACY ── */}
                    {activeSection === 'privacy' && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-2">Privacy &amp; Data</h2>
                            <p className="text-sm text-gray-500 mb-6">Control how your health data is used and stored.</p>

                            <div className="space-y-1">
                                {[
                                    { key: 'data_sharing', label: 'Data Sharing', desc: 'Contribute anonymized cycle data to health research' },
                                    { key: 'anonymous_by_default', label: 'Anonymous by Default', desc: 'Ensure all analytics and sharing are fully anonymized' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#FAFAFA] transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-[#1D1D2C]">{label}</p>
                                            <p className="text-xs text-gray-400 font-medium">{desc}</p>
                                        </div>
                                        <Toggle
                                            checked={privacy[key]}
                                            onChange={v => setPrivacy(p => ({ ...p, [key]: v }))}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSavePrivacy}
                                className="mt-6 flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Save size={16} /> Save Privacy Settings
                            </button>
                        </div>
                    )}

                    {/* ── LANGUAGE ── */}
                    {activeSection === 'language' && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-2">Language Preferences</h2>
                            <p className="text-sm text-gray-500 mb-6">Choose your preferred language for Petal.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Display Language</label>
                                    <select
                                        value={language}
                                        onChange={e => setLanguage(e.target.value)}
                                        className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
                                    >
                                        <option value="en">English (US)</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                        <option value="de">Deutsch</option>
                                        <option value="hi">हिन्दी</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveLanguage}
                                className="mt-6 flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                            >
                                <Save size={16} /> Save Language
                            </button>
                        </div>
                    )}

                    {/* ── APPEARANCE ── */}
                    {activeSection === 'appearance' && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-2">Appearance</h2>
                            <p className="text-sm text-gray-500 mb-6">Customize how Petal looks for you.</p>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAFAFA]">
                                    <div>
                                        <p className="text-sm font-bold text-[#1D1D2C]">Dark Mode</p>
                                        <p className="text-xs text-gray-400">Easy on the eyes, especially at night</p>
                                    </div>
                                    <Toggle
                                        checked={darkMode}
                                        onChange={setDarkMode}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#1D1D2C] mb-1">Accent Color</p>
                                    <p className="text-xs text-gray-400 mb-3">Choose your primary app color</p>
                                    <div className="flex gap-3 flex-wrap">
                                        {ACCENT_COLORS.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setAccentColor(c)}
                                                className={`w-9 h-9 rounded-full transition-transform hover:scale-110 border-4 ${accentColor === c ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                                                style={{ background: c }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── ACCOUNT ── */}
                    {activeSection === 'account' && (
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-2">Account Actions</h2>
                                <p className="text-sm text-gray-500 mb-6">Manage your account access and data.</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold text-[#1D1D2C]"
                                    >
                                        <span>Sign Out</span>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                                <h2 className="font-heading font-bold text-base text-red-700 mb-2 flex items-center gap-2">
                                    <Trash2 size={16} /> Danger Zone
                                </h2>
                                <p className="text-sm text-red-600 mb-4 font-medium">
                                    Permanently delete your account and all data. This action cannot be undone.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                                >
                                    <Trash2 size={16} /> Delete My Account
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Settings;
