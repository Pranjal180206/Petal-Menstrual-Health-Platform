import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-white font-sans flex flex-col">
            <Navbar />
            
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />
            
            {/* Decorative Blur Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-pink-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
                <div className="max-w-2xl w-full text-center">
                    {/* 404 Number */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="mb-8"
                    >
                        <h1 className="text-[150px] md:text-[200px] font-heading font-black leading-none bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                            404
                        </h1>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-4 mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-lg text-slate-600 font-medium max-w-md mx-auto">
                            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
                        </p>
                    </motion.div>

                    {/* Decorative Element */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -10 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mb-12 flex justify-center"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center">
                                <Search className="w-16 h-16 text-pink-400" strokeWidth={2} />
                            </div>
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-pink-200 rounded-full -z-10 blur-xl"
                            />
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5" />
                            <span>Go Home</span>
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-pink-500 text-pink-500 font-bold rounded-full hover:bg-pink-50 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Go Back</span>
                        </button>
                    </motion.div>

                    {/* Helpful Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-16 pt-8 border-t border-slate-200"
                    >
                        <p className="text-sm font-semibold text-slate-500 mb-4">
                            You might be looking for:
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => navigate('/education')}
                                className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-full text-sm transition-all border border-slate-200"
                            >
                                Education Hub
                            </button>
                            <button
                                onClick={() => navigate('/community')}
                                className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-full text-sm transition-all border border-slate-200"
                            >
                                Community
                            </button>
                            <button
                                onClick={() => navigate('/cycle-tracker')}
                                className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-full text-sm transition-all border border-slate-200"
                            >
                                Cycle Tracker
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-full text-sm transition-all border border-slate-200"
                            >
                                Contact Us
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NotFound;
