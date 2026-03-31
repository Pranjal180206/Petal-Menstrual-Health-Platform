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
