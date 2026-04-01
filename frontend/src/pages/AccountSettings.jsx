import { useState, useCallback, useEffect } from 'react';
import { User, Bell, Shield, Palette, Trash2, ChevronRight, Camera, Save, Globe } from 'lucide-react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';

const SECTIONS = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
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

const AccountSettings = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [activeSection, setActiveSection] = useState('profile');
    const [toast, setToast] = useState(null);

    /* ── Profile State ── */
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.profile?.bio || '',
    });

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
    const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accent') || '#D81B60');

    // Sync state on user change
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setProfile({ name: user.name || '', email: user.email || '', bio: user.profile?.bio || '' });
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
    }, [user, navigate]);

    useEffect(() => {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

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
        <div className="min-h-screen bg-[#F7F8FA] font-sans text-[#1D1D2C]">
            <Navbar />
            <div className="p-8 max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-heading font-extrabold text-[#1D1D2C] mb-1">{t('sidebar.accountSettings')}</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage your profile, security, and app preferences.</p>
                </header>

                <div className="flex flex-col md:flex-row gap-8">
                    <nav className="w-full md:w-64 shrink-0 space-y-1">
                        {SECTIONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all text-left ${
                                    activeSection === s.id
                                        ? s.danger
                                            ? 'bg-red-50 text-red-600 shadow-sm shadow-red-100'
                                            : 'bg-white text-[#D81B60] shadow-md shadow-pink-100/50 scale-[1.02]'
                                        : s.danger
                                            ? 'text-red-400 hover:bg-red-50/50 hover:text-red-600'
                                            : 'text-gray-500 hover:bg-white/50 hover:text-[#1D1D2C]'
                                }`}
                            >
                                <span className={s.danger && activeSection !== s.id ? 'text-red-400' : ''}>{s.icon}</span>
                                {s.label}
                                <ChevronRight size={14} className={`ml-auto transition-transform ${activeSection === s.id ? 'translate-x-1 opacity-100' : 'opacity-30'}`} />
                            </button>
                        ))}
                    </nav>

                    <div className="flex-1 space-y-4">
                        {/* ── PROFILE ── */}
                        {activeSection === 'profile' && (
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-card">
                                <h2 className="font-heading font-bold text-xl text-[#1D1D2C] mb-8">Profile Information</h2>
                                <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-[1.5rem]">
                                    <div className="relative">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full border-4 border-white bg-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                                                {profile.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => showToast('Photo upload coming soon.', 'info')}
                                            className="absolute bottom-0 right-0 w-8 h-8 bg-[#D81B60] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#C2185B] transition-colors border-2 border-white"
                                        >
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-[#1D1D2C]">{profile.name}</p>
                                        <p className="text-sm text-gray-500 font-medium mb-2">{user?.email}</p>
                                        <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-wider">Member</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                            className="w-full bg-[#F7F8FA] border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-[#D81B60] focus:bg-white transition-all shadow-inner-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                                        <textarea
                                            value={profile.bio}
                                            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                            rows={3}
                                            className="w-full bg-[#F7F8FA] border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-[#D81B60] focus:bg-white transition-all shadow-inner-sm resize-none"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveProfile}
                                    className="mt-10 flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white w-full md:w-auto px-10 py-4 rounded-2xl text-sm font-black transition-all shadow-lg shadow-pink-200 hover:-translate-y-1"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        )}

                        {/* ── NOTIFICATIONS ── */}
                        {activeSection === 'notifications' && (
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-card">
                                <h2 className="font-heading font-bold text-xl text-[#1D1D2C] mb-2">Notifications</h2>
                                <p className="text-sm text-gray-500 mb-8 font-medium">Choose how you want to stay updated.</p>

                                <div className="space-y-2">
                                    {[
                                        { key: 'email', label: 'Email Notifications', desc: 'Summary of your health data and insights' },
                                        { key: 'push', label: 'Push Notifications', desc: 'Real-time alerts for symptoms and logs' },
                                        { key: 'reminders', label: 'Daily Reminders', desc: 'Reminders to log your symptoms every evening' },
                                    ].map(({ key, label, desc }) => (
                                        <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
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
                                    className="mt-10 flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white w-full md:w-auto px-10 py-4 rounded-2xl text-sm font-black transition-all shadow-lg shadow-pink-200 hover:-translate-y-1"
                                >
                                    <Save size={18} /> Save Notification Settings
                                </button>
                            </div>
                        )}

                        {/* ── PRIVACY ── */}
                        {activeSection === 'privacy' && (
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-card">
                                <h2 className="font-heading font-bold text-xl text-[#1D1D2C] mb-2">Privacy &amp; Data</h2>
                                <p className="text-sm text-gray-500 mb-8 font-medium">Your data is safe, private, and encrypted.</p>

                                <div className="space-y-2">
                                    {[
                                        { key: 'data_sharing', label: 'Anonymous Data Sharing', desc: 'Contribute anonymized data to help women\'s health research' },
                                        { key: 'anonymous_by_default', label: 'Strict Anonymity', desc: 'Always hide my identity in any community features' },
                                    ].map(({ key, label, desc }) => (
                                        <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
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
                                    className="mt-10 flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white w-full md:w-auto px-10 py-4 rounded-2xl text-sm font-black transition-all shadow-lg shadow-pink-200 hover:-translate-y-1"
                                >
                                    <Save size={18} /> Update Privacy Settings
                                </button>
                            </div>
                        )}

                        {/* ── LANGUAGE ── */}
                        {activeSection === 'language' && (
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-card">
                                <h2 className="font-heading font-bold text-xl text-[#1D1D2C] mb-2">Language</h2>
                                <p className="text-sm text-gray-500 mb-8 font-medium">Choose your preferred reading experience.</p>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">App Language</label>
                                        <select
                                            value={language}
                                            onChange={e => setLanguage(e.target.value)}
                                            className="w-full bg-[#F7F8FA] border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-[#D81B60] focus:bg-white transition-all shadow-inner-sm appearance-none"
                                        >
                                            <option value="en">English (US)</option>
                                            <option value="hi">हिन्दी (Hindi)</option>
                                            <option value="mr">मराठी (Marathi)</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveLanguage}
                                    className="mt-10 flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white w-full md:w-auto px-10 py-4 rounded-2xl text-sm font-black transition-all shadow-lg shadow-pink-200 hover:-translate-y-1"
                                >
                                    <Save size={18} /> Update Language
                                </button>
                            </div>
                        )}

                        {/* ── APPEARANCE ── */}
                        {activeSection === 'appearance' && (
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-card">
                                <h2 className="font-heading font-bold text-xl text-[#1D1D2C] mb-2">Appearance</h2>
                                <p className="text-sm text-gray-500 mb-8 font-medium">Fine-tune the interface to match your style.</p>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-4">Accent Color</p>
                                        <div className="flex gap-4 flex-wrap">
                                            {ACCENT_COLORS.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setAccentColor(c)}
                                                    className={`w-12 h-12 rounded-full transition-all hover:scale-110 border-4 ${accentColor === c ? 'border-white ring-4 ring-[#D81B60]/20 scale-110' : 'border-transparent'}`}
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
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-card">
                                    <h2 className="font-heading font-bold text-xl text-[#1D1D2C] mb-2">Logout</h2>
                                    <p className="text-sm text-gray-500 mb-8 font-medium">Securely sign out of your current session.</p>
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                        }}
                                        className="w-full flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50 hover:bg-gray-100 transition-all group"
                                    >
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-base font-black text-[#1D1D2C]">Sign Out</span>
                                            <span className="text-xs text-gray-400 font-medium">from this device</span>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8">
                                    <h2 className="font-heading font-bold text-xl text-red-700 mb-2 flex items-center gap-2">
                                        <Trash2 size={20} /> Danger Zone
                                    </h2>
                                    <p className="text-sm text-red-600 mb-6 font-medium leading-relaxed">
                                        Deleting your account is permanent and will remove all your cycle history, logs, and community posts. This cannot be undone.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full md:w-auto px-10 py-4 rounded-2xl text-sm font-black transition-all shadow-lg shadow-red-100 hover:-translate-y-1"
                                    >
                                        <Trash2 size={18} /> Delete My Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default AccountSettings;
