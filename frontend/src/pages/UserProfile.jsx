import React, { useState, useEffect } from 'react';
import { LogOut, ChevronRight, Shield, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Toast from '../components/Toast';

const UserProfile = () => {
    const navigate = useNavigate();
    const { logout, setUser: setAuthUser } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [profileForm, setProfileForm] = useState({ name: '', age: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/users/profile');
                setUser(res.data);
                setProfileForm({
                    name: res.data?.name || '',
                    age: res.data?.age || '',
                });
            } catch (err) {
                console.error("Failed to load user profile:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleSaveProfile = async () => {
        try {
            const payload = {
                name: profileForm.name,
                age: profileForm.age === '' ? null : Number(profileForm.age),
            };
            const res = await axiosInstance.patch('/users/profile', payload);
            setUser(res.data);
            setAuthUser(res.data);
            showToast('Profile updated successfully!', 'success');
        } catch (err) {
            showToast('Failed to update profile.', 'error');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('Are you sure you want to schedule account deletion?');
        if (!confirmed) return;

        try {
            await axiosInstance.delete('/users/account');
            showToast('Account deletion has been scheduled.', 'warning');
        } catch (err) {
            showToast('Failed to delete account.', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] font-sans text-brand-dark">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <p className="text-gray-400 font-bold">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-brand-dark">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-12 space-y-6">

                {/* Profile Card */}
                <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-card border border-gray-100 flex flex-col sm:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-full bg-pink-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-pink-400 flex items-center justify-center text-white text-5xl font-bold">
                                    {user?.name?.[0]?.toUpperCase() ?? 'G'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-4xl font-heading font-extrabold mb-2 text-brand-dark tracking-tight">
                            {user?.name || 'User'}
                        </h1>
                        <p className="text-brand-gray font-medium mb-4 text-lg">{user?.email || ''}</p>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                            <span className="bg-pink-50 text-brand-pink text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-pink-100">
                                Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}
                            </span>
                            {user?.auth_provider === 'google' && (
                                <span className="bg-purple-50 text-purple-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-purple-100">
                                    Google Account
                                </span>
                            )}
                            {user?.age && (
                                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-blue-100">
                                    {user.age} yrs
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-[2rem] p-6 shadow-card border border-gray-100">
                    <h3 className="font-heading font-extrabold text-xl text-brand-dark mb-4 px-2">Account</h3>

                    <div className="space-y-2">
                        {user?.is_admin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <Shield size={18} />
                                </div>
                                <span className="font-bold text-sm text-brand-dark flex-1 text-left">Admin Dashboard</span>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600 transition-colors" />
                            </button>
                        )}

                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-card border border-gray-100 space-y-5">
                    <h3 className="font-heading font-extrabold text-xl text-brand-dark">Profile Settings</h3>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Name</label>
                        <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#D81B60]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Age</label>
                        <input
                            type="number"
                            min={7}
                            max={120}
                            value={profileForm.age}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, age: e.target.value }))}
                            className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#D81B60]"
                        />
                    </div>
                    <button
                        onClick={handleSaveProfile}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                        <Save size={16} />
                        Save Profile
                    </button>
                </div>

                <div className="bg-red-50 rounded-[2rem] p-6 border border-red-100">
                    <h3 className="font-heading font-extrabold text-xl text-red-700 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-600 mb-4">This action is permanent and cannot be undone.</p>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                        <Trash2 size={16} />
                        Delete My Account
                    </button>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-500 rounded-[2rem] p-5 flex items-center justify-center gap-3 font-bold transition-colors border border-red-100"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </main>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default UserProfile;
