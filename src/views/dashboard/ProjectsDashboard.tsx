import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { getMyGroups, getBoards } from '../../services/sprintHubServices'; 
const ProjectsDashboard: React.FC = () => { 
  const navigate = useNavigate(); 
  const [boards, setBoards] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  useEffect(() => { 
    const fetchAllBoards = async () => { 
      try { 
        const res = await getMyGroups(); 
        const groups = res?.data || res || []; 
        let allBoards: any[] = []; 
        for (const g of groups) { 
          const bRes = await getBoards(g._id); 
          const bList = bRes?.data || bRes || []; 
          bList.forEach((b: any) => b.groupName = g.name); 
          allBoards = [...allBoards, ...bList]; 
        } 
        setBoards(allBoards); 
      } catch (err) { console.error('Error', err); } finally { setLoading(false); } 
    }; fetchAllBoards(); 
  }, []); 
  if (loading) return <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Cargando proyectos...</div>; 
  return ( 
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}> 
      <h1 style={{ color: '#f8fafc', marginBottom: '10px' }}>Todos mis Proyectos (Tableros)</h1> 
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Vista global de todos los tableros en los que participas.</p> 
      {boards.length === 0 ? ( 
        <div className=" "glass-panel style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px' }}> 
          <p style={{ color: '#94a3b8' }}>Aun no tienes ningun proyecto.</p> 
          <button className=" "btn-primary onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>Ir a mis equipos</button> 
        </div> 
      ) : ( 
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}> 
          {boards.map(b => ( 
            <div key={b._id} className=" glass-panel "pulse-hover style={{ padding: '25px', borderRadius: '12px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}> 
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}></div> 
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>{b.groupName}</div> 
              <h3 style={{ color: '#60a5fa', margin: '0 0 10px 0', fontSize: '1.4rem' }}>{b.title}</h3> 
              <p style={{ color: '#94a3b8', flex: 1 }}>{b.description || 'Sin descripcion'}</p> 
              <button className=" "btn-primary style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '20px' }} onClick={() => navigate('/board/' + b._id)}>Ir al tablero</button> 
            </div> 
          ))} 
        </div> 
      )} 
    </div> 
  ); 
}; export default ProjectsDashboard; 
