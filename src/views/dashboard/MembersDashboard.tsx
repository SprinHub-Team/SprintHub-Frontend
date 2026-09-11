import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupById, addMemberToGroup } from '../../services/sprintHubServices';
import api from '../../services/api';

import { useAuthStore } from '../../store/useAuthStore';

const MembersDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'collaborator' | 'visitor'>('collaborator');
  const [inviting, setInviting] = useState(false);
  const user = useAuthStore(state => state.user);

  const fetchGroup = async () => {
    if (!groupId) return;
    try {
      const res = await getGroupById(groupId);
      setGroup(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/groups/${groupId}/members/${userId}`, { role: newRole });
      fetchGroup();
      alert('Rol actualizado exitosamente');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar el rol');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar a este miembro del grupo?')) return;
    try {
      await api.delete(`/groups/${groupId}/members/${userId}`);
      fetchGroup();
      alert('Miembro eliminado exitosamente');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el miembro');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !groupId) return;
    try {
      setInviting(true);
      await addMemberToGroup(groupId, inviteEmail, inviteRole);
      alert('Miembro agregado exitosamente');
      setInviteEmail('');
      setShowInviteModal(false);
      fetchGroup();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al invitar al miembro');
    } finally {
      setInviting(false);
    }
  };

  if (!group) return <div style={{ padding: '20px' }}>Cargando miembros...</div>;

  const amIAdminOrOwner = group.ownerId?._id === user?.id || group.ownerId === user?.id || 
    group.members.some((m: any) => (m.user._id === user?.id || m.user === user?.id) && m.role === 'admin');

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ padding: '0 20px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc' }}>
              Miembros del Grupo
            </h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              Administra quién tiene acceso a este espacio de trabajo y sus permisos.
            </p>
          </div>
          {amIAdminOrOwner && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', border: 'none', fontWeight: 600 }}
            >
              <i className="fas fa-user-plus"></i> Invitar Miembro
            </button>
          )}
        </div>

        <div style={{ background: '#1c1f26', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#b6c2cf' }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <tr>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: 600 }}>Usuario</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: 600 }}>Rol</th>
                <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {group.members.map((member: any) => {
                const u = member.user;
                if (!u || !u._id) return null; // Defensive check
                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#579dff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 500 }}>{u.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      {amIAdminOrOwner && u._id !== user?.id && u._id !== group.ownerId?._id ? (
                        <select 
                          value={member.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', outline: 'none' }}
                        >
                          <option value="admin">Administrador</option>
                          <option value="collaborator">Colaborador</option>
                          <option value="visitor">Lector (Visitor)</option>
                        </select>
                      ) : (
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                          background: member.role === 'admin' ? 'rgba(87, 157, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                          color: member.role === 'admin' ? '#579dff' : '#94a3b8'
                        }}>
                          {member.role === 'admin' ? 'Administrador' : member.role === 'collaborator' ? 'Colaborador' : 'Lector'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                      {amIAdminOrOwner && u._id !== user?.id && u._id !== group.ownerId?._id && (
                        <button 
                          onClick={() => handleRemoveMember(u._id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                        >
                          Revocar Acceso
                        </button>
                      )}
                      {u._id === group.ownerId?._id && (
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Propietario</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '450px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Invitar a un nuevo miembro</h3>
              <button 
                type="button" 
                onClick={() => setShowInviteModal(false)} 
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>
                  Correo Electrónico del Usuario
                </label>
                <input 
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>
                  Rol en el Espacio de Trabajo
                </label>
                <select
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1c1f26', color: '#fff' }}
                >
                  <option value="collaborator">Colaborador (Puede editar tableros y tarjetas)</option>
                  <option value="admin">Administrador (Control total del espacio)</option>
                  <option value="visitor">Lector (Solo ver información)</option>
                </select>
              </div>

              <div className="modal-actions" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={inviting}>
                  {inviting ? 'Invitando...' : 'Añadir Miembro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersDashboard;
