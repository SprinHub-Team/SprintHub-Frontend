import React, { useEffect, useState } from 'react';
import { getMyGroups, createGroup, deleteGroup, addMemberToGroup } from '../../services/sprintHubServices';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const GroupsDashboard: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [emailToAdd, setEmailToAdd] = useState('');
  const [roleToAdd, setRoleToAdd] = useState('collaborator');

  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await getMyGroups();
      setGroups(res?.data || res || []);
    } catch (error) {
      console.error('Error fetching groups', error);
      setGroups([]);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup({ name: newGroupName, description: newGroupDesc });
      setNewGroupName('');
      setNewGroupDesc('');
      setShowCreateModal(false);
      alert('Espacio creado con éxito');
      fetchGroups();
    } catch (error) {
      alert('Error al crear grupo');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este grupo permanentemente?')) return;
    try {
      await deleteGroup(groupId);
      fetchGroups();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar grupo');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId) return;
    try {
      await addMemberToGroup(selectedGroupId, emailToAdd, roleToAdd);
      setEmailToAdd('');
      setSelectedGroupId(null);
      fetchGroups();
      alert('Miembro agregado con éxito');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al agregar miembro');
    }
  };

  return (
    <div className="" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc' }}>
            ¡Bienvenido, {user?.name || 'Usuario'}!
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
            Selecciona un espacio de trabajo para comenzar o crea uno nuevo.
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-plus"></i> Nuevo Espacio
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px' }}>
          <div className="pulse-icon" style={{ margin: '0 auto 20px', fontSize: '2.5rem', color: '#60a5fa' }}>
            <i className="fas fa-users"></i>
          </div>
          <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontSize: '1.4rem' }}>No perteneces a ningún espacio aún</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Crea un nuevo espacio de trabajo para empezar a colaborar con tu equipo.</p>
          <button type="button" onClick={() => setShowCreateModal(true)} className="btn-primary">Crear Espacio</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {groups.map(group => {
            const groupMembers = group.members || [];
            const myMembership = groupMembers.find((m: any) => m.user?._id === user?.id || m.user === user?.id);
            const isIAdmin = myMembership?.role === 'admin';

            return (
              <div key={group._id} className="glass-panel" style={{ padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}></div>
                
                <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc', fontSize: '1.3rem' }}>{group.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 20px 0', flex: 1, minHeight: '40px' }}>
                  {group.description || 'Sin descripción'}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                  <div style={{ display: 'flex' }}>
                    {groupMembers.slice(0, 3).map((m: any, i: number) => (
                      <div key={i} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#fff', border: '2px solid #1e293b', marginLeft: i > 0 ? '-10px' : '0' }}>
                        {(m.user?.name || m.user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {groupMembers.length > 3 && (
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#fff', border: '2px solid #1e293b', marginLeft: '-10px' }}>
                        +{groupMembers.length - 3}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px' }}>
                    Mi Rol: {myMembership?.role || 'Miembro'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" onClick={() => navigate(`/groups/${group._id}/boards`)} style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}>
                    Tableros
                  </button>
                  <button className="btn-secondary" onClick={() => navigate(`/groups/${group._id}/backlog`)} style={{ flex: 1, padding: '10px', fontSize: '0.9rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd' }}>
                    Backlog
                  </button>
                  
                  {isIAdmin && (
                    <div style={{ position: 'relative', display: 'flex', gap: '10px' }}>
                      <button className="icon-btn tooltip" data-tooltip="Invitar miembro" onClick={() => setSelectedGroupId(group._id)} style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                        <i className="fas fa-user-plus"></i>
                      </button>
                      <button className="icon-btn tooltip" data-tooltip="Eliminar grupo" onClick={() => handleDeleteGroup(group._id)} style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Crear Nuevo Espacio</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Nombre del espacio</label>
                <input type="text" placeholder="Ej: Proyecto Alpha" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Descripción</label>
                <textarea placeholder="¿De qué trata este espacio?" value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', resize: 'none' }} />
              </div>
              <div className="modal-actions" style={{ marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Espacio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {selectedGroupId && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '400px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Invitar al equipo</h3>
              <button onClick={() => setSelectedGroupId(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Correo electrónico</label>
                <input type="email" placeholder="usuario@correo.com" value={emailToAdd} onChange={(e) => setEmailToAdd(e.target.value)} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Rol</label>
                <select value={roleToAdd} onChange={(e) => setRoleToAdd(e.target.value)} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                  <option value="admin">Administrador</option>
                  <option value="collaborator">Colaborador</option>
                  <option value="visitor">Visitante</option>
                </select>
              </div>
              <div className="modal-actions" style={{ marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedGroupId(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Enviar Invitación</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsDashboard;
