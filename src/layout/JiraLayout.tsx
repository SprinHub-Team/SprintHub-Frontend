import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getBoardById } from '../services/sprintHubServices';
import BoardSwitcher from './BoardSwitcher';
import BoardSettingsModal from '../views/board/BoardSettingsModal';
import ProfileSettingsModal from '../views/auth/ProfileSettingsModal';
import './JiraLayout.css';

interface JiraLayoutProps {
  children: React.ReactNode;
}

const JiraLayout: React.FC<JiraLayoutProps> = ({ children }) => {
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);
  const location = useLocation();
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [boardData, setBoardData] = useState<any>(null);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const handleOpenSettings = async (e: any) => {
      const bId = e.detail.boardId;
      try {
        const res = await getBoardById(bId);
        setBoardData(res.data || res);
        setShowSettingsModal(true);
      } catch (err) {
        console.error("Error opening board settings:", err);
      }
    };
    window.addEventListener('open-board-settings', handleOpenSettings);
    return () => window.removeEventListener('open-board-settings', handleOpenSettings);
  }, []);

  return (
    <div className="jira-layout">
      {/* Modern Top Navbar */}
      <nav className="modern-topbar">
        <div className="topbar-left">
          <div className="app-switcher-icon pulse-hover">
            <div className="dot-grid">
              <span/><span/><span/>
              <span/><span/><span/>
              <span/><span/><span/>
            </div>
          </div>
          <div className="brand-logo pulse-hover">
            <div className="logo-icon-modern">
              <div className="logo-glow"></div>
            </div>
            <span className="gradient-text-small">SprintHub</span>
          </div>
          
          <div className="topbar-links">
            <Link to="/dashboard" className="glass-link" style={{textDecoration:'none', color:'inherit'}}>Dashboard</Link>
            <Link to="/wip" className="glass-link" style={{textDecoration:'none', color:'inherit'}}>Proyectos</Link>
            <Link to="/wip" className="glass-link" style={{textDecoration:'none', color:'inherit'}}>Equipos</Link>
            <Link to="/wip" className="create-btn-modern" style={{textDecoration:'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fas fa-plus"></i> Nuevo</Link>
          </div>
        </div>

        <div className="topbar-right">
          <div className="modern-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Buscar en todo SprintHub..." />
            <div className="search-shortcut">⌘K</div>
          </div>
          <div className="topbar-icons">
            <Link to="/wip" className="icon-wrapper" style={{color:'inherit'}}><i className="far fa-bell"></i><span className="notification-dot"></span></Link>
            <Link to="/wip" className="icon-wrapper" style={{color:'inherit'}}><i className="far fa-question-circle"></i></Link>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="user-avatar-modern" onClick={() => setShowProfileMenu(!showProfileMenu)} title="Mi Perfil">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown glass-panel">
                <div className="dropdown-header">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}>
                  <i className="fas fa-user-edit"></i> Editar Perfil
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item danger" onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="jira-body">
        {/* Left Sidebar */}
        <aside className="jira-sidebar">
          <div className="sidebar-group">
            <Link to="/wip" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-user-circle"></i> Para ti</Link>
            <Link to="/wip" className="sidebar-item has-arrow" style={{textDecoration:'none', color:'inherit'}}><i className="far fa-clock"></i> Recientes <i className="fas fa-chevron-right arrow"></i></Link>
            <Link to="/wip" className="sidebar-item has-arrow" style={{textDecoration:'none', color:'inherit'}}><i className="far fa-star"></i> Marcados como favoritos <i className="fas fa-chevron-right arrow"></i></Link>
            <Link to="/wip" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-cubes"></i> Aplicaciones</Link>
            <Link to="/wip" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-stream"></i> Planes</Link>
          </div>
          
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-group">
            <div className="sidebar-header">
              <span>Espacio</span>
              <div>
                <Link to="/wip" style={{color:'inherit'}}><i className="fas fa-plus"></i></Link>
                <Link to="/wip" style={{color:'inherit', marginLeft: '12px'}}><i className="fas fa-ellipsis-h"></i></Link>
              </div>
            </div>
            
            <div className="sidebar-section-title">Recientes</div>
            <Link to="/dashboard" className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`} style={{textDecoration:'none', color:'inherit'}}>
              <div className="project-icon"></div> SprintHub
            </Link>
            
            <Link to="/wip" className="sidebar-item has-arrow" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-layer-group"></i> Más espacios <i className="fas fa-chevron-right arrow"></i></Link>
          </div>
          
          <div className="sidebar-group">
            <div className="sidebar-section-title">Recomendado</div>
            <Link to="/wip" className="sidebar-item promo" style={{textDecoration:'none', color:'inherit'}}>
              <div className="promo-icon"></div> Recopilar solicitudes... <span className="badge">Probar</span>
            </Link>
          </div>
          
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-group">
            <Link to="/wip" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-filter"></i> Filtros</Link>
            <Link to="/wip" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-columns"></i> Paneles</Link>
          </div>
          
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-group bottom-links">
            <a href="#" className="sidebar-item external" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-book"></i> Confluence <i className="fas fa-external-link-alt external-icon"></i></a>
            <a href="#" className="sidebar-item external" style={{textDecoration:'none', color:'inherit'}}><i className="fas fa-users"></i> Equipos <i className="fas fa-external-link-alt external-icon"></i></a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="jira-content">
          {/* Modern Floating Topbar inside main content instead of global topbar, or just update the current tabs */}
          <div className="modern-header">
            <div className="header-breadcrumbs">
              <span>Espacio</span> <i className="fas fa-chevron-right"></i> 
              {(() => {
                const match = location.pathname.match(/\/board\/([a-zA-Z0-9_]+)/);
                if (match && match[1]) {
                  return <BoardSwitcher currentBoardId={match[1]} />;
                }
                return <span>SprintHub</span>;
              })()}
            </div>
            <div className="header-main">
              <div className="header-title-wrapper">
                <div className="pulse-icon">
                  <div className="pulse-circle"></div>
                  <i className="fas fa-rocket"></i>
                </div>
                <h1>SprintHub Workspace</h1>
              </div>
              <div className="header-actions">
                <button className="icon-btn tooltip" data-tooltip="Invitar equipo"><i className="fas fa-user-plus"></i></button>
                <button className="icon-btn tooltip" data-tooltip="Estadísticas"><i className="fas fa-chart-pie"></i></button>
                <button className="icon-btn tooltip" data-tooltip="Configuración"><i className="fas fa-cog"></i></button>
              </div>
            </div>
            
            <div className="modern-tabs">
              {(() => {
                const match = location.pathname.match(/\/board\/([a-zA-Z0-9_]+)/);
                const boardId = match ? match[1] : null;
                const path = location.pathname;

                if (boardId) {
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex' }}>
                        <Link to={`/board/${boardId}/reports`} className={`m-tab ${path.includes('/reports') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-chart-pie"></i> Reportes
                        </Link>
                        <Link to={`/board/${boardId}`} className={`m-tab ${path === `/board/${boardId}` ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-border-all"></i> Tablero
                        </Link>
                        <Link to={`/board/${boardId}/list`} className={`m-tab ${path.includes('/list') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-stream"></i> Lista
                        </Link>
                        <Link to={`/board/${boardId}/timeline`} className={`m-tab ${path.includes('/timeline') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-calendar-alt"></i> Cronograma
                        </Link>
                        <Link to={`/board/${boardId}/automations`} className={`m-tab ${path.includes('/automations') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-bolt"></i> Automatizaciones
                        </Link>
                        <div className="m-tab add-m-tab"><i className="fas fa-plus"></i></div>
                      </div>
                      
                      <div className="board-settings-action">
                        {/* We will trigger an event or modal via a global state or simple prop later */}
                        <button 
                          className="icon-btn tooltip" 
                          data-tooltip="Configuración del tablero" 
                          onClick={() => window.dispatchEvent(new CustomEvent('open-board-settings', { detail: { boardId } }))}
                          style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                        >
                          <i className="fas fa-cog"></i>
                        </button>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <>
                    <div className="m-tab active"><i className="fas fa-border-all"></i> General</div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="jira-inner-content">
            {children}
          </div>
        </main>
      </div>
      
      {showSettingsModal && boardData && (
        <BoardSettingsModal 
          board={boardData} 
          groupId={boardData.groupId} 
          onClose={() => setShowSettingsModal(false)}
          onUpdate={() => window.location.reload()}
        />
      )}
      
      {showProfileModal && (
        <ProfileSettingsModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default JiraLayout;
