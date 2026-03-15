import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PetalIcon from './PetalIcon';
import HeroIllustration from './HeroIllustration';
import { useTour } from '../context/TourContext';

const Hero = () => {
    const { startTour } = useTour();

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
            {/* Left Content */}
            <div className="flex-1 space-y-8 relative">
                {/* Sparkle decorative */}
                <div className="absolute -top-8 -left-8 text-pink-200 opacity-50">
                    <Sparkles size={48} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-[#FDF7F8] border border-pink-100 px-4 py-2 rounded-full text-brand-pink font-bold text-sm shadow-sm"
                >
                    <PetalIcon size={16} />
                    Your Cycle, Your Vibe ✨
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight"
                    data-tour-id="hero-title"
                >
                    Know Your <br /> Body, <span className="text-brand-pink text-gradient">Feel <br /> Amazing.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-brand-gray max-w-md leading-relaxed font-medium"
                >
                    The easy, friendly way to track your cycle, understand your moods, and get tips that actually make sense. 💖
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4"
                >
                    <button 
                        className="bg-gradient-pink hover:opacity-90 text-white px-8 py-4 rounded-full font-bold transition-all shadow-soft hover:-translate-y-1 hover:shadow-lg"
                        data-tour-id="hero-get-started"
                    >
                        Get Started
                    </button>
                    <button 
                        onClick={startTour}
                        className="bg-white border-2 border-gray-100 text-brand-dark hover:border-brand-pink hover:text-brand-pink px-8 py-3.5 rounded-full font-bold transition-all"
                    >
                        Take a Tour
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex items-center gap-3 pt-4"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <img
                                key={i}
                                src={`https://i.pravatar.cc/100?img=${i + 15}`}
                                alt="Avatar"
                                className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                            />
                        ))}
                    </div>
                    <p className="text-xs text-brand-gray font-bold">Join 50k+ friends on the journey 🌈</p>
                </motion.div>
            </div>

            {/* Right Illustration */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="flex-1 relative w-full h-full min-h-[450px] flex justify-center items-center"
            >
                <HeroIllustration />
                
                {/* Floating Badge */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 right-0 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-pink-50 max-w-[200px] z-20"
                >
                    <h4 className="text-brand-pink font-extrabold text-sm mb-1">Today's Vibe: Sparkling! ✨</h4>
                    <p className="text-[10px] text-brand-gray font-bold leading-tight">Your energy levels are high. Perfect time for that TikTok dance! 💃</p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
