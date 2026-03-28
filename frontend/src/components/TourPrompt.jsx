import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useTour } from '../context/TourContext';
import { useTranslation } from 'react-i18next';

const TourPrompt = () => {
    const { startTour, isTourActive } = useTour();
    const { t } = useTranslation();
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('petal_tour_completed');
        if (!hasSeenTour) {
            const timer = setTimeout(() => setShowPrompt(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    if (isTourActive || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-8 right-8 z-[60] bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 max-w-xs overflow-hidden"
            >
                {/* Background Sparkle Decoration */}
                <div className="absolute -top-4 -right-4 text-pink-50 opacity-20">
                    <Sparkles size={100} />
                </div>

                <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-[#D81B60] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-pink-100 animate-bounce">
                            🌸
                        </div>
                        <button 
                            onClick={() => {
                                setShowPrompt(false);
                                localStorage.setItem('petal_tour_completed', 'true');
                            }}
                            className="text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <h4 className="font-heading font-extrabold text-[#1D1D2C] text-lg mb-1">
                        {t('tour.promptTitle')}
                    </h4>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                        {t('tour.promptDesc')}
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setShowPrompt(false);
                                startTour();
                            }}
                            className="flex-1 bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            {t('tour.takeTour')}
                        </button>
                        <button
                            onClick={() => {
                                setShowPrompt(false);
                                localStorage.setItem('petal_tour_completed', 'true');
                            }}
                            className="px-4 py-3 rounded-xl border border-gray-100 text-gray-400 font-bold text-sm hover:bg-gray-50 transition-colors"
                        >
                            {t('tour.maybeLater')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TourPrompt;
