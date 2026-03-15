import { Lightbulb, TrendingUp, Heart, Moon, Sun, Zap, Droplets, Info } from 'lucide-react';

const phaseInsights = [
    {
        phase: 'Menstrual',
        days: 'Days 1 – 5',
        color: '#D81B60',
        bg: '#FFF0F4',
        icon: <Droplets size={20} />,
        tip: 'Prioritize rest and warmth. Iron-rich foods like lentils and spinach help replenish what\'s lost.',
        energy: 30,
    },
    {
        phase: 'Follicular',
        days: 'Days 6 – 13',
        color: '#E91E63',
        bg: '#FCE4EC',
        icon: <Sun size={20} />,
        tip: 'Estrogen is rising — a great time for challenging workouts, creative work, and social plans.',
        energy: 75,
    },
    {
        phase: 'Ovulatory',
        days: 'Days 14 – 16',
        color: '#8E24AA',
        bg: '#F3E5F5',
        icon: <Zap size={20} />,
        tip: 'Peak energy and confidence. Lean into high-intensity workouts and important conversations.',
        energy: 100,
    },
    {
        phase: 'Luteal',
        days: 'Days 17 – 28',
        color: '#5C6BC0',
        bg: '#E8EAF6',
        icon: <Moon size={20} />,
        tip: 'Progesterone rises then falls. Magnesium-rich foods and gentle yoga can ease PMS symptoms.',
        energy: 50,
    },
];

const weeklyInsights = [
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
        <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${value}%`, backgroundColor: color }}
        />
    </div>
);

const Insights = () => {
    return (
        <div className="p-8 max-w-6xl mx-auto">

            {/* Page Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">
                            Personalized Insights
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Based on your last 6 months of cycle data
                        </p>
                    </div>
                </div>
            </header>

            {/* Current Phase Banner */}
            <div className="bg-gradient-to-r from-[#D81B60] to-[#F06292] rounded-[1.5rem] p-6 text-white mb-8 flex items-center gap-6 relative overflow-hidden shadow-md">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-bl-full pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm z-10 shrink-0">
                    <Sun size={28} />
                </div>
                <div className="z-10 flex-1">
                    <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">
                        You are currently in
                    </p>
                    <h2 className="text-2xl font-heading font-extrabold mb-1">
                        Follicular Phase
                    </h2>
                    <p className="text-white/90 text-sm font-medium">
                        Day 8 of 28 · Estrogen rising · Great time for creativity and exercise
                    </p>
                </div>
                <div className="hidden md:block z-10">
                    <div className="text-center">
                        <span className="text-4xl font-heading font-extrabold">75</span>
                        <p className="text-white/80 text-xs font-bold tracking-wider uppercase mt-1">Energy Level</p>
                        <div className="w-32 h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-white rounded-full w-3/4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Cards */}
            <section className="mb-8">
                <h2 className="text-lg font-heading font-extrabold text-[#1D1D2C] mb-4 flex items-center gap-2">
                    <span>Cycle Phase Overview</span>
                    <Info size={14} className="text-gray-400" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {phaseInsights.map((p) => (
                        <div
                            key={p.phase}
                            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: p.bg, color: p.color }}
                            >
                                {p.icon}
                            </div>
                            <h3 className="font-heading font-bold text-base text-[#1D1D2C]">
                                {p.phase}
                            </h3>
                            <p className="text-[11px] font-bold text-gray-400 mb-2">{p.days}</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{p.tip}</p>
                            <EnergyBar value={p.energy} color={p.color} />
                            <p className="text-[10px] font-bold text-gray-400 mt-1">
                                Avg. Energy {p.energy}%
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI-Detected Patterns */}
            <section className="mb-8">
                <h2 className="text-lg font-heading font-extrabold text-[#1D1D2C] mb-4">
                    AI-Detected Patterns
                </h2>
                <div className="space-y-4">
                    {weeklyInsights.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: item.badgeBg, color: item.badgeColor }}
                            >
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-sm text-[#1D1D2C]">
                                        {item.title}
                                    </h3>
                                    <span
                                        className="text-[9px] font-extrabold tracking-widest px-2 py-1 rounded uppercase"
                                        style={{ background: item.badgeBg, color: item.badgeColor }}
                                    >
                                        {item.badge}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Weekly Snapshot Chart */}
            <section>
                <h2 className="text-lg font-heading font-extrabold text-[#1D1D2C] mb-4">
                    30-Day Mood & Energy Snapshot
                </h2>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    {/* Mock chart */}
                    <div className="flex items-end gap-2 h-36">
                        {[40, 55, 70, 60, 80, 90, 75, 65, 50, 45, 60, 78, 85, 72, 58, 48, 62, 80, 92, 88, 70, 55, 45, 40, 38, 42, 55, 65, 72, 68].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer"
                                style={{
                                    height: `${h}%`,
                                    background: h >= 75
                                        ? 'linear-gradient(to top, #D81B60, #F06292)'
                                        : h >= 50
                                            ? 'linear-gradient(to top, #F48FB1, #FCE4EC)'
                                            : '#F3F4F6',
                                }}
                                title={`Day ${i + 1}: ${h}%`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-3 px-1">
                        <span>Day 1</span>
                        <span>Day 8</span>
                        <span>Day 15</span>
                        <span>Day 22</span>
                        <span>Day 30</span>
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
