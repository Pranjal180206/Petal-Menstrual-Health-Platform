import { FileText, Download, Calendar, Printer, ChevronDown, CheckCircle2 } from 'lucide-react';

const reportSections = [
    { label: 'Cycle Overview', enabled: true },
    { label: 'Symptom Log Summary', enabled: true },
    { label: 'Mood & Energy Trends', enabled: true },
    { label: 'Risk Factors', enabled: false },
    { label: 'Hormonal Pattern Analysis', enabled: true },
    { label: 'Doctor Recommendations', enabled: false },
];

const recentReports = [
    {
        name: 'Cycle Report — February 2025',
        date: 'Mar 1, 2025',
        pages: 4,
        status: 'Generated',
        statusColor: '#2E7D32',
        statusBg: '#E8F5E9',
    },
    {
        name: 'Cycle Report — January 2025',
        date: 'Feb 1, 2025',
        pages: 5,
        status: 'Generated',
        statusColor: '#2E7D32',
        statusBg: '#E8F5E9',
    },
    {
        name: 'Q4 2024 Summary Report',
        date: 'Jan 5, 2025',
        pages: 12,
        status: 'Generated',
        statusColor: '#2E7D32',
        statusBg: '#E8F5E9',
    },
];

const ReportGenerator = () => {
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
                            <h1 className="text-2xl font-heading font-extrabold text-[#1D1D2C]">
                                Report Generator
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Create a PDF report to share with your healthcare provider
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors">
                        <Download size={16} />
                        Export PDF
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">From</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        defaultValue="2025-01-01"
                                        className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">To</label>
                                <input
                                    type="date"
                                    defaultValue="2025-03-15"
                                    className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#D81B60] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            {['Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year'].map((label, i) => (
                                <button
                                    key={label}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                        i === 1
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
                        </h2>
                        <div className="space-y-3">
                            {reportSections.map((section) => (
                                <label
                                    key={section.label}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F8FA] cursor-pointer transition-colors group"
                                >
                                    <span className="text-sm font-bold text-[#1D1D2C]">
                                        {section.label}
                                    </span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            defaultChecked={section.enabled}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-[#D81B60] transition-colors" />
                                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Format Options */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="font-heading font-bold text-base text-[#1D1D2C] mb-4">
                            Output Format
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <Download size={18} />, label: 'PDF', selected: true },
                                { icon: <Printer size={18} />, label: 'Print', selected: false },
                                { icon: <FileText size={18} />, label: 'CSV', selected: false },
                            ].map((fmt) => (
                                <button
                                    key={fmt.label}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-colors ${
                                        fmt.selected
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

                    {/* Preview Card */}
                    <div className="bg-gradient-to-br from-[#D81B60] to-[#F06292] rounded-2xl p-6 text-white shadow-md">
                        <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-3">
                            Report Preview
                        </p>
                        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm space-y-2 mb-4">
                            {reportSections.filter(s => s.enabled).map(s => (
                                <div key={s.label} className="flex items-center gap-2 text-xs font-bold">
                                    <CheckCircle2 size={12} className="text-white/80" />
                                    {s.label}
                                </div>
                            ))}
                        </div>
                        <p className="text-white/90 text-xs font-medium">
                            ~{reportSections.filter(s => s.enabled).length * 2} pages · PDF
                        </p>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h2 className="font-heading font-bold text-sm text-[#1D1D2C] mb-4">
                            Recent Reports
                        </h2>
                        <div className="space-y-3">
                            {recentReports.map((r) => (
                                <div
                                    key={r.name}
                                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-[#FFF0F4] flex items-center justify-center text-[#D81B60] shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#1D1D2C] truncate">{r.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{r.date} · {r.pages} pages</p>
                                    </div>
                                    <Download
                                        size={14}
                                        className="text-gray-300 group-hover:text-[#D81B60] transition-colors shrink-0 mt-0.5"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
