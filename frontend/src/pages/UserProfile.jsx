import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const UserProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/users/profile');
                setUser(res.data);
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

                        <button
                            onClick={() => navigate('/cycle-tracker/settings')}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-pink flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                                <User size={18} />
                            </div>
                            <span className="font-bold text-sm text-brand-dark flex-1 text-left">Manage Settings</span>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-pink transition-colors" />
                        </button>
                    </div>
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
        </div>
    );
};

export default UserProfile;
