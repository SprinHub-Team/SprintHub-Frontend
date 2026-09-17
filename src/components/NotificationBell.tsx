import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NotificationBellProps {
  hasNotifications?: boolean;
  onClick?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ hasNotifications = true, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'background 0.2s' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        animate={isHovered ? { rotate: [0, -15, 15, -15, 15, 0] } : { rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ originX: 0.5, originY: 0 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ color: '#9fadbc' }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </motion.div>
      
      {hasNotifications && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ 
            position: 'absolute', 
            top: '6px', 
            right: '8px', 
            width: '8px', 
            height: '8px', 
            backgroundColor: '#ef4444', 
            borderRadius: '50%',
            border: '2px solid #1d2125' 
          }} 
        />
      )}
    </div>
  );
};
