import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Use AnimatePresence at the caller level usually, but we can do it inside by relying on a container or just rendering if isOpen inside AnimatePresence if the caller leaves it mounted.
    // However, since `createPortal` is used and standard React unmounts it immediately if the caller does `{isOpen && <Modal>}`, we can't easily animate exit unless the caller uses AnimatePresence.
    // Assuming callers do `{isOpen && <Modal>}`, we can animate entrance at least. For true exit animations, the caller needs to use AnimatePresence and keep <Modal> rendered.
    
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={onClose} 
            />
            
            {/* Modal Content */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white dark:bg-[#1d2125] p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                    {children}
                </div>
            </motion.div>
        </div>,
        document.body
    );
}

export default Modal;
