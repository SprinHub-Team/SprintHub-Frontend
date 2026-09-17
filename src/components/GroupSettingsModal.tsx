import { useState, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';  
import { showAlert } from '../utils/alerts';
import { DeleteButton } from './DeleteButton';

export const GroupSettingsModal = ({ group, onClose, onUpdate }: any) => { 
  const [name, setName] = useState(group.name); 
  const [description, setDescription] = useState(group.description || ''); 
  const [visibility, setVisibility] = useState(group.visibility || 'private'); 
  const [profilePicture, setProfilePicture] = useState(group.profilePicture || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate(); 
  const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000';

  const handleSave = async (e: any) => { 
    e.preventDefault(); 
    try { 
      await api.put('/groups/' + group._id, { name, description, visibility }); 
      await showAlert.success('¡Listo!', 'Espacio de trabajo actualizado con éxito'); 
      onUpdate(); 
      onClose(); 
    } catch (err: any) { 
      showAlert.error('Error', err.response?.data?.message || 'Error al actualizar el espacio'); 
    } 
  }; 

  const handleDelete = async () => { 
    try { 
      await api.delete('/groups/' + group._id); 
      await showAlert.success('Eliminado', 'Espacio eliminado definitivamente'); 
      navigate('/dashboard'); 
      window.location.reload(); 
    } catch (err: any) { 
      showAlert.error('Error', err.response?.data?.message || 'Error al eliminar'); 
    } 
  }; 

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(`/groups/${group._id}/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfilePicture(res.data.data.profilePicture);
      showAlert.success('¡Excelente!', 'Foto de perfil actualizada');
      onUpdate();
    } catch (err: any) {
      showAlert.error('Error', err.response?.data?.message || 'No se pudo subir la imagen');
    }
  };
  
  return ( 
    <div className="modal-overlay"> 
      <div className="modal-content glass-panel" style={{ maxWidth: '500px', width: '90%' }}> 
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Configuración del Espacio</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
        </div> 

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}> 
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div 
                style={{ 
                  width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePicture ? (
                  <img src={`${backendUrl}${profilePicture}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="fas fa-image" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem' }}></i>
                )}
              </div>
              <div>
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Cambiar logo</button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>

            <div><label style={{ display: 'block', marginBottom: '8px' }}>Nombre</label><input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}/></div> 
            <div><label style={{ display: 'block', marginBottom: '8px' }}>Descripción</label><textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}/></div> 
            <div><label style={{ display: 'block', marginBottom: '8px' }}>Visibilidad</label><select value={visibility} onChange={e => setVisibility(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1d2125', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}><option value="private">Privado</option><option value="public">Público</option></select></div> 
            <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}> 
              <DeleteButton onConfirm={handleDelete} />
              <div style={{ display: 'flex', gap: '10px' }}><button type="button" onClick={onClose} style={{ padding: '10px 15px', borderRadius: '8px', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancelar</button><button type="submit" className="btn-primary" style={{ padding: '10px 15px', borderRadius: '8px' }}>Guardar Cambios</button></div> 
            </div> 
          </form> 
      </div> 
    </div> 
  ); 
};
