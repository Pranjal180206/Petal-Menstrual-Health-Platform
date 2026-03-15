import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Hourglass } from 'lucide-react';
import Toast from '../components/Toast';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const FLOW_OPTIONS = ['Spotting', 'Light', 'Medium', 'Heavy', 'None'];
const PHYSICAL_SYMPTOMS = ['Cramps', 'Headache', 'Bloating', 'Breast Tenderness', 'Backache', 'Acne', 'Nausea'];
const MOOD_OPTIONS = [
    { emoji: '🙂', label: 'Calm' },
    { emoji: '😫', label: 'Tired' },
    { emoji: '😠', label: 'Irritable' },
    { emoji: '😟', label: 'Anxious' },
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
];

// Simulated data — will be replaced by API responses
const PERIOD_DAYS_MOCK = [4, 5, 6, 7, 8];
const PREDICTED_DAYS_MOCK = [16, 17, 18];
const SYMPTOM_DOTS_MOCK = [10, 11, 21, 22];

const CycleTracker = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [selectedFlow, setSelectedFlow] = useState('Light');
    const [selectedSymptoms, setSelectedSymptoms] = useState(['Cramps', 'Bloating', 'Acne']);
    const [selectedMoods, setSelectedMoods] = useState(['Tired']);
    const [notes, setNotes] = useState('');
    const [toast, setToast] = useState(null);
    const [saved, setSaved] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    /* ── Calendar Helpers ── */
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const calendarCells = [
        ...Array(firstDayOfMonth).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const isToday = (day) =>
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    /* ── Toggles ── */
    const toggleSymptom = (s) =>
        setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const toggleMood = (m) =>
        setSelectedMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

    /* ── Save ── */
    const handleSave = () => {
        if (!selectedFlow) {
            showToast('Please select a flow intensity.', 'warning');
            return;
        }
        setSaved(true);
        showToast('Daily log saved successfully! ✓', 'success');
        // TODO: POST to /api/cycle-log when backend is connected
        // payload: { date: `${currentYear}-${currentMonth+1}-${selectedDay}`, flow: selectedFlow, symptoms: selectedSymptoms, moods: selectedMoods, notes }
    };

    /* ── Calendar cell style ── */
    const cellClass = (day) => {
        const base = 'w-9 h-9 rounded-full flex items-center justify-center mx-auto text-sm font-bold transition-all cursor-pointer select-none';
        if (isToday(day))
            return `${base} border-2 border-[#D81B60] bg-[#FFF0F4] text-[#D81B60]`;
        if (PERIOD_DAYS_MOCK.includes(day) && currentMonth === today.getMonth())
            return `${base} bg-[#D81B60] text-white shadow-md`;
        if (PREDICTED_DAYS_MOCK.includes(day) && currentMonth === today.getMonth())
            return `${base} border-2 border-dashed border-[#F48FB1] text-[#F48FB1]`;
        if (selectedDay === day)
            return `${base} bg-[#FFF0F4] text-[#D81B60]`;
        return `${base} hover:bg-gray-100 text-[#1D1D2C]`;
    };

    /* ── Days until next period ── */
    const nextPeriodDay = 20; // simulated — will come from API

    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8">

            {/* Left Column */}
            <div className="flex-1 space-y-6">
                <header className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-heading font-extrabold">Cycle &amp; Symptom Tracker</h1>
                </header>

                {/* Calendar Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100">
                    {/* Month Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-heading font-extrabold">
                            {MONTH_NAMES[currentMonth]} {currentYear}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={prevMonth}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#D81B60] hover:text-[#D81B60] transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#D81B60] hover:text-[#D81B60] transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[10px] font-bold text-[#D81B60] tracking-widest uppercase">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-3 gap-x-0 text-center">
                        {calendarCells.map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                {day !== null && (
                                    <>
                                        <button
                                            onClick={() => setSelectedDay(day)}
                                            className={cellClass(day)}
                                        >
                                            {day}
                                        </button>
                                        {SYMPTOM_DOTS_MOCK.includes(day) && currentMonth === today.getMonth() && (
                                            <div className="w-1 h-1 rounded-full bg-gray-300 mt-1" />
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-[10px] font-bold italic text-[#F48FB1] mt-6 mb-4">
                        Predicted period: based on your last 3 cycles
                    </p>

                    {/* Legend */}
                    <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#D81B60]" />
                            <span className="text-xs font-bold text-[#1D1D2C]">Period</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-dashed border-[#F48FB1]" />
                            <span className="text-xs font-bold text-[#1D1D2C]">Predicted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 ml-1" />
                            <span className="text-xs font-bold text-[#1D1D2C]">Logged</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-card border border-gray-100 flex-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#D81B60] flex items-center justify-center">
                            <CalendarIcon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#D81B60] tracking-wider mb-0.5">Cycle Day</p>
                            <h3 className="text-xl font-heading font-extrabold text-[#1D1D2C]">
                                {today.getDate()} of 28
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-card border border-gray-100 flex-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#FAFAFA] text-gray-400 flex items-center justify-center">
                            <Hourglass size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#D81B60] tracking-wider mb-0.5">Next Period</p>
                            <h3 className="text-xl font-heading font-extrabold text-[#1D1D2C]">
                                {nextPeriodDay} days
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column — Daily Log Panel */}
            <div className="w-full lg:w-[420px] bg-white rounded-[2rem] shadow-card border border-gray-100 p-8 flex flex-col">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-heading font-extrabold">Daily Log</h2>
                    <span className="bg-gray-100 text-[#1D1D2C] text-xs font-bold px-3 py-1.5 rounded-md">
                        {MONTH_NAMES[currentMonth].slice(0, 3)} {selectedDay}, {currentYear}
                    </span>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto pr-1 pb-4 scrollbar-hide">

                    {/* Flow Intensity */}
                    <div>
                        <h4 className="text-xs font-bold text-[#D81B60] tracking-widest uppercase mb-4">Flow Intensity</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {FLOW_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSelectedFlow(opt)}
                                    className={`border-2 rounded-xl py-3 text-sm font-bold transition-all ${
                                        opt === 'None' ? 'col-span-2' : ''
                                    } ${
                                        selectedFlow === opt
                                            ? 'border-[#D81B60] bg-[#FFF0F4] text-[#D81B60] shadow-sm'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Physical Symptoms */}
                    <div>
                        <h4 className="text-xs font-bold text-[#D81B60] tracking-widest uppercase mb-4">Physical</h4>
                        <div className="flex flex-wrap gap-3">
                            {PHYSICAL_SYMPTOMS.map(s => {
                                const active = selectedSymptoms.includes(s);
                                return (
                                    <button
                                        key={s}
                                        onClick={() => toggleSymptom(s)}
                                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all border-2 ${
                                            active
                                                ? 'border-[#D81B60] text-[#D81B60] bg-[#FFF0F4] shadow-sm'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mood */}
                    <div>
                        <h4 className="text-xs font-bold text-[#D81B60] tracking-widest uppercase mb-4">Mood</h4>
                        <div className="flex flex-wrap gap-3">
                            {MOOD_OPTIONS.map(({ emoji, label }) => {
                                const active = selectedMoods.includes(label);
                                return (
                                    <button
                                        key={label}
                                        onClick={() => toggleMood(label)}
                                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all border-2 flex items-center gap-2 ${
                                            active
                                                ? 'border-[#D81B60] text-[#D81B60] bg-[#FFF0F4] shadow-sm'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                    >
                                        <span>{emoji}</span> {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h4 className="text-xs font-bold text-[#8C8C8C] tracking-widest uppercase mb-4">Notes</h4>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="How are you feeling today?"
                            className="w-full bg-[#FAFAFA] border border-transparent focus:border-gray-200 rounded-2xl p-5 text-sm font-medium resize-none h-28 outline-none placeholder:text-gray-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-gray-100 mt-auto">
                    <button
                        onClick={handleSave}
                        className={`w-full rounded-2xl py-4 font-bold text-lg transition-all flex justify-center items-center gap-2 mb-3 shadow-soft ${
                            saved
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-[#D81B60] hover:bg-[#C2185B] text-white'
                        }`}
                    >
                        <CalendarIcon size={20} />
                        {saved ? 'Log Saved! Update Again?' : 'Save Daily Log'}
                    </button>
                    <p className="text-[9px] text-gray-400 font-bold text-center leading-tight mx-4">
                        Information logged is used for personalized health risk insights. Connected to backend when available.
                    </p>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default CycleTracker;
