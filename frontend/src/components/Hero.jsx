import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PetalIcon from './PetalIcon';

const Hero = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 space-y-8 relative">
                {/* Sparkle decorative */}
                <div className="absolute -top-8 -left-8 text-pink-200 opacity-50">
                    <Sparkles size={48} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-[#FDF7F8] border border-pink-100 px-4 py-2 rounded-full text-brand-pink font-bold text-sm"
                >
                    <PetalIcon size={16} />
                    Your Cycle, Your Vibe
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-heading font-bold leading-[1.1]"
                >
                    Know Your <br /> Body, <span className="text-brand-pink">Feel <br /> Amazing.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-brand-gray max-w-md leading-relaxed"
                >
                    The easy, friendly way to track your cycle, understand your moods, and get tips that actually make sense.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4"
                >
                    <button className="bg-[#FF6B9A] hover:bg-[#FF8A8A] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-soft hover:-translate-y-1">
                        Get Started
                    </button>
                    <button className="bg-white border-2 border-gray-100 text-brand-dark hover:border-brand-pink hover:text-brand-pink px-8 py-3 rounded-full font-bold transition-all">
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
                                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full border-2 border-white object-cover object-center"
                            />
                        ))}
                    </div>
                    <p className="text-xs text-brand-gray font-semibold">Join 50k+ friends on the journey</p>
                </motion.div>
            </div>

            {/* Right Image/Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 relative w-full h-full min-h-[400px]"
            >
                <div className="bg-[#EBF4E5] rounded-[2.5rem] overflow-hidden relative shadow-card w-full aspect-square md:aspect-[4/3]">
                    {/* Placeholder for the doctor image */}
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop"
                        alt="Medical Professionals"
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay Card */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg">
                        <h4 className="text-brand-pink font-bold text-sm mb-1">Today's Vibe: Sparkling! ✨</h4>
                        <p className="text-xs text-brand-gray">Your energy levels are high. Perfect time for that TikTok dance or a long walk.</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
