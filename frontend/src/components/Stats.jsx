import { motion } from 'framer-motion';
import { Sun, Users, Smile } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Stats = () => {
    const { t } = useTranslation();

    const statsData = [
        {
            icon: <Sun size={24} className="text-orange-400" />,
            label: t('stats.label1'),
            value: "85%",
            description: t('stats.desc1'),
            bgColor: "bg-orange-50"
        },
        {
            icon: <Users size={24} className="text-yellow-500" />,
            label: t('stats.label2'),
            value: "50K+",
            description: t('stats.desc2'),
            bgColor: "bg-yellow-50"
        },
        {
            icon: <Smile size={24} className="text-[#8B5E3C]" />,
            label: t('stats.label3'),
            value: "24/7",
            description: t('stats.desc3'),
            bgColor: "bg-[#F5EBE1]"
        }
    ];

    return (
        <section className="w-full bg-[#FFF5F7] py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, type: "spring" }}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(255,107,154,0.08)] border-4 border-white relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-pink-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className={`w-16 h-16 rounded-3xl ${stat.bgColor} flex items-center justify-center mb-6 rotate-3 group-hover:rotate-0 transition-transform shadow-inner`}>
                            {stat.icon}
                        </div>
                        <h5 className="text-[10px] font-extrabold text-[#D81B60] tracking-[0.2em] mb-3 uppercase">{stat.label}</h5>
                        <h2 className="text-6xl font-heading font-black text-[#FF6B9A] mb-4 tracking-tighter">{stat.value}</h2>
                        <p className="text-sm text-brand-gray font-bold px-4 leading-relaxed">{stat.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
