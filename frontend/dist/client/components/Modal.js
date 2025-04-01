import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export default function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center pointer-events-none", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 pointer-events-auto", onClick: onClose }), _jsx("div", { className: "bg-white rounded-lg shadow-xl z-10 max-w-md w-full mx-4 pointer-events-auto", children: children })] }));
}
