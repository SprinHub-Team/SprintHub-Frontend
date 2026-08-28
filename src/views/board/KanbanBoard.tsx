import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { getColumns, createColumn, getCards, updateCard, createCard, deleteCard } from '../../services/sprintHubServices';
import './Kanban.css';

const KanbanBoard: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [columns, setColumns] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [newColumnName, setNewColumnName] = useState('');
  
  const [newCardTitle, setNewCardTitle] = useState('');
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Filtros
  const [searchTitle, setSearchTitle] = useState('');

  const fetchBoardData = async () => {
    if (!boardId) return;
    try {
      const filters = searchTitle ? { title: searchTitle } : undefined;
      const [colsData, cardsData] = await Promise.all([
        getColumns(boardId),
        getCards(boardId, filters)
      ]);
      setColumns(colsData);
      setCards(cardsData);
    } catch (error) {
      console.error('Error fetching board data', error);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [boardId, searchTitle]); // Se actualiza al cambiar el buscador

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId || !newColumnName) return;
    try {
      await createColumn({ name: newColumnName, boardId });
      setNewColumnName('');
      fetchBoardData();
    } catch (error) {
      alert('Error al crear la columna');
    }
  };

  const handleCreateCard = async (e: React.FormEvent, columnId: string) => {
    e.preventDefault();
    if (!boardId || !newCardTitle) return;
    try {
      await createCard({ title: newCardTitle, boardId, listId: columnId });
      setNewCardTitle('');
      setActiveColumnId(null);
      fetchBoardData();
    } catch (error) {
      alert('Error al crear la tarjeta');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedCards = cards.map(c => 
      c._id === draggableId ? { ...c, listId: destination.droppableId } : c
    );
    setCards(updatedCards);

    try {
      await updateCard(draggableId, { listId: destination.droppableId });
      const destColumn = columns.find(c => c._id === destination.droppableId);
      if (destColumn && destColumn.name.toLowerCase().includes('finalizad')) {
        alert('¡Tarea Completada! 🎉');
      }
    } catch (error) {
      console.error('Error moviendo tarjeta', error);
      fetchBoardData(); 
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    try {
      await deleteCard(cardId);
      fetchBoardData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="kanban-wrapper">
      <header className="kanban-header">
        <h1>Tablero Kanban</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Buscar tarjetas..." 
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="search-input"
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <Link to="/dashboard" className="btn-secondary">Volver al Dashboard</Link>
        </div>
      </header>

      <div className="add-column-bar">
        <form onSubmit={handleCreateColumn}>
          <input 
            type="text" 
            placeholder="Nueva Columna" 
            value={newColumnName} 
            onChange={(e) => setNewColumnName(e.target.value)} 
          />
          <button type="submit" className="btn-primary">Añadir Columna</button>
        </form>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {columns.map(col => {
            const columnCards = cards.filter(c => c.listId === col._id || c.listId === col.id);
            return (
              <div key={col._id} className="kanban-column">
                <div className="column-header">
                  <h3>{col.name}</h3>
                  <span className="card-count">{columnCards.length}</span>
                </div>

                <Droppable droppableId={col._id}>
                  {(provided) => (
                    <div 
                      className="column-content"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {columnCards.map((card, index) => (
                        <Draggable key={card._id} draggableId={card._id} index={index}>
                          {(provided) => (
                            <div 
                              className="kanban-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h4>{card.title}</h4>
                              <button onClick={() => handleDeleteCard(card._id)} className="btn-delete-card">×</button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div className="column-footer">
                  {activeColumnId === col._id ? (
                    <form onSubmit={(e) => handleCreateCard(e, col._id)}>
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Título de tarjeta..." 
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        onBlur={() => setActiveColumnId(null)}
                      />
                    </form>
                  ) : (
                    <button className="btn-add-card" onClick={() => setActiveColumnId(col._id)}>
                      + Añadir Tarjeta
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
