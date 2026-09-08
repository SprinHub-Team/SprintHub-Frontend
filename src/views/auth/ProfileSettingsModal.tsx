import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

interface ProfileSettingsModalProps {
  onClose: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ onClose }) => {
  const user = useAuthStore((state: any) => state.user);
  const setUser = useAuthStore((state: any) => state.setUser);
  
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Eduar's API for update user? Let's check sprintHubServices or just use generic PUT /users/:id
      const res = await api.put(`/users/${user?.id || user?._id}`, { name });
      const updatedUser = res.data?.data || res.data || { ...user, name };
      setUser(updatedUser);
      alert('Perfil actualizado con éxito');
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '400px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Editar Perfil</h3>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Nombre Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#6b7280', cursor: 'not-allowed' }}
            />
          </div>
          <div className="modal-actions" style={{ marginTop: '10px' }}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
