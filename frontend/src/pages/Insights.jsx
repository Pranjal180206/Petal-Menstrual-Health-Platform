import { useState } from 'react';
import { Lightbulb, Droplets, Sun, Zap, Moon, Info, ChevronDown, ChevronUp, TrendingUp, Heart } from 'lucide-react';

const PHASES = [
    {
        id: 'menstrual',
        phase: 'Menstrual',
        days: 'Days 1 – 5',
        color: '#D81B60',
        bg: '#FFF0F4',
        icon: <Droplets size={20} />,
        energy: 30,
        tip: 'Prioritize rest and warmth. Iron-rich foods like lentils and spinach help replenish what\'s lost.',
        details: [
            'Estrogen and progesterone are at their lowest.',
            'The uterine lining is shedding.',
            'Light yoga, walking, or rest recommended.',
            'Increase iron intake: spinach, legumes, red meat.',
        ],
    },
    {
        id: 'follicular',
        phase: 'Follicular',
        days: 'Days 6 – 13',
        color: '#E91E63',
        bg: '#FCE4EC',
        icon: <Sun size={20} />,
        energy: 75,
        tip: 'Estrogen is rising — a great time for challenging workouts, creative work, and social plans.',
        details: [
            'Follicle-stimulating hormone (FSH) is active.',
            'Estrogen gradually increases energy and mood.',
            'Best phase for strength training and high-intensity workouts.',
            'Great time for creative projects and social engagements.',
        ],
    },
    {
        id: 'ovulatory',
        phase: 'Ovulatory',
        days: 'Days 14 – 16',
        color: '#8E24AA',
        bg: '#F3E5F5',
        icon: <Zap size={20} />,
        energy: 100,
        tip: 'Peak energy and confidence. Lean into high-intensity workouts and important conversations.',
        details: [
            'Luteinizing hormone (LH) triggers egg release.',
            'Testosterone peaks — highest libido and confidence.',
            'Peak performance for athletic and cognitive tasks.',
            'Most fertile window of the cycle.',
        ],
    },
    {
        id: 'luteal',
        phase: 'Luteal',
        days: 'Days 17 – 28',
        color: '#5C6BC0',
        bg: '#E8EAF6',
        icon: <Moon size={20} />,
        energy: 50,
        tip: 'Progesterone rises then falls. Magnesium-rich foods and gentle yoga can ease PMS symptoms.',
        details: [
            'Progesterone rises to support potential pregnancy.',
            'PMS symptoms may appear in the late luteal phase.',
            'Prefer moderate exercise: yoga, pilates, cycling.',
            'Magnesium-rich foods (dark chocolate, nuts) can reduce PMS.',
        ],
    },
];

const PATTERNS = [
    {
        title: 'Cramps Peak on Day 2',
        desc: 'Consistent data shows your cramps peak on Day 2. Consider ibuprofen before onset or a heat pad.',
        icon: <Heart size={16} />,
        badge: 'Pattern Detected',
        badgeBg: '#FFF0F4',
        badgeColor: '#D81B60',
    },
    {
        title: 'Mood Dip Before Period',
        desc: '7 days before your period, you log significantly lower mood. This aligns with late-luteal PMDD patterns.',
        icon: <TrendingUp size={16} />,
        badge: 'Recurring Trend',
        badgeBg: '#FFFBF0',
        badgeColor: '#F59E0B',
    },
    {
        title: 'Hydration Linked to Fatigue',
        desc: 'On days with low hydration notes, fatigue scores are 2× higher. Try setting a daily water target.',
        icon: <Droplets size={16} />,
        badge: 'Correlation Found',
        badgeBg: '#E8F5E9',
        badgeColor: '#2E7D32',
    },
];

const EnergyBar = ({ value, color }) => (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
);

const Insights = () => {
    const [activePhase, setActivePhase] = useState('follicular');
    const [expandedPattern, setExpandedPattern] = useState(null);

    const currentPhase = PHASES.find(p => p.id === activePhase);

    return (
        <div className="p-8 max-w-6xl mx-auto">

            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">Personalized Insights</h1>
                        <p className="text-sm text-gray-500 font-medium">Based on your last 6 months of cycle data</p>
                    </div>
                </div>
            </header>

            {/* Current Phase Banner — updates on card click */}
            <div
                className="rounded-[1.5rem] p-6 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-md transition-all duration-500"
                style={{ background: `linear-gradient(135deg, ${currentPhase.color}, ${currentPhase.color}AA)` }}
            >
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-bl-full pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10 shrink-0 text-white">
                    {currentPhase.icon}
                </div>
                <div className="z-10 flex-1">
                    <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">You are currently in</p>
                    <h2 className="text-2xl font-heading font-extrabold mb-1">{currentPhase.phase} Phase</h2>
                    <p className="text-white/90 text-sm font-medium">{currentPhase.days} · {currentPhase.tip}</p>
                </div>
                <div className="hidden md:block z-10 text-center">
                    <span className="text-4xl font-heading font-extrabold">{currentPhase.energy}</span>
                    <p className="text-white/80 text-xs font-bold tracking-wider uppercase mt-1">Energy Level</p>
                    <div className="w-28 h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${currentPhase.energy}%` }} />
                    </div>
                </div>
            </div>

            {/* Phase Cards — clickable */}
            <section className="mb-8">
                <h2 className="text-lg font-heading font-extrabold text-[#1D1D2C] mb-4 flex items-center gap-2">
                    Cycle Phase Overview
                    <Info size={14} className="text-gray-400" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PHASES.map(p => {
                        const isActive = activePhase === p.id;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setActivePhase(p.id)}
                                className={`text-left bg-white border-2 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                                    isActive ? 'border-[#D81B60] ring-2 ring-[#D81B60]/20' : 'border-gray-100'
                                }`}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: p.bg, color: p.color }}
                                >
                                    {p.icon}
                                </div>
                                <h3 className="font-heading font-bold text-base text-[#1D1D2C]">{p.phase}</h3>
                                <p className="text-[11px] font-bold text-gray-400 mb-2">{p.days}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{p.tip}</p>
                                <EnergyBar value={p.energy} color={p.color} />
                                <p className="text-[10px] font-bold text-gray-400 mt-1">Avg. Energy {p.energy}%</p>
                                {isActive && (
                                    <p className="text-[9px] font-extrabold text-[#D81B60] uppercase tracking-wider mt-2">
                                        ● Currently Viewing
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Phase Details Panel */}
            <section className="mb-8">
                <div
                    className="rounded-2xl p-6 border"
                    style={{ background: currentPhase.bg + '60', borderColor: currentPhase.color + '30' }}
                >
                    <h2 className="font-heading font-bold text-base mb-4" style={{ color: currentPhase.color }}>
                        {currentPhase.phase} Phase — What's Happening
                    </h2>
                    <ul className="space-y-2">
                        {currentPhase.details.map((d, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5"
                                    style={{ background: currentPhase.color }}>
                                    {i + 1}
                                </span>
                                {d}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* AI-Detected Patterns */}
            <section className="mb-8">
                <h2 className="text-lg font-heading font-extrabold text-[#1D1D2C] mb-4">AI-Detected Patterns</h2>
                <div className="space-y-3">
                    {PATTERNS.map((item, i) => (
                        <div key={item.title} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <button
                                className="w-full flex items-start gap-4 p-5 hover:bg-[#FAFAFA] transition-colors text-left"
                                onClick={() => setExpandedPattern(expandedPattern === i ? null : i)}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: item.badgeBg, color: item.badgeColor }}
                                >
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-sm text-[#1D1D2C]">{item.title}</h3>
                                        <span
                                            className="text-[9px] font-extrabold tracking-widest px-2 py-1 rounded uppercase"
                                            style={{ background: item.badgeBg, color: item.badgeColor }}
                                        >
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                                <span className="text-gray-400 shrink-0 mt-1">
                                    {expandedPattern === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </span>
                            </button>
                            {expandedPattern === i && (
                                <div className="px-5 pb-5 pt-0">
                                    <div
                                        className="rounded-xl p-4 text-sm font-medium"
                                        style={{ background: item.badgeBg, color: item.badgeColor }}
                                    >
                                        <p className="font-bold mb-1">💡 Recommendation</p>
                                        <p className="opacity-90">{item.desc} Track this pattern over 2 more cycles to confirm. If it persists, consider sharing this data with your healthcare provider using the Report Generator.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 30-Day Chart */}
            <section>
                <h2 className="text-lg font-heading font-extrabold text-[#1D1D2C] mb-4">30-Day Mood &amp; Energy Snapshot</h2>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-end gap-1.5 h-36">
                        {[40, 55, 70, 60, 80, 90, 75, 65, 50, 45, 60, 78, 85, 72, 58, 48, 62, 80, 92, 88, 70, 55, 45, 40, 38, 42, 55, 65, 72, 68].map((h, i) => (
                            <div
                                key={i}
                                title={`Day ${i + 1}: ${h}%`}
                                className="flex-1 rounded-t-md transition-all duration-300 hover:opacity-70 cursor-pointer"
                                style={{
                                    height: `${h}%`,
                                    background: h >= 75
                                        ? 'linear-gradient(to top, #D81B60, #F06292)'
                                        : h >= 50
                                            ? 'linear-gradient(to top, #F48FB1, #FCE4EC)'
                                            : '#F3F4F6',
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-1">
                        <span>Day 1</span><span>Day 8</span><span>Day 15</span><span>Day 22</span><span>Day 30</span>
                    </div>
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#D81B60]" />
                            <span className="text-xs font-bold text-gray-600">High Energy (≥75%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#F48FB1]" />
                            <span className="text-xs font-bold text-gray-600">Moderate (50–74%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-200" />
                            <span className="text-xs font-bold text-gray-600">Low (&lt;50%)</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Insights;
