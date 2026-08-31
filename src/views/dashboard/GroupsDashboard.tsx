import React, { useEffect, useState } from 'react';
import { getMyGroups, createGroup, deleteGroup, addMemberToGroup } from '../../services/sprintHubServices';
import { useAuthStore } from '../../store/useAuthStore';
import './Dashboard.css';

import { useNavigate } from 'react-router-dom';

const GroupsDashboard: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  
  // Para agregar miembros
  const [emailToAdd, setEmailToAdd] = useState('');
  const [roleToAdd, setRoleToAdd] = useState('collaborator');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
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
      fetchGroups();
    } catch (error) {
      alert('Error al crear grupo');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este grupo?')) return;
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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenido, {user?.name}</h1>
        <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
      </header>

      <section className="create-group-section">
        <h2>Crear Nuevo Grupo de Trabajo</h2>
        <form onSubmit={handleCreateGroup} className="create-group-form">
          <input 
            type="text" 
            placeholder="Nombre del grupo" 
            value={newGroupName} 
            onChange={(e) => setNewGroupName(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Descripción (opcional)" 
            value={newGroupDesc} 
            onChange={(e) => setNewGroupDesc(e.target.value)} 
          />
          <button type="submit" className="btn-primary">Crear Grupo</button>
        </form>
      </section>

      <section className="groups-list-section">
        <h2>Mis Grupos</h2>
        {groups.length === 0 ? <p>No perteneces a ningún grupo aún.</p> : (
          <div className="groups-grid">
            {groups.map(group => {
              // Determinar si soy admin
              const myMembership = group.members.find((m: any) => m.user?._id === user?.id);
              const isIAdmin = myMembership?.role === 'admin';

              return (
                <div key={group._id} className="group-card">
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <p><strong>Mi Rol:</strong> {myMembership?.role}</p>

                  <div className="members-list">
                    <h4>Miembros:</h4>
                    <ul>
                      {group.members.map((m: any) => (
                        <li key={m.user?._id}>{m.user?.name} ({m.role})</li>
                      ))}
                    </ul>
                  </div>

                  <div className="group-actions">
                    {/* Botón ir al tablero... (Próximo módulo de Eduar) */}
                    <button className="btn-secondary" onClick={() => navigate(`/groups/${group._id}/boards`)}>Ver Tableros</button>
                    
                    {isIAdmin && (
                      <>
                        <button className="btn-add-member" onClick={() => setSelectedGroupId(group._id)}>
                          Agregar Miembro
                        </button>
                        <button className="btn-danger" onClick={() => handleDeleteGroup(group._id)}>
                          Eliminar Grupo
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Modal / Formulario flotante para agregar miembro */}
      {selectedGroupId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Miembro</h3>
            <form onSubmit={handleAddMember}>
              <input 
                type="email" 
                placeholder="Correo del usuario" 
                value={emailToAdd} 
                onChange={(e) => setEmailToAdd(e.target.value)} 
                required 
              />
              <select value={roleToAdd} onChange={(e) => setRoleToAdd(e.target.value)}>
                <option value="admin">Administrador</option>
                <option value="collaborator">Colaborador</option>
                <option value="visitor">Visitante</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedGroupId(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsDashboard;
