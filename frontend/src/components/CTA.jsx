import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CTA = () => {
    const { t } = useTranslation();
    return (
        <section className="w-full px-6 py-12 bg-white pb-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#FF6B9A] to-[#FF8A8A] p-12 md:p-20 text-center text-white shadow-soft relative overflow-hidden"
            >
                {/* Decorative corner curve */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-br-full"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-10">
                        {t('cta.subtitle')}
                    </p>
                    <Link to="/login" className="inline-block bg-white text-[#FF6B9A] px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all hover:scale-105">
                        {t('cta.button')}
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

export default CTA;
