import { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { useTour } from '../context/TourContext';
import { useTranslation } from 'react-i18next';

const TourOverlay = () => {
    const { isTourActive, currentStep, nextStep, endTour, currentStepIndex } = useTour();
    const { t } = useTranslation();
    const [bounds, setBounds] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const updateBounds = () => {
        if (!currentStep) return;
        const el = document.querySelector(`[data-tour-id="${currentStep.selector}"]`);
        if (el) {
            const rect = el.getBoundingClientRect();
            setBounds({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            setBounds({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 });
        }
    };

    useLayoutEffect(() => {
        if (isTourActive) {
            const timer = setTimeout(updateBounds, 300);
            window.addEventListener('resize', updateBounds);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updateBounds);
            };
        }
    }, [isTourActive, currentStepIndex]);

    if (!isTourActive || !currentStep) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {/* Dark Mask with hole */}
            <div 
                className="absolute inset-0 bg-black/60 transition-all duration-500 ease-in-out"
                style={{
                    clipPath: `polygon(
                        0% 0%, 0% 100%, 100% 100%, 100% 0%, 
                        ${bounds.left}px 0%, 
                        ${bounds.left}px ${bounds.top}px, 
                        ${bounds.left + bounds.width}px ${bounds.top}px, 
                        ${bounds.left + bounds.width}px ${bounds.top + bounds.height}px, 
                        ${bounds.left}px ${bounds.top + bounds.height}px, 
                        ${bounds.left}px ${bounds.top}px, 
                        0% ${bounds.top}px
                    )`
                }}
            />

            {/* Click blocking layer */}
            <div className="absolute inset-0 pointer-events-auto bg-transparent" onClick={(e) => e.stopPropagation()} />

            {/* Pulse highlight */}
            {bounds.width > 0 && (
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute border-4 border-white rounded-2xl pointer-events-none"
                    style={{
                        top: bounds.top - 8,
                        left: bounds.left - 8,
                        width: bounds.width + 16,
                        height: bounds.height + 16,
                    }}
                />
            )}

            {/* Modal Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute pointer-events-auto bg-white rounded-[2rem] p-8 shadow-2xl border border-pink-100 max-w-sm"
                    style={{
                        top: bounds.top + bounds.height > window.innerHeight - 300 
                            ? bounds.top - 280 
                            : bounds.top + bounds.height + 24,
                        left: Math.max(20, Math.min(window.innerWidth - 380, bounds.left + bounds.width / 2 - 180)),
                    }}
                >
                    {/* Mascot / Avatar */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#D81B60] to-[#F06292] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-3xl animate-bounce">🌸</span>
                    </div>

                    <div className="pt-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles size={16} className="text-[#D81B60]" />
                            <h3 className="text-xl font-heading font-extrabold text-[#1D1D2C]">
                                {currentStep.title}
                            </h3>
                            <Sparkles size={16} className="text-[#D81B60]" />
                        </div>
                        
                        <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8">
                            {currentStep.content}
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={endTour}
                                className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 bg-gray-100 text-gray-800 font-bold text-sm hover:bg-gray-200 transition-colors shadow-sm"
                            >
                                {t('tour.skip')}
                            </button>
                            <button
                                onClick={nextStep}
                                className="flex-[2] py-3 px-4 rounded-xl bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold text-sm shadow-soft transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                {currentStep.nextLabel}
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="flex justify-center gap-1.5 mt-8">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        i <= currentStepIndex ? 'w-4 bg-[#D81B60]' : 'w-2 bg-gray-100'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={endTour}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TourOverlay;
