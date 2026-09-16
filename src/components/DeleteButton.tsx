import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  size?: 'normal' | 'small';
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onConfirm, disabled = false, size = 'normal' }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (isConfirming) {
      onConfirm();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000); // Reset after 3 seconds
    }
  };

  const isSmall = size === 'small';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      animate={{
        backgroundColor: isConfirming ? '#7f1d1d' : 'rgba(239, 68, 68, 0.2)',
        borderColor: isConfirming ? '#dc2626' : 'rgba(239, 68, 68, 0.4)',
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isSmall ? '4px' : '8px',
        color: '#ef4444',
        border: '1px solid',
        padding: isSmall ? '6px' : '10px 15px',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minWidth: isSmall ? (isConfirming ? '100px' : '36px') : '160px',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <AnimatePresence mode="wait">
        {!isConfirming ? (
          <motion.div
            key="default"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            {!isSmall && <span>Eliminar</span>}
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span style={{ fontSize: isSmall ? '0.75rem' : '1rem' }}>{isSmall ? 'Seguro?' : '¿Estás seguro?'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
