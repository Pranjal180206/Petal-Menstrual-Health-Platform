import { motion } from 'framer-motion';
import { FileEdit, Search, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
    const { t } = useTranslation();

    const stepsData = [
        {
            icon: <FileEdit size={28} className="text-blue-500" />,
            iconBg: "bg-blue-50",
            title: t('howItWorks.step1Title'),
            description: t('howItWorks.step1Desc'),
        },
        {
            icon: <Search size={28} className="text-slate-600" />,
            iconBg: "bg-slate-100",
            title: t('howItWorks.step2Title'),
            description: t('howItWorks.step2Desc'),
        },
        {
            icon: <Award size={28} className="text-yellow-500" />,
            iconBg: "bg-yellow-50",
            title: t('howItWorks.step3Title'),
            description: t('howItWorks.step3Desc'),
        }
    ];

    return (
        <section className="w-full py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col items-center">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-heading font-bold text-brand-dark mb-6"
                    >
                        {t('howItWorks.heading')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-brand-gray text-lg"
                    >
                        {t('howItWorks.subheading')}
                    </motion.p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {stepsData.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-[2rem] p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-start"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-8`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-heading font-bold text-brand-dark mb-4">{step.title}</h3>
                            <p className="text-brand-gray leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;
