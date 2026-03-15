import { useState, useCallback } from 'react';
import { FileText, Download, Calendar, Printer, CheckCircle2 } from 'lucide-react';
import Toast from '../components/Toast';

const SECTION_DEFAULTS = {
    'Cycle Overview': true,
    'Symptom Log Summary': true,
    'Mood & Energy Trends': true,
    'Risk Factors': false,
    'Hormonal Pattern Analysis': true,
    'Doctor Recommendations': false,
};

const RECENT_REPORTS = [
    { name: 'Cycle Report — February 2025', date: 'Mar 1, 2025', pages: 4 },
    { name: 'Cycle Report — January 2025', date: 'Feb 1, 2025', pages: 5 },
    { name: 'Q4 2024 Summary Report', date: 'Jan 5, 2025', pages: 12 },
];

const formatDateStr = (d) => d.toISOString().split('T')[0];

const ReportGenerator = () => {
    const today = new Date();
    const [sections, setSections] = useState(SECTION_DEFAULTS);
    const [selectedFormat, setSelectedFormat] = useState('PDF');
    const [selectedRange, setSelectedRange] = useState('Last 3 Months');
    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date(today);
        d.setMonth(d.getMonth() - 3);
        return formatDateStr(d);
    });
    const [dateTo, setDateTo] = useState(formatDateStr(today));
    const [toast, setToast] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const toggleSection = (name) =>
        setSections(prev => ({ ...prev, [name]: !prev[name] }));

    const setQuickRange = (range) => {
        setSelectedRange(range);
        const end = new Date(today);
        const start = new Date(today);
        if (range === 'Last Month') start.setMonth(start.getMonth() - 1);
        else if (range === 'Last 3 Months') start.setMonth(start.getMonth() - 3);
        else if (range === 'Last 6 Months') start.setMonth(start.getMonth() - 6);
        else start.setMonth(0), start.setDate(1);
        setDateFrom(formatDateStr(start));
        setDateTo(formatDateStr(end));
    };

    const handleExport = () => {
        const enabledSections = Object.entries(sections).filter(([, v]) => v).map(([k]) => k);
        if (enabledSections.length === 0) {
            showToast('Please enable at least one report section.', 'warning');
            return;
        }
        setIsGenerating(true);
        // Simulate async export — will call real API when backend is ready
        // TODO: POST /api/reports/generate { format: selectedFormat, sections: enabledSections, from: dateFrom, to: dateTo }
        setTimeout(() => {
            setIsGenerating(false);
            showToast(`${selectedFormat} report generated! Download will start when backend is connected.`, 'success');
        }, 1500);
    };

    const enabledCount = Object.values(sections).filter(Boolean).length;

    return (
        <div className="p-8 max-w-5xl mx-auto">

            {/* Page Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#D81B60]">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">Report Generator</h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Create a {selectedFormat} report to share with your healthcare provider
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                            isGenerating
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#D81B60] hover:bg-[#C2185B] text-white'
                        }`}
                    >
                        <Download size={16} />
                        {isGenerating ? 'Generating…' : `Export ${selectedFormat}`}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — Config Panel */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Date Range */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-4 flex items-center gap-2">
                            <Calendar size={16} className="text-[#D81B60]" />
                            Date Range
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">From</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={e => { setDateFrom(e.target.value); setSelectedRange('Custom'); }}
                                    className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">To</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={e => { setDateTo(e.target.value); setSelectedRange('Custom'); }}
                                    className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year'].map(label => (
                                <button
                                    key={label}
                                    onClick={() => setQuickRange(label)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                        selectedRange === label
                                            ? 'bg-[#D81B60] text-white'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Report Sections */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-4">
                            Include Sections
                            <span className="ml-2 text-xs font-bold text-gray-400">({enabledCount} enabled)</span>
                        </h2>
                        <div className="space-y-2">
                            {Object.entries(sections).map(([name, enabled]) => (
                                <label
                                    key={name}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F8FA] cursor-pointer transition-colors"
                                >
                                    <span className={`text-sm font-bold ${enabled ? 'text-[#1D1D2C]' : 'text-gray-400'}`}>
                                        {name}
                                    </span>
                                    <button
                                        role="switch"
                                        aria-checked={enabled}
                                        onClick={() => toggleSection(name)}
                                        className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-[#D81B60]' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Output Format */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-4">Output Format</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <Download size={18} />, label: 'PDF' },
                                { icon: <Printer size={18} />, label: 'Print' },
                                { icon: <FileText size={18} />, label: 'CSV' },
                            ].map(fmt => (
                                <button
                                    key={fmt.label}
                                    onClick={() => setSelectedFormat(fmt.label)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-colors ${
                                        selectedFormat === fmt.label
                                            ? 'border-[#D81B60] bg-[#FFF0F4] text-[#D81B60]'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    {fmt.icon}
                                    {fmt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Preview + History */}
                <div className="space-y-5">

                    {/* Live Preview Card */}
                    <div className="bg-gradient-to-br from-[#D81B60] to-[#F06292] rounded-2xl p-6 text-white shadow-md">
                        <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-3">
                            Report Preview
                        </p>
                        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm space-y-2 mb-4 min-h-[100px]">
                            {Object.entries(sections).filter(([, v]) => v).map(([name]) => (
                                <div key={name} className="flex items-center gap-2 text-xs font-bold">
                                    <CheckCircle2 size={12} className="text-white/80 shrink-0" />
                                    {name}
                                </div>
                            ))}
                            {enabledCount === 0 && (
                                <p className="text-white/60 text-xs">No sections enabled</p>
                            )}
                        </div>
                        <p className="text-white/90 text-xs font-medium">
                            ~{enabledCount * 2} pages · {selectedFormat}
                        </p>
                        <p className="text-white/60 text-xs mt-1">
                            {dateFrom} → {dateTo}
                        </p>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h2 className="font-heading font-bold text-sm text-[#1D1D2C] mb-4">Recent Reports</h2>
                        <div className="space-y-2">
                            {RECENT_REPORTS.map(r => (
                                <button
                                    key={r.name}
                                    onClick={() => showToast(`Opening "${r.name}" — available when backend connects.`, 'info')}
                                    className="group w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors text-left"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-[#FFF0F4] flex items-center justify-center text-[#D81B60] shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#1D1D2C] truncate">{r.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{r.date} · {r.pages} pages</p>
                                    </div>
                                    <Download size={14} className="text-gray-300 group-hover:text-[#D81B60] transition-colors shrink-0 mt-0.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ReportGenerator;
