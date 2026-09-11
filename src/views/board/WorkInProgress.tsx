import React from 'react';

interface Props {
  title: string;
  icon?: string;
}

const WorkInProgress: React.FC<Props> = ({ title, icon = "fas fa-tools" }) => {
  return (
    <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', borderRadius: '24px', maxWidth: '500px', width: '100%' }}>
        <div className="pulse-icon" style={{ margin: '0 auto 24px', width: '80px', height: '80px', fontSize: '2rem' }}>
          <div className="pulse-circle"></div>
          <i className={icon} style={{ color: '#60a5fa', position: 'relative', zIndex: 2 }}></i>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '16px', color: '#f8fafc' }}>Módulo en Proceso</h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
          La vista de <strong style={{ color: '#e2e8f0' }}>{title}</strong> está en desarrollo. Pronto estará disponible con nuevas funcionalidades increíbles.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', opacity: 0.6 }}>
          <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: '10px' }}></div>
          </div>
          <div style={{ height: '6px', width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}></div>
          <div style={{ height: '6px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress;
