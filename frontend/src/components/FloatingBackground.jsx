import { motion } from 'framer-motion';

const FloatingBackground = () => {
    // Generate some random elements
    const elements = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 40 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        color: ['#FF6B9A', '#FFB7C5', '#FFD1DC', '#FFCC33', '#A1E3D8'][Math.floor(Math.random() * 5)],
        type: Math.random() > 0.5 ? 'circle' : 'star'
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: [0.2, 0.4, 0.2],
                        y: ['0vh', '100vh'],
                        x: [`${el.x}vw`, `${el.x + (Math.random() * 10 - 5)}vw`],
                        rotate: [0, 360]
                    }}
                    transition={{ 
                        duration: el.duration, 
                        repeat: Infinity, 
                        delay: el.delay,
                        ease: "linear"
                    }}
                    className="absolute"
                    style={{ 
                        width: el.size, 
                        height: el.size, 
                        left: `${el.x}%`,
                        top: '-10%'
                    }}
                >
                    {el.type === 'circle' ? (
                        <div 
                            className="w-full h-full rounded-full blur-[2px]" 
                            style={{ backgroundColor: el.color }}
                        />
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current" style={{ color: el.color }}>
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingBackground;
