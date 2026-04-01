import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroIllustration from './HeroIllustration';
import { useTour } from '../context/TourContext';

const Hero = () => {
    const tourContext = useTour();
    const { t } = useTranslation();

    // Debug the tour context
    console.log('Tour context:', tourContext);

    const handleTourClick = () => {
        console.log('Tour button clicked!');
        alert('Button clicked! Checking tour context...');
        if (tourContext && tourContext.startTour && typeof tourContext.startTour === 'function') {
            console.log('Calling startTour...');
            tourContext.startTour();
        } else {
            console.error('Tour context or startTour is not available:', tourContext);
            alert('Tour context is not available. Check console for details.');
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center gap-12 overflow-hidden relative z-20">
            <div className="w-full space-y-8 text-center flex flex-col items-center relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight"
                    data-tour-id="hero-title"
                >
                    {t('hero.title1')} <br /> {t('hero.title2')} <br /> <span className="text-brand-pink text-gradient">{t('hero.title3')} {t('hero.title4')}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-brand-gray max-w-2xl leading-relaxed font-medium"
                >
                    {t('hero.subtitle')}
                </motion.p>

                <div>
                    <button
                        type="button"
                        onClick={handleTourClick}
                        className="bg-white border-2 border-brand-pink text-brand-dark hover:bg-brand-pink hover:text-white px-12 py-4 text-lg rounded-full font-bold transition-all shadow-md cursor-pointer relative z-50"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {t('hero.takeTour')}
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="w-full max-w-md flex justify-center items-center"
            >
                <HeroIllustration />
            </motion.div>
        </section>
    );
};

export default Hero;
