import React, { useState, useEffect } from 'react';
import { updateBoard, removeBoard, addMemberToGroup } from '../../services/sprintHubServices';
import { useNavigate } from 'react-router-dom';

interface BoardSettingsModalProps {
  board: any;
  groupId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const BoardSettingsModal: React.FC<BoardSettingsModalProps> = ({ board, groupId, onClose, onUpdate }) => {
  const [title, setTitle] = useState(board?.title || '');
  const [description, setDescription] = useState(board?.description || '');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(board?.title || '');
    setDescription(board?.description || '');
  }, [board]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateBoard(board._id, { title, description });
      onUpdate();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar el tablero');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este tablero definitivamente?')) return;
    try {
      setLoading(true);
      await removeBoard(board._id);
      navigate(`/groups/${groupId}/boards`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el tablero');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    try {
      setLoading(true);
      await addMemberToGroup(groupId, newMemberEmail, 'member');
      alert(`Usuario ${newMemberEmail} agregado exitosamente.`);
      setNewMemberEmail('');
      onUpdate(); // to refresh members if needed
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al agregar miembro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '500px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Configuración del Tablero</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Nombre del tablero</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Descripción</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', resize: 'none' }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>Guardar Cambios</button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '25px 0' }} />

        <h4 style={{ marginBottom: '15px', color: '#f8fafc' }}>Invitar Colaborador</h4>
        <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <input 
            type="email" 
            placeholder="Correo del usuario..." 
            value={newMemberEmail}
            onChange={e => setNewMemberEmail(e.target.value)}
            required
            style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
          />
          <button type="submit" className="btn-secondary" disabled={loading}>Invitar</button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '25px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: '#ef4444', margin: '0 0 5px 0' }}>Zona de Peligro</h4>
            <span style={{ fontSize: '0.85rem', color: '#9fadbc' }}>Esta acción no se puede deshacer.</span>
          </div>
          <button onClick={handleDelete} className="btn-danger" disabled={loading} style={{ padding: '8px 16px', borderRadius: '8px' }}>
            Eliminar Tablero
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardSettingsModal;
