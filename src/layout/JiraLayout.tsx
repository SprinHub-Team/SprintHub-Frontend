import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getBoardById, getMyGroups } from '../services/sprintHubServices';
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

  const [groups, setGroups] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getMyGroups();
        setGroups(res?.data || res || []);
      } catch(err) {
        console.error(err);
      }
    };
    if (user) fetchGroups();
  }, [user]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

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
                  <i className="fas fa-cog"></i> Configuración
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
        <aside className="jira-sidebar" style={{ overflowY: 'auto' }}>
          <div className="sidebar-group">
            <Link to="/dashboard" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}>
              <i className="fas fa-columns"></i> Tableros
            </Link>
            <Link to="/wip" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}>
              <i className="fas fa-copy"></i> Plantillas
            </Link>
            <Link to="/dashboard" className="sidebar-item" style={{textDecoration:'none', color:'inherit'}}>
              <i className="fas fa-home"></i> Inicio
            </Link>
          </div>
          
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-group">
            <div className="sidebar-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Espacios de trabajo</span>
              <Link to="/dashboard" style={{color:'inherit'}}><i className="fas fa-plus"></i></Link>
            </div>
            
            {groups.map(g => (
              <div key={g._id} style={{ marginBottom: '4px' }}>
                <div 
                  className="sidebar-item" 
                  onClick={() => toggleGroup(g._id)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', paddingRight: '16px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="project-icon" style={{ background: '#0052cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '10px' }}>
                      {g.name.substring(0,2).toUpperCase()}
                    </div>
                    <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>{g.name}</span>
                  </div>
                  <i className={`fas fa-chevron-${expandedGroups[g._id] ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', color: '#9fadbc' }}></i>
                </div>
                
                {expandedGroups[g._id] && (
                  <div className="sidebar-group-children fade-down">
                    <Link to={`/groups/${g._id}/boards`} className={`sidebar-item ${location.pathname.includes(`/groups/${g._id}/boards`) ? 'active' : ''}`} style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: 'auto' }}>
                      <i className="fas fa-columns" style={{ fontSize: '0.85rem', marginRight: '10px' }}></i> Tableros
                    </Link>
                    
                    <Link to={`/groups/${g._id}/members`} className={`sidebar-item ${location.pathname.includes(`/groups/${g._id}/members`) ? 'active' : ''}`} style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><i className="fas fa-user-friends" style={{ fontSize: '0.85rem', marginRight: '10px' }}></i> Miembros</div>
                      <i className="fas fa-plus" style={{ fontSize: '0.7rem', opacity: 0.8 }} title="Invitar miembros"></i>
                    </Link>

                    {/* Solo mostrar Resumen y Backlog si el usuario está interactuando con un tablero, backlog o estas vistas */}
                    {(location.pathname.includes('/board/') || location.pathname.includes('/backlog') || location.pathname.includes('/reports') || location.pathname.includes('/documents')) && (
                      <>
                        <Link to={`/groups/${g._id}/reports`} className={`sidebar-item ${location.pathname.includes(`/groups/${g._id}/reports`) ? 'active' : ''}`} style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: 'auto' }}>
                          <i className="fas fa-chart-pie" style={{ fontSize: '0.85rem', marginRight: '10px' }}></i> Resumen
                        </Link>
                        <Link to={`/groups/${g._id}/backlog`} className={`sidebar-item ${location.pathname.includes(`/groups/${g._id}/backlog`) ? 'active' : ''}`} style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: 'auto' }}>
                          <i className="fas fa-list" style={{ fontSize: '0.85rem', marginRight: '10px' }}></i> Backlog
                        </Link>
                      </>
                    )}
                    
                    <Link to="/wip" className="sidebar-item" style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: 'auto' }}>
                      <i className="fas fa-cog" style={{ fontSize: '0.85rem', marginRight: '10px' }}></i> Configuración
                    </Link>
                  </div>
                )}
              </div>
            ))}
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
                const boardMatch = location.pathname.match(/\/board\/([a-zA-Z0-9_]+)/);
                const boardId = boardMatch ? boardMatch[1] : null;
                
                const groupMatch = location.pathname.match(/\/groups\/([a-zA-Z0-9_]+)/);
                let currentGroupId = groupMatch ? groupMatch[1] : null;

                if (currentGroupId) {
                  localStorage.setItem('currentGroupId', currentGroupId);
                } else if (boardId) {
                  currentGroupId = localStorage.getItem('currentGroupId');
                }

                const path = location.pathname;

                if (boardId) {
                  // Inside a board: Show General + all project tabs
                  // To link to group-level features like Backlog and Documents, we need the groupId.
                  // Since JiraLayout might not know the exact groupId of the board synchronously, 
                  // we can fallback to the first expanded group or omit if unavailable, but 
                  // usually we pass it or it's not strictly needed for UI presentation if handled well.
                  // A better approach is to render the exact tabs requested:
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex' }}>
                        <div className="m-tab active"><i className="fas fa-border-all"></i> General</div>
                        <Link to={`/board/${boardId}/reports`} className={`m-tab ${path.includes('/reports') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-chart-pie"></i> Resumen
                        </Link>
                        <Link to={`/board/${boardId}/list`} className={`m-tab ${path.includes('/list') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-stream"></i> Lista
                        </Link>
                        <Link to={`/board/${boardId}`} className={`m-tab ${path === `/board/${boardId}` ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-columns"></i> Tablero
                        </Link>
                        {currentGroupId && (
                          <>
                            <Link to={`/groups/${currentGroupId}/backlog`} className={`m-tab`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <i className="fas fa-list"></i> Backlog
                            </Link>
                            <Link to={`/groups/${currentGroupId}/documents`} className={`m-tab`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <i className="fas fa-folder-open"></i> Documentación
                            </Link>
                          </>
                        )}
                        <Link to={`/wip`} className={`m-tab`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-code"></i> Desarrollo
                        </Link>
                        <Link to={`/wip`} className={`m-tab`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-wpforms"></i> Formularios
                        </Link>
                        <Link to={`/wip`} className={`m-tab`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <i className="fas fa-calendar-alt"></i> Cronograma
                        </Link>
                      </div>
                      
                      <div className="board-settings-action">
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
                
                if (currentGroupId) {
                  return (
                    <div style={{ display: 'flex' }}>
                      <Link to={`/groups/${currentGroupId}/boards`} className={`m-tab ${path.includes('/boards') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <i className="fas fa-border-all"></i> General
                      </Link>
                      {(path.includes('/backlog') || path.includes('/members') || path.includes('/reports') || path.includes('/documents')) && (
                        <>
                          <Link to={`/groups/${currentGroupId}/reports`} className={`m-tab ${path.includes('/reports') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <i className="fas fa-chart-pie"></i> Resumen
                          </Link>
                          <Link to={`/groups/${currentGroupId}/backlog`} className={`m-tab ${path.includes('/backlog') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <i className="fas fa-list"></i> Backlog
                          </Link>
                          <Link to={`/groups/${currentGroupId}/documents`} className={`m-tab ${path.includes('/documents') ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <i className="fas fa-folder-open"></i> Documentación
                          </Link>
                          <Link to={`/wip`} className={`m-tab`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <i className="fas fa-code"></i> Desarrollo
                          </Link>
                        </>
                      )}
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
