import { useState, useCallback } from 'react';
import { User, Bell, Shield, Palette, Trash2, ChevronRight, Camera, Save } from 'lucide-react';
import Toast from '../components/Toast';

const SECTIONS = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
    { id: 'cycle', icon: <span className="text-base">🌸</span>, label: 'Cycle Preferences' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'privacy', icon: <Shield size={18} />, label: 'Privacy & Data' },
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
    const [activeSection, setActiveSection] = useState('profile');
    const [toast, setToast] = useState(null);

    /* ── Profile State ── */
    const [profile, setProfile] = useState({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        birthdate: '2000-05-15',
        bio: 'Tracking my cycle for better health insights.',
    });

    /* ── Cycle Preferences ── */
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);
    const [lutealLength, setLutealLength] = useState(14);

    /* ── Notifications ── */
    const [notifs, setNotifs] = useState({
        periodReminder: true,
        ovulationAlert: true,
        dailyLogReminder: true,
        weeklyInsights: false,
        riskAlerts: true,
        emailDigest: false,
    });

    /* ── Privacy ── */
    const [privacy, setPrivacy] = useState({
        anonymousAnalytics: true,
        dataSharing: false,
        cloudBackup: true,
    });

    /* ── Appearance ── */
    const [darkMode, setDarkMode] = useState(false);
    const [accentColor, setAccentColor] = useState('#D81B60');

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const handleSaveProfile = () => {
        // TODO: PATCH /api/user/profile when backend is connected
        showToast('Profile saved successfully! ✓', 'success');
    };

    const handleSaveCycle = () => {
        // TODO: PATCH /api/user/cycle-preferences when backend is connected
        showToast('Cycle preferences updated! ✓', 'success');
    };

    const handleSaveNotifs = () => {
        // TODO: PATCH /api/user/notifications when backend is connected
        showToast('Notification settings saved! ✓', 'success');
    };

    const handleSavePrivacy = () => {
        // TODO: PATCH /api/user/privacy when backend is connected
        showToast('Privacy settings updated! ✓', 'success');
    };

    const handleDeleteAccount = () => {
        showToast('Account deletion requires email confirmation. Feature available when backend connects.', 'warning');
    };

    const ACCENT_COLORS = ['#D81B60', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#009688', '#FF5722'];

    return (
        <div className="p-8 max-w-5xl mx-auto">

            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C] mb-1">Settings</h1>
                <p className="text-sm text-gray-500 font-medium">Manage your account, preferences, and privacy.</p>
            </header>

            <div className="flex gap-6">

                {/* Left Nav */}
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

                {/* Right Panel */}
                <div className="flex-1 space-y-4">

                    {/* ── PROFILE ── */}
                    {activeSection === 'profile' && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-6">Profile Information</h2>

                            {/* Avatar */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img src="https://i.pravatar.cc/100?img=5" alt="Profile" className="w-20 h-20 rounded-full border-4 border-[#FCE4EC]" />
                                    <button
                                        onClick={() => showToast('Photo upload available when backend connects.', 'info')}
                                        className="absolute bottom-0 right-0 w-7 h-7 bg-[#D81B60] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C2185B] transition-colors"
                                    >
                                        <Camera size={12} />
                                    </button>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1D1D2C]">{profile.name}</p>
                                    <p className="text-sm text-gray-500">Pro Member</p>
                                    <button
                                        onClick={() => showToast('Photo upload available when backend connects.', 'info')}
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
                                        value={profile.email}
                                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                        className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={profile.birthdate}
                                        onChange={e => setProfile(p => ({ ...p, birthdate: e.target.value }))}
                                        className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
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

                            <div className="mt-6 p-4 bg-[#FFF0F4] rounded-xl">
                                <p className="text-xs font-bold text-[#D81B60] mb-1">📅 Based on your settings</p>
                                <p className="text-xs text-gray-600">
                                    Your estimated ovulation window: Day <strong>{cycleLength - lutealLength - 1}</strong> – <strong>{cycleLength - lutealLength + 1}</strong>
                                </p>
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
                                    { key: 'periodReminder', label: 'Period Reminder', desc: '2 days before your predicted period' },
                                    { key: 'ovulationAlert', label: 'Ovulation Alert', desc: 'Notify me when entering my fertility window' },
                                    { key: 'dailyLogReminder', label: 'Daily Log Reminder', desc: 'Evening reminder to log symptoms' },
                                    { key: 'weeklyInsights', label: 'Weekly Insights Digest', desc: 'A summary of your weekly health data' },
                                    { key: 'riskAlerts', label: 'Risk Alerts', desc: 'Alerts when patterns show elevated risk' },
                                    { key: 'emailDigest', label: 'Email Digest', desc: 'Monthly report sent to your email' },
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
                                    { key: 'anonymousAnalytics', label: 'Anonymous Analytics', desc: 'Help improve Petal by sharing anonymous usage data' },
                                    { key: 'dataSharing', label: 'Data Sharing with Researchers', desc: 'Contribute anonymized cycle data to health research' },
                                    { key: 'cloudBackup', label: 'Cloud Backup', desc: 'Securely back up your cycle data to the cloud' },
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

                            <div className="mt-6 p-4 bg-[#F0F9FF] rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-700 mb-1">🔒 Your data is yours</p>
                                <p className="text-xs text-blue-600 font-medium">
                                    Petal never sells your health data. All exports are encrypted and you can delete your data at any time.
                                </p>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={handleSavePrivacy}
                                    className="flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                                >
                                    <Save size={16} /> Save Privacy Settings
                                </button>
                                <button
                                    onClick={() => showToast('Data export request submitted — available when backend connects.', 'info')}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Export My Data
                                </button>
                            </div>
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
                                        onChange={(v) => {
                                            setDarkMode(v);
                                            showToast('Dark mode will be fully available in a future update.', 'info');
                                        }}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#1D1D2C] mb-1">Accent Color</p>
                                    <p className="text-xs text-gray-400 mb-3">Choose your primary app color</p>
                                    <div className="flex gap-3 flex-wrap">
                                        {ACCENT_COLORS.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => { setAccentColor(c); showToast('Color theme will apply in full after backend integration.', 'info'); }}
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
                                        onClick={() => showToast('Password reset email sent — available when backend connects.', 'info')}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold text-[#1D1D2C]"
                                    >
                                        <span>Change Password</span>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => showToast('Signed out successfully.', 'success')}
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
