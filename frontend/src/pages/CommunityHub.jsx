import React from 'react';
import { Droplet, Compass, Users, BookOpen, Search, Edit3, MoreHorizontal, Heart, MessageCircle, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CommunityHub = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1D1D2C]">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-pattern opacity-50 pointer-events-none" />

            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10 relative z-10">

                {/* Left Column - Feed */}
                <div className="flex-1 max-w-3xl">

                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-2">Teen Community Hub</h1>
                            <p className="text-gray-500 font-medium text-sm">A safe, anonymous space for our community to share and grow together.</p>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 bg-[#FF6B9A] hover:bg-[#FF8A8A] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-soft shrink-0">
                            <Edit3 size={16} /> Share Your Story
                        </button>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">

                        {/* Post 1 */}
                        <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#FF8A8A] flex items-center justify-center text-white font-bold">S</div>
                                    <div>
                                        <h4 className="font-bold text-sm">StarryNight</h4>
                                        <p className="text-xs text-gray-400 font-medium">2 hours ago</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <p className="text-[#4A4A5C] leading-relaxed mb-4">
                                Has anyone else noticed they get super emotional exactly 3 days before their period starts? I felt like crying over a dropped pencil today lol. 😭 Is this normal for first year?
                            </p>
                            <div className="flex gap-2 mb-6">
                                <span className="bg-[#F8F9FA] text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full">#PeriodFeelings</span>
                                <span className="bg-[#F8F9FA] text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full">#MoodSwings</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-1.5 bg-[#FFF0F4] text-[#FF6B9A] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-pink-100 transition-colors">
                                        <Heart size={14} fill="currentColor" strokeWidth={0} /> 24
                                    </button>
                                    <button className="flex items-center gap-1.5 bg-blue-50 text-blue-500 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors">
                                        🫂 12
                                    </button>
                                    <button className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-100 transition-colors">
                                        ✨ 8
                                    </button>
                                </div>
                                <button className="flex items-center gap-1.5 text-gray-500 text-xs font-bold hover:text-gray-700 transition-colors">
                                    <MessageCircle size={16} /> 5 Replies
                                </button>
                            </div>
                        </div>

                        {/* Post 2 */}
                        <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#A78BFA] flex items-center justify-center text-white font-bold">C</div>
                                    <div>
                                        <h4 className="font-bold text-sm">CloudChaser24</h4>
                                        <p className="text-xs text-gray-400 font-medium">5 hours ago</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <p className="text-[#4A4A5C] leading-relaxed mb-4">
                                Found a really cool heating pad that looks like a cat! It's making my cramps so much more bearable. Highly recommend finding "comfort buddies" for your cycle days. 🐈✨
                            </p>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-1.5 bg-[#FFF0F4] text-[#FF6B9A] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-pink-100 transition-colors">
                                        <Heart size={14} fill="currentColor" strokeWidth={0} /> 45
                                    </button>
                                    <button className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-green-100 transition-colors">
                                        🥰 18
                                    </button>
                                </div>
                                <button className="flex items-center gap-1.5 text-gray-500 text-xs font-bold hover:text-gray-700 transition-colors">
                                    <MessageCircle size={16} /> 12 Replies
                                </button>
                            </div>
                        </div>

                        {/* Post 3 */}
                        <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#34D399] flex items-center justify-center text-white font-bold">P</div>
                                    <div>
                                        <h4 className="font-bold text-sm">PizzaLover99</h4>
                                        <p className="text-xs text-gray-400 font-medium">Yesterday</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <p className="text-[#4A4A5C] leading-relaxed mb-4">
                                Is it weird that I'm actually excited about using my new tracker? I feel so organized knowing exactly when my phase changes. Knowledge is power! 🌸
                            </p>
                            <div className="flex gap-2 mb-6">
                                <span className="bg-[#F8F9FA] text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full">#TrackYourCycle</span>
                                <span className="bg-[#F8F9FA] text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full">#Empowerment</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-1.5 bg-orange-50 text-orange-500 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors">
                                        💪 56
                                    </button>
                                    <button className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-100 transition-colors">
                                        🔥 31
                                    </button>
                                </div>
                                <button className="flex items-center gap-1.5 text-gray-500 text-xs font-bold hover:text-gray-700 transition-colors">
                                    <MessageCircle size={16} /> 3 Replies
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <aside className="w-full lg:w-80 space-y-6">

                    {/* Trending Topics */}
                    <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
                        <h3 className="flex items-center gap-2 font-heading font-bold text-lg mb-6">
                            <TrendingUp className="text-[#FF6B9A]" size={20} /> Trending Topics
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <a href="#" className="font-bold text-sm hover:text-[#FF6B9A] transition-colors">#FirstPeriodTips</a>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">1.2k people sharing</p>
                            </div>
                            <div>
                                <a href="#" className="font-bold text-sm hover:text-[#FF6B9A] transition-colors">#CrampHacks</a>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">856 posts today</p>
                            </div>
                            <div>
                                <a href="#" className="font-bold text-sm hover:text-[#FF6B9A] transition-colors">#PeriodPositive</a>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">2.4k members active</p>
                            </div>
                            <div>
                                <a href="#" className="font-bold text-sm hover:text-[#FF6B9A] transition-colors">#MoodSupport</a>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">432 discussing now</p>
                            </div>
                        </div>

                        <button className="w-full mt-6 pt-4 border-t border-gray-100 text-xs font-bold text-[#FF6B9A] hover:underline">
                            View All Topics
                        </button>
                    </div>

                    {/* Safe Space Rules */}
                    <div className="bg-[#FFF5F7] rounded-3xl p-6">
                        <h3 className="font-heading font-bold text-lg mb-3">Safe Space Rules</h3>
                        <p className="text-xs text-[#4A4A5C] leading-relaxed mb-4 font-medium">
                            This is a moderated community. No judgment, just support. Keep it anonymous and kind!
                        </p>
                        <ul className="space-y-2.5">
                            <li className="flex items-start gap-2 text-xs font-bold text-[#FF6B9A]">
                                <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> Be Kind & Respectful
                            </li>
                            <li className="flex items-start gap-2 text-xs font-bold text-[#FF6B9A]">
                                <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> Stay Anonymous
                            </li>
                            <li className="flex items-start gap-2 text-xs font-bold text-[#FF6B9A]">
                                <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> Help Others Grow
                            </li>
                        </ul>
                    </div>

                    {/* Cycle Quiz Banner */}
                    <div className="bg-gradient-to-br from-[#FF6B9A] to-[#E11D48] rounded-3xl p-6 text-white text-center shadow-soft">
                        <div className="flex justify-center mb-3">
                            <Sparkles size={28} />
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2">Cycle Quiz</h3>
                        <p className="text-xs text-white/90 leading-relaxed mb-5 font-medium px-2">
                            Learn more about your unique patterns in just 2 minutes.
                        </p>
                        <button className="w-full bg-white text-[#E11D48] rounded-2xl py-3 font-bold text-sm hover:shadow-lg transition-all hover:scale-[1.02]">
                            Take Quiz
                        </button>
                    </div>

                </aside>
            </main>

            <div className="relative z-50">
                <Footer />
            </div>
        </div>
    );
};

export default CommunityHub;
