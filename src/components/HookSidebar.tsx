import React, { useState, useId, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface HookSidebarProps {
  items: NavItem[];
  color?: string;
  dashed?: boolean;
}

export const HookSidebar: React.FC<HookSidebarProps> = ({
  items,
  color = "#3b82f6",
  dashed = true,
}) => {
  const location = useLocation();
  const id = useId();

  const getActiveIndex = () => {
    const index = items.findIndex((item) => item.href && location.pathname.includes(item.href));
    return index >= 0 ? index : -1;
  };

  const [activeIndex, setActiveIndex] = useState(getActiveIndex());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setActiveIndex(getActiveIndex());
  }, [location.pathname, items]);

  const ITEM_HEIGHT = 36;
  const SVG_HEIGHT = items.length * ITEM_HEIGHT + 20;
  const RADIUS = 12;

  const createPath = (index: number) => {
    const y = index * ITEM_HEIGHT + (ITEM_HEIGHT / 2);
    return `M 1 0 V ${y - RADIUS} A ${RADIUS} ${RADIUS} 0 0 0 ${RADIUS + 1} ${y} H 16`;
  };

  const activePath = activeIndex >= 0 ? createPath(activeIndex) : "";
  const hoverPath = hoveredIndex !== null && hoveredIndex !== activeIndex ? createPath(hoveredIndex) : "";

  return (
    <nav
      onMouseLeave={() => setHoveredIndex(null)}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', paddingLeft: '8px', marginTop: '8px' }}
    >
      <svg
        style={{ position: 'absolute', left: 0, top: 0, width: '24px', height: SVG_HEIGHT, pointerEvents: 'none' }}
      >
        <path
          d={`M 1 0 V ${SVG_HEIGHT}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="2"
        />

        {hoverPath && (
          <motion.path
            d={hoverPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            strokeDasharray={dashed ? "4 4" : "none"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {activePath && (
          <motion.path
            d={activePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={dashed ? "4 4" : "none"}
            layoutId={`active-path-${id}`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10, marginLeft: '24px' }}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isHovered = index === hoveredIndex;
          
          const itemContent = (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 12px',
                fontSize: '0.85rem',
                height: `${ITEM_HEIGHT}px`,
                color: isActive ? '#ffffff' : (isHovered ? '#e2e8f0' : '#94a3b8'),
                transition: 'color 0.2s',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId={`active-bg-${id}`}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {item.icon && <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}>{item.icon}</span>}
              <span style={{ position: 'relative', zIndex: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
            </div>
          );

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => {
                if (item.onClick) item.onClick();
              }}
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {item.href ? (
                <Link to={item.href} style={{ textDecoration: 'none' }}>
                  {itemContent}
                </Link>
              ) : (
                itemContent
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
