import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getBacklog, createBacklogCard, deleteBacklogCard, exportBacklogCsv,
  getSprints, createSprint, moveCardToSprint, getSprintCards, exportCardToBoard,
  getBoards, getColumns
} from '../../services/sprintHubServices';


const BacklogDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [backlogCards, setBacklogCards] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [sprintCardsMap, setSprintCardsMap] = useState<Record<string, any[]>>({});
  
  // Filters
  const [search, setSearch] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // UI States
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  
  // Export to Board State
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCardForExport, setSelectedCardForExport] = useState<string | null>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [columns, setColumns] = useState<any[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState('');

  // Form States
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintStartDate, setNewSprintStartDate] = useState('');
  const [newSprintEndDate, setNewSprintEndDate] = useState('');

  const fetchBacklog = async () => {
    if (!groupId) return;
    try {
      const data = await getBacklog(groupId, search, assignedTo);
      setBacklogCards(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error fetching backlog', error);
      setBacklogCards([]);
    }
  };

  const fetchSprints = async () => {
    if (!groupId) return;
    try {
      const data = await getSprints(groupId);
      const sprintList = Array.isArray(data) ? data : (data?.data || []);
      setSprints(sprintList);
      // Fetch cards for each sprint
      const map: Record<string, any[]> = {};
      for (const sp of sprintList) {
        if (!sp?._id) continue;
        const cards = await getSprintCards(sp._id);
        map[sp._id] = Array.isArray(cards) ? cards : (cards?.data || []);
      }
      setSprintCardsMap(map);
    } catch (error) {
      console.error('Error fetching sprints', error);
      setSprints([]);
      setSprintCardsMap({});
    }
  };

  const loadData = async () => {
    await Promise.all([fetchBacklog(), fetchSprints()]);
  };

  useEffect(() => {
    loadData();
  }, [groupId, search, assignedTo]);

  // Actions
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !newCardTitle) return;
    try {
      await createBacklogCard({ title: newCardTitle, description: newCardDesc, groupId });
      setNewCardTitle('');
      setNewCardDesc('');
      setShowCreateCard(false);
      fetchBacklog();
    } catch (error) {
      alert('Error al crear actividad');
    }
  };

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) return;
    try {
      await createSprint({ 
        name: newSprintName, 
        startDate: newSprintStartDate, 
        endDate: newSprintEndDate, 
        groupId 
      });
      setNewSprintName('');
      setNewSprintStartDate('');
      setNewSprintEndDate('');
      setShowCreateSprint(false);
      fetchSprints();
    } catch (error) {
      alert('Error al crear sprint');
    }
  };

  const handleMoveCard = async (cardId: string, sprintId: string | null) => {
    try {
      await moveCardToSprint(cardId, sprintId);
      loadData(); // reload all
    } catch (error) {
      alert('Error al mover actividad');
    }
  };

  const handleExportCsv = async () => {
    if (!groupId) return;
    try {
      const blob = await exportBacklogCsv(groupId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'backlog_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error al exportar CSV');
    }
  };

  // Export to Board logic
  const openExportModal = async (cardId: string) => {
    setSelectedCardForExport(cardId);
    setShowExportModal(true);
    if (!groupId) return;
    try {
      const bs = await getBoards(groupId);
      setBoards(Array.isArray(bs) ? bs : (bs?.data || []));
    } catch (e) {
      console.error(e);
      setBoards([]);
    }
  };

  const handleBoardSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bId = e.target.value;
    setSelectedBoardId(bId);
    if (!bId) {
      setColumns([]);
      return;
    }
    try {
      const cols = await getColumns(bId);
      setColumns(Array.isArray(cols) ? cols : (cols?.data || []));
    } catch (error) {
      console.error(error);
      setColumns([]);
    }
  };

  const confirmExport = async () => {
    if (!selectedCardForExport || !selectedColumnId) return;
    try {
      await exportCardToBoard(selectedCardForExport, selectedColumnId);
      setShowExportModal(false);
      setSelectedCardForExport(null);
      setSelectedBoardId('');
      setSelectedColumnId('');
      loadData();
      alert('Actividad exportada al tablero con éxito!');
    } catch (error) {
      alert('Error al exportar');
    }
  };

  return (
    <div className="" style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ padding: '0 20px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc' }}>
            Product Backlog
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem' }}>
            Planifica tus sprints y gestiona las actividades.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={handleExportCsv} className="btn-secondary" style={{ padding: '10px 16px', borderRadius: '12px' }}>
              <i className="fas fa-file-csv" style={{ marginRight: '8px' }}></i> Exportar CSV
            </button>
            <button type="button" onClick={() => setShowCreateSprint(true)} className="btn-primary" style={{ padding: '10px 16px', borderRadius: '12px' }}>
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Crear Sprint
            </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="glass-panel" style={{ padding: '15px 20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
          <input 
            type="text" 
            placeholder="Buscar por título o descripción..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
          />
        </div>
        <div style={{ width: '250px' }}>
          <input 
            type="text" 
            placeholder="Filtrar por ID de usuario asignado..." 
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
          />
        </div>
      </div>

      {/* SPRINTS */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.4rem', marginBottom: '15px' }}><i className="fas fa-running" style={{color:'#3b82f6', marginRight:'8px'}}></i> Sprints Activos</h2>
        {sprints.length === 0 ? (
          <div style={{ padding: '20px', color: '#64748b', fontStyle: 'italic', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            No hay sprints creados.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {sprints.map(sprint => (
              <div key={sprint._id} className="glass-panel" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#f8fafc' }}>{sprint.name} <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>{sprint.status}</span></h3>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(sprintCardsMap[sprint._id] || []).map(card => (
                    <div key={card._id} style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{card.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{card.description || 'Sin descripción'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openExportModal(card._id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', background: '#10b981' }}>
                          <i className="fas fa-share-square"></i> Exportar a Tablero
                        </button>
                        <button onClick={() => handleMoveCard(card._id, null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          <i className="fas fa-arrow-down"></i> Mover a Backlog
                        </button>
                      </div>
                    </div>
                  ))}
                  {(sprintCardsMap[sprint._id] || []).length === 0 && (
                    <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '10px' }}>Arrastra actividades aquí o muévelas desde el Backlog.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BACKLOG LIST */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: '#e2e8f0', fontSize: '1.4rem', margin: 0 }}><i className="fas fa-list" style={{color:'#8b5cf6', marginRight:'8px'}}></i> Backlog</h2>
          <button onClick={() => setShowCreateCard(true)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <i className="fas fa-plus"></i> Añadir Actividad
          </button>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
          {backlogCards.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '30px 0' }}>
              El backlog está vacío. ¡Añade tu primera actividad!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {backlogCards.map(card => (
                <div key={card._id} style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{card.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{card.description || 'Sin descripción'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      onChange={(e) => handleMoveCard(card._id, e.target.value)} 
                      value=""
                      style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}
                    >
                      <option value="" disabled>Mover a Sprint...</option>
                      {sprints.map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                    <button onClick={() => deleteBacklogCard(card._id).then(loadData)} className="icon-btn tooltip" data-tooltip="Eliminar" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', width: '32px', height: '32px' }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE SPRINT MODAL */}
      {showCreateSprint && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
            <h3>Crear Nuevo Sprint</h3>
            <form onSubmit={handleCreateSprint} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Nombre del Sprint (Ej. Sprint 1)" value={newSprintName} onChange={e => setNewSprintName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}/>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Fecha de inicio</label>
                <input type="date" value={newSprintStartDate} onChange={e => setNewSprintStartDate(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', marginTop: '5px' }}/>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Fecha de fin</label>
                <input type="date" value={newSprintEndDate} onChange={e => setNewSprintEndDate(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', marginTop: '5px' }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateSprint(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BACKLOG CARD MODAL */}
      {showCreateCard && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <h3>Nueva Actividad</h3>
            <form onSubmit={handleCreateCard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Título" value={newCardTitle} onChange={e => setNewCardTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}/>
              <textarea placeholder="Descripción" value={newCardDesc} onChange={e => setNewCardDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', resize: 'none' }}></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateCard(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Añadir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT TO BOARD MODAL */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
            <h3>Exportar a Tablero Kanban</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Selecciona el tablero y la columna de destino.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Tablero</label>
                <select value={selectedBoardId} onChange={handleBoardSelect} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="" disabled>Selecciona un tablero...</option>
                  {boards.map(b => (
                    <option key={b._id} value={b._id}>{b.title}</option>
                  ))}
                </select>
              </div>
              
              {selectedBoardId && (
                <div className="">
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Columna (Estado)</label>
                  <select value={selectedColumnId} onChange={e => setSelectedColumnId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <option value="" disabled>Selecciona una columna...</option>
                    {columns.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button type="button" onClick={() => {setShowExportModal(false); setSelectedBoardId(''); setSelectedColumnId('');}} className="btn-secondary">Cancelar</button>
                <button type="button" onClick={confirmExport} disabled={!selectedColumnId} className="btn-primary" style={{ opacity: !selectedColumnId ? 0.5 : 1 }}>Exportar</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default BacklogDashboard;
