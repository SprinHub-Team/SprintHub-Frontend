import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';  

export const GroupSettingsModal = ({ group, onClose, onUpdate }: any) => { 
  const [name, setName] = useState(group.name); 
  const [description, setDescription] = useState(group.description || ''); 
  const [visibility, setVisibility] = useState(group.visibility || 'private'); 
  const [showDelete, setShowDelete] = useState(false); 
  const [deleteConfirm, setDeleteConfirm] = useState(''); 
  const navigate = useNavigate(); 
  const handleSave = async (e: any) => { e.preventDefault(); try { await api.put('/groups/' + group._id, { name, description, visibility }); alert('Espacio actualizado'); onUpdate(); onClose(); } catch (err: any) { alert(err.response?.data?.message || 'Error al actualizar'); } }; 
  const handleDelete = async () => { if(deleteConfirm !== group.name) return alert('El nombre no coincide'); try { await api.delete('/groups/' + group._id); alert('Espacio eliminado'); navigate('/dashboard'); window.location.reload(); } catch (err: any) { alert(err.response?.data?.message || 'Error'); } }; 
  
  return ( 
    <div className="modal-overlay"> 
      <div className="modal-content glass-panel" style={{ maxWidth: '500px', width: '90%' }}> 
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3 style={{ margin: 0 }}>Configuracion del Espacio</h3><button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button></div> 
        {!showDelete ? ( 
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}> 
            <div><label style={{ display: 'block', marginBottom: '8px' }}>Nombre</label><input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}/></div> 
            <div><label style={{ display: 'block', marginBottom: '8px' }}>Descripcion</label><textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}/></div> 
            <div><label style={{ display: 'block', marginBottom: '8px' }}>Visibilidad</label><select value={visibility} onChange={e => setVisibility(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}><option value="private">Privado</option><option value="public">Publico</option></select></div> 
            <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}> 
              <button type="button" onClick={() => setShowDelete(true)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>Eliminar Espacio</button> 
              <div style={{ display: 'flex', gap: '10px' }}><button type="button" onClick={onClose} style={{ padding: '10px 15px', borderRadius: '8px', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancelar</button><button type="submit" className="btn-primary" style={{ padding: '10px 15px', borderRadius: '8px' }}>Guardar Cambios</button></div> 
            </div> 
          </form> 
        ) : ( 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}> 
            <p style={{ color: '#ef4444' }}>Esta accion no se puede deshacer. Por favor, escribe el nombre del espacio (<strong>{group.name}</strong>) para confirmar.</p> 
            <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder={group.name} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}/> 
            <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}> 
              <button type="button" onClick={() => setShowDelete(false)} style={{ padding: '10px 15px', borderRadius: '8px', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancelar</button> 
              <button type="button" onClick={handleDelete} disabled={deleteConfirm !== group.name} style={{ padding: '10px 15px', borderRadius: '8px', background: deleteConfirm === group.name ? '#ef4444' : '#7f1d1d', color: '#fff', border: 'none', cursor: deleteConfirm === group.name ? 'pointer' : 'not-allowed' }}>Eliminar Definitivamente</button> 
            </div> 
          </div> 
        )} 
      </div> 
    </div> 
  ); 
};
