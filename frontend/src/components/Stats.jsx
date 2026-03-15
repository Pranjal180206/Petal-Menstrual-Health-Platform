import { motion } from 'framer-motion';
import { Sun, Users, Smile } from 'lucide-react';

const statsData = [
    {
        icon: <Sun size={24} className="text-orange-400" />,
        label: "HAPPINESS BOOST",
        value: "85%",
        description: "Feel more confident about their health",
        bgColor: "bg-orange-50"
    },
    {
        icon: <Users size={24} className="text-yellow-500" />,
        label: "COMMUNITY",
        value: "50K+",
        description: "Students and teens sharing insights",
        bgColor: "bg-yellow-50"
    },
    {
        icon: <Smile size={24} className="text-[#8B5E3C]" />,
        label: "SUPPORT",
        value: "24/7",
        description: "Expert advice whenever you need it",
        bgColor: "bg-[#F5EBE1]"
    }
];

const Stats = () => {
    return (
        <section className="w-full bg-[#FFF5F7] py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-white rounded-[2rem] p-10 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(255,107,154,0.05)] border border-pink-50"
                    >
                        <div className={`w-14 h-14 rounded-full ${stat.bgColor} flex items-center justify-center mb-6`}>
                            {stat.icon}
                        </div>
                        <h5 className="text-xs font-bold text-brand-gray tracking-wider mb-2">{stat.label}</h5>
                        <h2 className="text-5xl font-heading font-bold text-[#FF6B9A] mb-4">{stat.value}</h2>
                        <p className="text-sm text-brand-gray">{stat.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
