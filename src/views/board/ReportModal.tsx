import React, { useMemo } from 'react';
import './ReportModal.css';

interface ReportModalProps {
  boardName: string;
  columns: any[];
  cards: any[];
  members: any[];
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ boardName, columns, cards, members, onClose }) => {
  // Aggregate stats
  const totalCards = cards.length;
  const completedCards = cards.filter(c => {
    const col = columns.find(col => col._id === c.columnId || col.id === c.columnId);
    return col && col.name.toLowerCase().includes('hecho') || col?.name.toLowerCase().includes('finalizad');
  }).length;
  const pendingCards = totalCards - completedCards;

  // Task stats
  const totalTasks = cards.reduce((acc, c) => acc + (c.tasks?.length || 0), 0);
  const completedTasks = cards.reduce((acc, c) => acc + (c.tasks?.filter((t: any) => t.completed).length || 0), 0);

  // Activity Log (Recent Cards Created/Updated)
  const activityLog = useMemo(() => {
    const log: any[] = [];
    cards.forEach(c => {
      const assignee = members.find(m => (m.user?._id || m.user) === c.assignedTo);
      const assigneeName = assignee ? (assignee.user?.name || assignee.user?.email || 'Alguien') : 'Sin asignar';
      
      if (c.createdAt) {
        log.push({
          id: c._id + '_created',
          type: 'CREATE',
          cardTitle: c.title,
          date: new Date(c.createdAt),
          text: `Tarjeta "${c.title}" creada. Asignado a: ${assigneeName}`
        });
      }
      
      if (c.updatedAt && c.updatedAt !== c.createdAt) {
        log.push({
          id: c._id + '_updated',
          type: 'UPDATE',
          cardTitle: c.title,
          date: new Date(c.updatedAt),
          text: `Tarjeta "${c.title}" fue actualizada. Asignado a: ${assigneeName}`
        });
      }
    });

    // Sort descending by date
    return log.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [cards, members]);

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal-content" onClick={e => e.stopPropagation()}>
        <header className="report-header">
          <div>
            <h2>Reporte de Auditoría</h2>
            <p>Espacio: {boardName}</p>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        <div className="report-body">
          <div className="report-stats">
            <div className="stat-card">
              <div className="stat-value">{totalCards}</div>
              <div className="stat-label">Total de Tarjetas</div>
            </div>
            <div className="stat-card success">
              <div className="stat-value">{completedCards}</div>
              <div className="stat-label">Tarjetas Finalizadas</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-value">{pendingCards}</div>
              <div className="stat-label">Tarjetas Pendientes</div>
            </div>
            <div className="stat-card info">
              <div className="stat-value">{completedTasks} / {totalTasks}</div>
              <div className="stat-label">Subtareas Completadas</div>
            </div>
          </div>

          <h3 className="timeline-title">Registro de Actividad Reciente</h3>
          <div className="timeline-container">
            {activityLog.length === 0 ? (
              <p className="no-activity">No hay actividad registrada.</p>
            ) : (
              <div className="timeline">
                {activityLog.map(item => (
                  <div key={item.id} className="timeline-item">
                    <div className={`timeline-dot ${item.type === 'CREATE' ? 'dot-create' : 'dot-update'}`}></div>
                    <div className="timeline-content">
                      <div className="timeline-text">{item.text}</div>
                      <div className="timeline-date">{item.date.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <footer className="report-footer">
          <button className="btn-secondary-modern" onClick={onClose}>Cerrar</button>
          <button className="btn-primary-modern" onClick={() => window.print()}>Imprimir Reporte</button>
        </footer>
      </div>
    </div>
  );
};

export default ReportModal;
