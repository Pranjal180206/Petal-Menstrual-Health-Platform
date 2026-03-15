import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const variants = {
    success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: <CheckCircle2 size={18} className="text-green-600 shrink-0" />,
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: <AlertCircle size={18} className="text-red-500 shrink-0" />,
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: <Info size={18} className="text-blue-500 shrink-0" />,
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: <AlertCircle size={18} className="text-amber-500 shrink-0" />,
    },
};

const Toast = ({ message, type = 'success', onClose }) => {
    const v = variants[type] || variants.success;

    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl ${v.bg} ${v.border} ${v.text}`}
            style={{ animation: 'toastSlideUp 0.3s ease forwards' }}
        >
            {v.icon}
            <span className="text-sm font-bold">{message}</span>
            <button
                onClick={onClose}
                className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;
