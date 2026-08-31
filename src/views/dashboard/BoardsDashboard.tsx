import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoards, createBoard, removeBoard } from '../../services/sprintHubServices';
import './Dashboard.css';

const BoardsDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchBoards = async () => {
    if (!groupId) return;
    try {
<<<<<<< HEAD
      const res = await getBoards(groupId);
      setBoards(res?.data || res || []);
    } catch (error) {
      console.error('Error fetching boards', error);
=======
      const data = await getBoards(groupId);
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards', error);
      // Podría ser 404 si no hay tableros, lo manejamos limpiando la lista
>>>>>>> 26cc57b8569dcb9c7f8ea929ea4a47bf11e3d071
      setBoards([]);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [groupId]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) return;
    try {
      await createBoard({ title, description, groupId });
      setTitle('');
      setDescription('');
      fetchBoards();
    } catch (error: any) {
<<<<<<< HEAD
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map((e: any) => `${e.path?.join('.')}: ${e.message}`).join(', ')
        : (error.response?.data?.message || 'Error al crear el tablero');
      alert(errorMsg);
=======
      alert(error.response?.data?.message || 'Error al crear el tablero');
>>>>>>> 26cc57b8569dcb9c7f8ea929ea4a47bf11e3d071
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este tablero?')) return;
    try {
      await removeBoard(boardId);
      fetchBoards();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableros del Grupo</h1>
        <Link to="/dashboard" className="btn-secondary">Volver a mis Grupos</Link>
      </header>

      <section className="create-group-section">
        <h2>Crear Nuevo Tablero</h2>
        <form onSubmit={handleCreateBoard} className="create-group-form">
          <input 
            type="text" 
            placeholder="Nombre del tablero" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Descripción (opcional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <button type="submit" className="btn-primary">Crear</button>
        </form>
      </section>

      <section className="groups-list-section">
        <h2>Tableros Disponibles</h2>
        {boards.length === 0 ? <p>No hay tableros en este grupo aún.</p> : (
          <div className="groups-grid">
            {boards.map(board => (
              <div key={board._id} className="group-card">
                <h3>{board.title}</h3>
                <p>{board.description}</p>
                <div className="group-actions" style={{ marginTop: '1rem' }}>
                  <button className="btn-primary" onClick={() => navigate(`/board/${board._id}`)}>
                    Abrir Tablero
                  </button>
                  <button className="btn-danger" onClick={() => handleDeleteBoard(board._id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BoardsDashboard;
