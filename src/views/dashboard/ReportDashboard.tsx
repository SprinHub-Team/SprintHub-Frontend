import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupPerformanceReport, getUserPerformanceReport, getCompletedActivitiesReport, getMyGroups, getBoardById } from '../../services/sprintHubServices';
import './ReportDashboard.css';

const ReportDashboard: React.FC = () => {
  const { groupId: paramGroupId, boardId } = useParams<{ groupId: string, boardId: string }>();
  const [groupId, setGroupId] = useState<string | undefined>(paramGroupId);
  
  useEffect(() => {
    if (boardId && !paramGroupId) {
      getBoardById(boardId).then((res: any) => setGroupId(res.data?.groupId || res?.groupId));
    }
  }, [boardId, paramGroupId]);
  
  const [groupStats, setGroupStats] = useState<any>(null);
  const [completedActivities, setCompletedActivities] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userStats, setUserStats] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    fetchGroupStats();
    fetchCompletedActivities();
    fetchGroupMembers();
  }, [groupId]);

  const fetchGroupStats = async () => {
    if (!groupId) return;
    try {
      const res = await getGroupPerformanceReport(groupId);
      setGroupStats(res?.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompletedActivities = async () => {
    if (!groupId) return;
    try {
      const res = await getCompletedActivitiesReport(groupId);
      setCompletedActivities(res?.data || res || []);
    } catch (error) {
      console.error(error);
      setCompletedActivities([]);
    }
  };

  const fetchGroupMembers = async () => {
    if (!groupId) return;
    try {
      const res = await getMyGroups();
      const groups = res?.data || res || [];
      const currentGroup = groups.find((g: any) => g._id === groupId);
      if (currentGroup) {
        setMembers(currentGroup.members || []);
      }
    } catch (error) {
      console.error(error);
      setMembers([]);
    }
  };

  const fetchUserStats = async () => {
    if (!selectedUserId) return;
    try {
      const res = await getUserPerformanceReport(selectedUserId, startDate, endDate);
      setUserStats(res?.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const exportToCSV = () => {
    // Generate CSV for group stats
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "--- RENDIMIENTO DEL GRUPO ---\n";
    csvContent += "Creadas,Pendientes,Completadas,Vencidas\n";
    if (groupStats) {
      csvContent += `${groupStats.created},${groupStats.pending},${groupStats.completed},${groupStats.overdue}\n`;
    }
    
    csvContent += "\n--- ACTIVIDADES FINALIZADAS ---\n";
    csvContent += "Titulo,Fecha Creacion,Fecha Actualizacion\n";
    (completedActivities || []).forEach(c => {
      csvContent += `"${c.title}","${c.createdAt}","${c.updatedAt}"\n`;
    });

    if (userStats) {
      csvContent += "\n--- RENDIMIENTO INDIVIDUAL ---\n";
      csvContent += "Creadas,Pendientes,Completadas,Vencidas\n";
      csvContent += `${userStats.created},${userStats.pending},${userStats.completed},${userStats.overdue}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_sprintHub.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container report-view">
      <header className="dashboard-header report-header">
        <div>
          <h1>Reportes y Análisis</h1>
          <p className="subtitle">Métricas de desempeño del equipo y control de actividades</p>
        </div>
        <div className="report-actions">
          <button className="btn-secondary" onClick={() => window.print()}>Exportar a PDF</button>
          <button className="btn-secondary" onClick={exportToCSV}>Exportar a Excel (CSV)</button>
          {boardId ? (
            <Link to={`/board/${boardId}`} className="btn-primary">Volver al Tablero</Link>
          ) : (
            <Link to={`/groups/${groupId}/boards`} className="btn-primary">Volver al Grupo</Link>
          )}
        </div>
      </header>

      <div className="report-content">
        {/* REQ 74: Rendimiento de grupos */}
        <section className="report-section glass-panel">
          <h2>Rendimiento del Grupo</h2>
          <p className="section-desc">Indicadores globales y gráficos basados en todas las tarjetas de este grupo.</p>
          <div className="stats-grid" style={{ marginBottom: '30px' }}>
            <div className="stat-card">
              <span className="stat-label">Actividades Creadas</span>
              <span className="stat-value">{groupStats?.created || 0}</span>
            </div>
            <div className="stat-card info">
              <span className="stat-label">Actividades Pendientes</span>
              <span className="stat-value">{groupStats?.pending || 0}</span>
            </div>
            <div className="stat-card success">
              <span className="stat-label">Actividades Finalizadas</span>
              <span className="stat-value">{groupStats?.completed || 0}</span>
            </div>
            <div className="stat-card warning">
              <span className="stat-label">Actividades Vencidas</span>
              <span className="stat-value">{groupStats?.overdue || 0}</span>
            </div>
          </div>

          {groupStats && (groupStats.created > 0) && (
            <div className="charts-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
              <div className="chart-box glass-panel" style={{ flex: '1 1 300px', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Distribución (Torta)</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                  {/* CSS Pie Chart */}
                  <div style={{
                    width: '150px', height: '150px', borderRadius: '50%',
                    background: `conic-gradient(
                      #0ea5e9 0% ${(groupStats.pending / groupStats.created) * 100}%, 
                      #22c55e ${(groupStats.pending / groupStats.created) * 100}% ${((groupStats.pending + groupStats.completed) / groupStats.created) * 100}%, 
                      #ef4444 ${((groupStats.pending + groupStats.completed) / groupStats.created) * 100}% 100%
                    )`
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', fontSize: '0.9rem' }}>
                  <span style={{ color: '#0ea5e9' }}>■ Pendientes</span>
                  <span style={{ color: '#22c55e' }}>■ Completadas</span>
                  <span style={{ color: '#ef4444' }}>■ Vencidas</span>
                </div>
              </div>
              
              <div className="chart-box glass-panel" style={{ flex: '2 1 400px', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Comparativa (Plano Cartesiano)</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', paddingBottom: '10px', borderBottom: '2px solid #9fadbc', borderLeft: '2px solid #9fadbc', paddingTop: '20px' }}>
                  {/* CSS Bar Chart */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                    <div style={{ height: `${(groupStats.created / Math.max(groupStats.created, 1)) * 150}px`, width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ marginTop: '10px', fontSize: '0.8rem', color: '#9fadbc' }}>Creadas</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                    <div style={{ height: `${(groupStats.pending / Math.max(groupStats.created, 1)) * 150}px`, width: '100%', background: '#0ea5e9', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ marginTop: '10px', fontSize: '0.8rem', color: '#9fadbc' }}>Pendientes</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                    <div style={{ height: `${(groupStats.completed / Math.max(groupStats.created, 1)) * 150}px`, width: '100%', background: '#22c55e', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ marginTop: '10px', fontSize: '0.8rem', color: '#9fadbc' }}>Completadas</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                    <div style={{ height: `${(groupStats.overdue / Math.max(groupStats.created, 1)) * 150}px`, width: '100%', background: '#ef4444', borderRadius: '4px 4px 0 0' }}></div>
                    <span style={{ marginTop: '10px', fontSize: '0.8rem', color: '#9fadbc' }}>Vencidas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* REQ 75: Rendimiento Individual */}
        <section className="report-section glass-panel">
          <h2>Rendimiento Individual</h2>
          <p className="section-desc">Consulta el desempeño de un integrante específico por periodo.</p>
          <div className="filter-bar">
            <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
              <option value="">Seleccione un usuario...</option>
              {(members || []).map(m => (
                <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                  {m.user?.name || m.user?.email || m.user}
                </option>
              ))}
            </select>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              title="Fecha Inicio"
            />
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              title="Fecha Fin"
            />
            <button className="btn-primary" onClick={fetchUserStats}>Filtrar</button>
          </div>

          {userStats && (
            <div className="stats-grid mt-4">
              <div className="stat-card">
                <span className="stat-label">Asignadas</span>
                <span className="stat-value">{userStats.created}</span>
              </div>
              <div className="stat-card info">
                <span className="stat-label">Pendientes</span>
                <span className="stat-value">{userStats.pending}</span>
              </div>
              <div className="stat-card success">
                <span className="stat-label">Completadas</span>
                <span className="stat-value">{userStats.completed}</span>
              </div>
              <div className="stat-card warning">
                <span className="stat-label">Vencidas</span>
                <span className="stat-value">{userStats.overdue}</span>
              </div>
            </div>
          )}
        </section>

        {/* REQ 73: Consultar actividades finalizadas */}
        <section className="report-section glass-panel">
          <h2>Actividades Finalizadas</h2>
          <p className="section-desc">Lista de tareas que han alcanzado una columna de estado final (Ej. "Hecho", "Finalizado").</p>
          {!completedActivities || completedActivities.length === 0 ? (
            <p className="empty-state">No hay actividades finalizadas registradas.</p>
          ) : (
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Prioridad</th>
                    <th>Fecha de Creación</th>
                    <th>Última Actualización</th>
                  </tr>
                </thead>
                <tbody>
                  {(completedActivities || []).map(card => (
                    <tr key={card._id}>
                      <td>{card.title}</td>
                      <td>
                        <span className={`badge priority-${card.priority}`}>
                          {card.priority}
                        </span>
                      </td>
                      <td>{new Date(card.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(card.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReportDashboard;
