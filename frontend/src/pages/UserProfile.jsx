import React from 'react';
import { User, Settings, LogOut, ChevronRight, Calendar as CalendarIcon, Droplets, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserProfile = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-brand-dark">
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col xl:flex-row gap-8">
                
                {/* Left Column: Profile Info & Trackers */}
                <div className="flex-1 space-y-8">
                    
                    {/* Header Section */}
                    <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-card border border-gray-100 flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center text-orange-400 border-4 border-white shadow-lg shadow-orange-100">
                                <span className="text-6xl">👩</span>
                            </div>
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-brand-dark hover:text-brand-pink transition-colors">
                                <span className="text-xs">✏️</span>
                            </button>
                        </div>
                        
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold mb-2 text-brand-dark tracking-tight">Alex Johnson</h1>
                            <p className="text-brand-gray font-medium mb-5 text-lg">alex.johnson@example.com</p>
                            
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                <span className="bg-pink-50 text-brand-pink text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-pink-100">
                                    Member since 2024
                                </span>
                                <span className="bg-purple-50 text-purple-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-purple-100">
                                    Premium User
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Trackers Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Period Tracker Widget */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-heading font-extrabold text-2xl flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-pink-50 text-brand-pink flex items-center justify-center">
                                        <Droplets size={20} />
                                    </span>
                                    Period Tracker
                                </h3>
                                <Link to="/dashboard/tracker" className="text-sm font-bold text-gray-400 hover:text-brand-pink transition-colors flex items-center gap-1">
                                    Details <ChevronRight size={16} />
                                </Link>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="relative w-40 h-40 mb-4">
                                    {/* Circular Progress Mockup */}
                                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FCE4EC" strokeWidth="10" />
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#D81B60" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="180" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="font-heading font-extrabold text-3xl text-brand-dark">Day 8</span>
                                        <span className="text-xs font-bold text-brand-pink tracking-wider uppercase mt-1">Of 28</span>
                                    </div>
                                </div>
                                <p className="text-center font-bold text-brand-gray">Expected in <span className="text-brand-dark text-lg">20 days</span></p>
                            </div>

                            <button className="w-full mt-4 bg-brand-pink hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-pink-200 flex items-center justify-center gap-2">
                                <CalendarIcon size={18} /> Log Period
                            </button>
                        </div>

                        {/* Mood Tracker Widget */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-heading font-extrabold text-2xl flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                        <Smile size={20} />
                                    </span>
                                    Mood Tracker
                                </h3>
                                <Link to="/dashboard/tracker" className="text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1">
                                    History <ChevronRight size={16} />
                                </Link>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <h4 className="text-center font-bold text-brand-dark mb-6 text-lg">How are you feeling today?</h4>
                                
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <button className="flex flex-col items-center gap-2 group">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-transparent group-hover:border-orange-200 group-hover:bg-orange-50 flex items-center justify-center transition-all shadow-sm">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">🙂</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-orange-500">Fine</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 group">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-transparent group-hover:border-purple-200 group-hover:bg-purple-50 flex items-center justify-center transition-all shadow-sm">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">😫</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-purple-500">Tired</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 group">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-transparent group-hover:border-blue-200 group-hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">😢</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-blue-500">Sad</span>
                                    </button>
                                </div>
                            </div>

                            <button className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                                <span className="text-xl leading-none">+</span> Add Custom Mood
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Sidebar */}
                <div className="w-full xl:w-80 flex flex-col gap-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-card border border-gray-100">
                        <h3 className="font-heading font-extrabold text-xl text-brand-dark mb-6 px-2">Settings</h3>
                        
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <User size={18} />
                                </div>
                                <span className="font-bold text-sm text-brand-dark flex-1 text-left">Account Info</span>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-pink transition-colors" />
                            </button>
                            
                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <Settings size={18} />
                                </div>
                                <span className="font-bold text-sm text-brand-dark flex-1 text-left">Preferences</span>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-pink transition-colors" />
                            </button>
                        </div>
                    </div>

                    <button className="bg-red-50 hover:bg-red-100 text-red-500 rounded-[2rem] p-6 flex items-center justify-center gap-3 font-bold transition-colors border border-red-100">
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
