import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-[560px] max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border-t-[3px] border-[#B91C1C]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-[#E5E0D8] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="p-8 pb-4">
              <h2 className="text-xl font-medium text-[#1A1A1A] mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
                {title}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
              <div 
                className="text-[13px] text-[#3D3D3D] leading-[1.8]" 
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
