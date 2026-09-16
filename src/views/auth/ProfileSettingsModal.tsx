import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { showAlert } from '../../utils/alerts';

interface ProfileSettingsModalProps {
  onClose: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ onClose }) => {
  const user = useAuthStore((state: any) => state.user);
  const setUser = useAuthStore((state: any) => state.setUser);
  
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000';

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: any = { name };
      if (password) payload.password = password;
      const res = await api.put(`/users/${user?.id || user?._id}`, payload);
      const rawUser = res.data?.data || res.data || {};
      const updatedUser = {
        ...user,
        ...rawUser,
        name: rawUser.name || name,
        id: rawUser.id || rawUser._id || user?.id || user?._id,
      };
      setUser(updatedUser);
      showAlert.success('Perfil actualizado', 'Tus datos se guardaron con éxito');
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      showAlert.error('Error', error.response?.data?.message || error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(`/users/${user?.id || user?._id}/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newPic = res.data?.profilePicture || res.data?.data?.profilePicture;
      if (newPic) {
        setProfilePicture(newPic);
        setUser({ ...user, profilePicture: newPic });
        showAlert.success('¡Excelente!', 'Foto de perfil actualizada');
      }
    } catch (err: any) {
      showAlert.error('Error', err.response?.data?.message || 'No se pudo subir la imagen');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content glass-panel" style={{ maxWidth: '450px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Editar Perfil</h3>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Profile Picture Uploader */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', marginBottom: '10px' }}>
            <div 
              style={{ 
                width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePicture ? (
                <img src={`${backendUrl}${profilePicture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', color: '#fff' }}>{name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Cambiar foto</button>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>
          </div>

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
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Nueva Contraseña (Opcional)</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Deja en blanco para no cambiar"
              style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            />
          </div>
          <div className="modal-actions" style={{ marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '10px 15px', borderRadius: '8px' }}>Guardar Cambios</button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
