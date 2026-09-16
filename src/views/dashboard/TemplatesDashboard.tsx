import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplates, getMyGroups, createBoard } from '../../services/sprintHubServices';

const TemplatesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [boardTitle, setBoardTitle] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  useEffect(() => {
    getTemplates().then(res => setTemplates(res || []));
    getMyGroups().then(res => setGroups(res.data || res || []));
  }, []);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !boardTitle) return;
    try {
      const newBoard = await createBoard({
        title: boardTitle,
        groupId: selectedGroupId,
        templateId: selectedTemplate.id
      });
      const boardId = newBoard.data?._id || newBoard._id;
      navigate('/board/' + boardId);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear el tablero');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#f8fafc', marginBottom: '10px' }}>Plantillas Disponibles</h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Inicia rápidamente tus proyectos usando estas plantillas predefinidas.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {templates.map(t => (
          <div key={t.id} className="glass-panel pulse-hover" style={{ padding: '25px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#60a5fa', margin: '0 0 10px 0', fontSize: '1.4rem' }}>{t.name}</h3>
            <p style={{ color: '#94a3b8', flex: 1 }}>{t.description}</p>
            <div style={{ marginTop: '15px', marginBottom: '20px' }}>
              <strong style={{ color: '#cbd5e1' }}>Columnas incluidas:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {t.columns.map((c: any) => (
                  <span key={c.title} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', color: '#e2e8f0' }}>
                    {c.title}
                  </span>
                ))}
              </div>
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
              onClick={() => setSelectedTemplate(t)}
            >
              Usar plantilla
            </button>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '400px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Usar plantilla: {selectedTemplate.name}</h3>
              <button type="button" onClick={() => setSelectedTemplate(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateBoard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Nombre del nuevo tablero</label>
                <input 
                  type="text" 
                  value={boardTitle} 
                  onChange={(e) => setBoardTitle(e.target.value)} 
                  required 
                  placeholder="Ej: Desarrollo Backend"
                  style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9fadbc', fontSize: '0.9rem' }}>Espacio de Trabajo</label>
                <select 
                  value={selectedGroupId} 
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                >
                  <option value="" disabled>Selecciona un equipo...</option>
                  {groups.map(g => (
                    <option key={g._id} value={g._id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions" style={{ marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedTemplate(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Tablero</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesDashboard;
