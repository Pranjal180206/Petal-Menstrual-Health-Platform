import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PetalIcon from '../components/PetalIcon';

const Login = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-[#1D1D2C]">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />

            {/* Decorative Blur Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[40%] bg-pink-50/80 rounded-full blur-3xl opacity-60 pointer-events-none" />

            {/* Header */}
            <header className="w-full px-8 py-6 flex justify-between items-center relative z-10">
                <Link to="/" className="flex items-center gap-3">
                    <div className="text-[#FF6B9A]">
                        <PetalIcon size={28} />
                    </div>
                    <span className="font-heading font-extrabold text-2xl tracking-tight">Petal</span>
                </Link>
                <div className="text-sm font-semibold text-gray-500">
                    Need help? <Link to="/contact" className="text-[#FF6B9A] hover:underline">Ask an adult</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">

                {/* Left Column - Copy & Image */}
                <div className="flex-1 space-y-8 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#FFF5F7] px-4 py-2 rounded-full text-[#FF6B9A] font-bold text-sm"
                    >
                        <Sparkles size={16} />
                        For Teens, By Experts
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-heading font-extrabold leading-[1.1] tracking-tight"
                    >
                        Your body is <br />
                        <span className="text-[#FF6B9A]">amazing.</span> Let's <br />
                        track its rhythms.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[#4A4A5C] leading-relaxed max-w-md font-medium"
                    >
                        Join a community of 50,000+ others learning about their cycle health in a safe, private space.
                    </motion.p>

                    {/* Image Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-md bg-[#FFF5F7] rounded-[2.5rem] p-4 mt-8"
                    >
                        <div className="rounded-[2rem] overflow-hidden bg-gray-100 aspect-[16/9] relative">
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60"
                                alt="Medical Professionals"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Login Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-[3rem] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-heading font-extrabold mb-3">Welcome back! 👋</h2>
                            <p className="text-gray-500 font-medium">We missed you! Log in to see your updates.</p>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1D1D2C] ml-1">Username or Email</label>
                                <input
                                    type="text"
                                    placeholder="your_cool_name"
                                    className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-[#1D1D2C]">Password</label>
                                    <Link to="/contact" className="text-xs font-bold text-[#FF6B9A] hover:underline">Forgot?</Link>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#F8F9FA] border border-transparent focus:border-[#FF6B9A] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-gray-400 font-medium text-[#1D1D2C]"
                                />
                            </div>

                            <div className="flex items-center gap-3 ml-1 pt-2">
                                <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#FF6B9A]">
                                    {/* Custom checkbox empty state */}
                                </div>
                                <span className="text-sm font-semibold text-[#4A4A5C]">Keep me logged in</span>
                            </div>

                            <div className="pt-4">
                                <button type="button" className="w-full bg-[#FF6B9A] hover:bg-[#FF8A8A] text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-[0_8px_20px_-6px_rgba(255,107,154,0.4)] hover:-translate-y-0.5">
                                    Let's Go!
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center space-y-4">
                            <p className="text-sm font-semibold text-gray-500">First time here?</p>
                            <button type="button" className="w-full bg-white border-2 border-[#FF6B9A] text-[#FF6B9A] hover:bg-[#FFF5F7] rounded-2xl py-3.5 font-bold transition-all">
                                Create an Account
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#8C8C9A] uppercase">
                            <Lock size={12} />
                            <span>Encrypted & Private</span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 font-medium mt-8 max-w-xs mx-auto leading-relaxed">
                        By logging in, you agree to our <Link to="/privacy" className="underline">Teen Privacy Policy</Link> and <Link to="/terms" className="underline">Terms of Service</Link>.
                    </p>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-100 bg-white/50 py-6 px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="bg-[#FF6B9A] p-1 rounded-md text-white">
                        <Lock size={12} />
                    </div>
                    <span>Safe Space Certified</span>
                </div>

                <div className="flex gap-6">
                    <Link to="/contact" className="hover:text-[#FF6B9A] transition-colors">Help Center</Link>
                    <Link to="/contact" className="hover:text-[#FF6B9A] transition-colors">Contact</Link>
                    <Link to="/education" className="hover:text-[#FF6B9A] transition-colors">Parent Guide</Link>
                </div>

                <div>
                    © 2024 Petal Platform
                </div>
            </footer>
        </div>
    );
};

export default Login;
