import { useState, useCallback, useEffect } from 'react';
import { User, Trash2, ChevronRight, Save } from 'lucide-react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';

const SECTIONS = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
    { id: 'account', icon: <Trash2 size={18} />, label: 'Account', danger: true },
];

const AccountSettings = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [activeSection, setActiveSection] = useState('profile');
    const [toast, setToast] = useState(null);

    /* ── Profile State ── */
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        age: user?.age || '',
    });

    // Sync state on user change
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setProfile({ name: user.name || '', email: user.email || '', age: user.age || '' });
    }, [user, navigate]);

    useEffect(() => {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const handleSaveProfile = async () => {
        try {
            const res = await axiosInstance.patch('/users/profile', {
                name: profile.name,
                age: profile.age ? Number(profile.age) : null,
            });
            setUser(res.data);
            showToast('Profile saved successfully! ✓', 'success');
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            else showToast('Failed to save profile.', 'error');
        }
    };

    const handleDeleteAccount = () => {
        showToast('Account deletion requires email confirmation.', 'warning');
    };

    return (
        <div className="min-h-screen bg-[#F7F8FA] font-sans text-[#1D1D2C]">
            <Navbar />
            <div className="p-8 max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-heading font-extrabold text-[#1D1D2C] mb-1">{t('sidebar.accountSettings')}</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage your profile details and account access.</p>
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
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                        <input
                                            type="number"
                                            min={7}
                                            max={120}
                                            value={profile.age}
                                            onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                                            className="w-full bg-[#F7F8FA] border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-[#D81B60] focus:bg-white transition-all shadow-inner-sm"
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

                        {/* ── ACCOUNT ── */}
                        {activeSection === 'account' && (
                            <div className="space-y-6">
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
