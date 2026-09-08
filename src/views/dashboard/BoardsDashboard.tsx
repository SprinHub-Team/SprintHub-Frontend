import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoards, createBoard, removeBoard } from '../../services/sprintHubServices';
import './Dashboard.css';

const BoardsDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchBoards = async () => {
    if (!groupId) return;
    try {
      const res = await getBoards(groupId);
      setBoards(res?.data || res || []);
    } catch (error) {
      console.error('Error fetching boards', error);
      setBoards([]);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [groupId]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) return;
    try {
      await createBoard({ title, description, groupId });
      setTitle('');
      setDescription('');
      setShowCreateModal(false);
      fetchBoards();
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map((e: any) => `${e.path?.join('.')}: ${e.message}`).join(', ')
        : (error.response?.data?.message || 'Error al crear el tablero');
      alert(errorMsg);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este tablero?')) return;
    try {
      await removeBoard(boardId);
      fetchBoards();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div className="" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc' }}>
            Tableros del Grupo
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
            Gestiona y organiza los espacios de trabajo de tu equipo.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/groups/${groupId}/backlog`} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
            <i className="fas fa-list" style={{ marginRight: '8px' }}></i> Backlog
          </Link>
          <Link to={`/groups/${groupId}/reports`} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '12px' }}>
            <i className="fas fa-chart-pie" style={{ marginRight: '8px' }}></i> Ver Reportes
          </Link>
          <Link to="/dashboard" className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '12px' }}>
            Volver
          </Link>
          <button type="button" onClick={() => setShowCreateModal(true)} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-plus"></i> Nuevo Tablero
          </button>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Crear Nuevo Tablero</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateBoard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Nombre del tablero</label>
                <input 
                  type="text" 
                  placeholder="Ej: Desarrollo Backend"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Descripción (opcional)</label>
                <textarea 
                  placeholder="Describe el propósito del tablero..."
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', resize: 'none' }}
                />
              </div>
              <div className="modal-actions" style={{ marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Tablero</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {boards.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px' }}>
          <div className="pulse-icon" style={{ margin: '0 auto 20px', fontSize: '2.5rem', color: '#60a5fa' }}>
            <i className="fas fa-border-all"></i>
          </div>
          <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontSize: '1.4rem' }}>Aún no hay tableros aquí</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Crea el primer tablero para empezar a organizar las tareas.</p>
          <button type="button" onClick={() => setShowCreateModal(true)} className="btn-primary">Crear Tablero</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {boards.map(board => (
            <div key={board._id} className="glass-panel" style={{ padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}></div>
              
              <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontSize: '1.3rem' }}>{board.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 20px 0', flex: 1, minHeight: '40px' }}>
                {board.description || 'Sin descripción'}
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" onClick={() => navigate(`/board/${board._id}`)} style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}>
                  Abrir Tablero
                </button>
                <div style={{ position: 'relative', display: 'flex', gap: '10px' }}>
                  <button className="icon-btn tooltip" data-tooltip="Eliminar tablero" onClick={() => handleDeleteBoard(board._id)} style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardsDashboard;
