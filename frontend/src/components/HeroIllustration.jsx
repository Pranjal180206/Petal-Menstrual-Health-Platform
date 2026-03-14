import { motion } from 'framer-motion';

const HeroIllustration = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Background Glow/Circle */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute w-[80%] aspect-square bg-pink-100/50 rounded-full blur-3xl"
            />

            {/* Main Phone Container */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 w-64 md:w-80 h-[450px] md:h-[550px] bg-[#2D3142] rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800"
            >
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative flex flex-col items-center justify-center gap-8">
                    {/* Heart Icon */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-[#FF6B9A]"
                    >
                        <svg viewBox="0 0 24 24" className="w-24 h-24 fill-current">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </motion.div>

                    {/* Chart Bars */}
                    <div className="flex items-end gap-3 h-32">
                        {[
                            { color: '#FFB7C5', height: '60%' },
                            { color: '#FF6B9A', height: '100%' },
                            { color: '#FFD1DC', height: '40%' }
                        ].map((bar, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: bar.height }}
                                transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "backOut" }}
                                className="w-10 rounded-t-xl"
                                style={{ backgroundColor: bar.color }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Floating Orbs around the phone */}
            <motion.div
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-12 h-12 bg-yellow-400 rounded-full blur-sm opacity-60 z-0"
            />
            <motion.div
                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-green-300 rounded-full blur-sm opacity-60 z-0"
            />
            <motion.div
                animate={{ y: [0, -15, 0], x: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/3 right-1/4 w-10 h-10 bg-blue-300 rounded-full blur-sm opacity-60 z-0"
            />

            {/* Sparkles */}
            <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                className="absolute top-10 right-20 text-yellow-500"
            >
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
            </motion.div>
            <motion.div
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                className="absolute bottom-20 right-10 text-orange-400"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
            </motion.div>
        </div>
    );
};

export default HeroIllustration;
