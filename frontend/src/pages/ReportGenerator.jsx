import { useState, useCallback, useEffect } from 'react';
import { FileText, Download, Calendar, Printer, CheckCircle2 } from 'lucide-react';
import Toast from '../components/Toast';
import axiosInstance from '../api/axiosInstance';

const SECTION_DEFAULTS = {
    'Cycle Overview': true,
    'Symptom Log Summary': true,
    'Mood & Energy Trends': true,
    'Risk Factors': false,
    'Hormonal Pattern Analysis': true,
    'Doctor Recommendations': false,
};

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
    const [recentReport, setRecentReport] = useState(null);
    const [isLoadingReport, setIsLoadingReport] = useState(true);
    const [reportError, setReportError] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // On mount: fetch risk analysis to populate "recent report" metadata
    useEffect(() => {
        const fetchReport = async () => {
            setIsLoadingReport(true);
            setReportError(null);
            try {
                const res = await axiosInstance.get('/reports/risk-analysis');
                setRecentReport(res.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setReportError('sign_in_required');
                } else {
                    console.error('Failed to load report data:', err);
                    setReportError('fetch_failed');
                }
            } finally {
                setIsLoadingReport(false);
            }
        };
        fetchReport();
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

    const handleExport = async () => {
        const enabledSections = Object.entries(sections).filter(([, v]) => v).map(([k]) => k);
        if (enabledSections.length === 0) {
            showToast('Please enable at least one report section.', 'warning');
            return;
        }
        if (selectedFormat !== 'PDF') {
            showToast(`${selectedFormat} export is not yet supported. Please select PDF.`, 'info');
            return;
        }
        setIsGenerating(true);
        try {
            const res = await axiosInstance.get('/reports/export', { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'petal_risk_report.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast('PDF report downloaded successfully!', 'success');
        } catch (err) {
            if (err.response?.status === 401) {
                showToast('Please sign in to generate a report.', 'error');
            } else {
                showToast('Failed to generate report. Please try again.', 'error');
                console.error('Export failed:', err);
            }
        } finally {
            setIsGenerating(false);
        }
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
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${isGenerating
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#D81B60] hover:bg-[#C2185B] text-white'
                            }`}
                    >
                        <Download size={16} />
                        {isGenerating ? 'Generating…' : 'Download PDF Report'}
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
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${selectedRange === label
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
                                { icon: <Download size={18} />, label: 'PDF', available: true },
                                { icon: <Printer size={18} />, label: 'Print', available: false },
                                { icon: <FileText size={18} />, label: 'CSV', available: false },
                            ].map(fmt => (
                                <button
                                    key={fmt.label}
                                    onClick={() => setSelectedFormat(fmt.label)}
                                    disabled={!fmt.available}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-colors relative ${
                                        !fmt.available
                                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                            : selectedFormat === fmt.label
                                                ? 'border-[#D81B60] bg-[#FFF0F4] text-[#D81B60]'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    {fmt.icon}
                                    {fmt.label}
                                    {!fmt.available && (
                                        <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-gray-200 text-gray-400 px-1.5 py-0.5 rounded-full">
                                            Soon
                                        </span>
                                    )}
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
                            {isLoadingReport ? (
                                <p className="text-xs text-gray-400 font-medium text-center py-4">
                                    Loading...
                                </p>
                            ) : reportError === 'sign_in_required' ? (
                                <p className="text-xs text-amber-600 font-medium text-center py-4">
                                    Please sign in to view your reports.
                                </p>
                            ) : reportError === 'fetch_failed' ? (
                                <p className="text-xs text-red-500 font-medium text-center py-4">
                                    Could not load report data.
                                </p>
                            ) : recentReport?.data_insufficient ? (
                                <div className="text-center py-4">
                                    <p className="text-xs text-[#1D1D2C] font-bold mb-1">
                                        No reports available yet.
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        Log at least 3 cycles to generate your first report.
                                    </p>
                                </div>
                            ) : recentReport ? (
                                <button
                                    onClick={handleExport}
                                    className="group w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[#F7F8FA] transition-colors text-left"
                                    disabled={isGenerating}
                                >
                                    <div className="w-9 h-9 rounded-lg bg-[#FFF0F4] flex items-center justify-center text-[#D81B60] shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#1D1D2C] truncate">
                                            Petal Risk Analysis Report
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            Risk level: {recentReport.overall_risk || '—'} · Click to download
                                        </p>
                                    </div>
                                    <Download size={14} className="text-gray-300 group-hover:text-[#D81B60] transition-colors shrink-0 mt-0.5" />
                                </button>
                            ) : (
                                <p className="text-xs text-gray-400 font-medium text-center py-4">
                                    No reports generated yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ReportGenerator;
