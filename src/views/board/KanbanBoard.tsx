import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { getColumns, createColumn, getCards, updateCard, createCard, deleteCard, removeColumn } from '../../services/sprintHubServices';
import { showAlert } from '../../utils/alerts';
import EditCardModal from './EditCardModal';
import ReportModal from './ReportModal';
import { socket } from '../../services/socket';

import './Kanban.css';

const KanbanBoard: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [groupId, setGroupId] = useState<string>('');
  console.log(groupId);
  
  const [columns, setColumns] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [newColumnName, setNewColumnName] = useState('');
  
  const [newCardTitle, setNewCardTitle] = useState('');
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  
  const [editingCard, setEditingCard] = useState<any>(null); // Tarjeta siendo editada

  // Filtros
  const [searchTitle, setSearchTitle] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [showReport, setShowReport] = useState(false);

  const fetchBoardData = async () => {
    if (!boardId) return;
    try {
      const filters = searchTitle ? { title: searchTitle } : undefined;
      // Retiramos getBoardById del Promise.all porque la ruta HTTP no existe, 
      // lo pediremos por Socket a continuación.
      const [colsRes, cardsRes] = await Promise.all([
        getColumns(boardId),
        getCards(boardId, filters)
      ]);
      setColumns(colsRes?.data || colsRes || []);
      setCards(cardsRes?.data || cardsRes || []);
    } catch (error) {
      console.error('Error fetching board data', error);
    }
  };

  useEffect(() => {
    fetchBoardData();

    if(!boardId) return;

    socket.emit('board:join', boardId, (res: any) => {
      if (res?.ok && res?.board){
        const bData = res?.board;
            if (bData?.groupId) setGroupId(bData.groupId);
    else if (bData?.group?._id) setGroupId(bData.group._id);

    if (bData?.group?.members) {
      setMembers(bData.group.members);
    } else if (bData?.members) {
      setMembers(bData.members);
    }
      } else {
        console.error('error al unirse al tablero', res?.error);
      }
 
  });
   
  socket.on('column:created', (newColumn) => {
      setColumns(prev => [...prev, newColumn]);
    });
    socket.on('column:updated', (updatedColumn) => {
      setColumns(prev => prev.map(c => c._id === updatedColumn._id ? updatedColumn : c));
    });
    socket.on('column:deleted', (data) => {
      setColumns(prev => prev.filter(c => c._id !== data.columnId));
    });
    // 3. Escuchar Sockets de Tarjetas
    socket.on('card:created', (newCard) => {
      setCards(prev => [...prev, newCard]);
    });
    socket.on('card:updated', (updatedCard) => {
      setCards(prev => prev.map(c => c._id === updatedCard._id ? updatedCard : c));
    });
    socket.on('card:deleted', (cardId) => {
      setCards(prev => prev.filter(c => c._id !== cardId));
    });
    // Limpieza de sockets al desmontar el componente
    return () => {
      socket.emit('board:leave', boardId);
      socket.off('column:created');
      socket.off('column:updated');
      socket.off('column:deleted');
      socket.off('card:created');
      socket.off('card:updated');
      socket.off('card:deleted');
    };
  }, [boardId, searchTitle]);

      const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName) return;
    try {
      await createColumn({ name: newColumnName, boardId: boardId! });
      setNewColumnName('');
      fetchBoardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCard = async (e: React.FormEvent, columnId: string) => {
    e.preventDefault();
    if (!newCardTitle) return;
    try {
      await createCard({ title: newCardTitle, columnId });
      setNewCardTitle('');
      setActiveColumnId(null);
      fetchBoardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCardDetails = async (cardId: string, data: any) => {
    try {
      await updateCard(cardId, data);
      setEditingCard(null);
      fetchBoardData();
    } catch (error: any) {
      showAlert.error('Aviso', error.response?.data?.message || 'Error al actualizar la tarjeta');
    }
  };


  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedCards = cards.map(c => 
      c._id === draggableId ? { ...c, columnId: destination.droppableId } : c
    );
    setCards(updatedCards);

    try {
      await updateCard(draggableId, { columnId: destination.droppableId });
      const destColumn = columns.find(c => c._id === destination.droppableId);
      if (destColumn && destColumn.name.toLowerCase().includes('finalizad')) {
        showAlert.success('¡Listo!', '¡Tarea Completada! 🎉');
      }
    } catch (error) {
      console.error('Error moviendo tarjeta', error);
      fetchBoardData(); 
    }
  };

  const handleDeleteCard = async (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation(); // Evitar abrir el modal al eliminar
    if (!window.confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    try {
      await deleteCard(cardId);
      fetchBoardData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="kanban-wrapper" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '0 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header className="kanban-header">
        <h1>Tablero Kanban</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="filters" style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Buscar tarjetas..." 
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="search-input"
              style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
            />
            <select 
              value={assigneeFilter} 
              onChange={(e) => setAssigneeFilter(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#b6c2cf', outline: 'none' }}
            >
              <option value="" style={{ color: '#000' }}>Todos los asignados</option>
              {members.map(m => (
                <option key={m.user?._id || m.user} value={m.user?._id || m.user} style={{ color: '#000' }}>
                  {m.user?.name || m.user?.email || 'Miembro'}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" style={{ borderRadius: '20px' }} onClick={() => setShowReport(true)}>
              <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i> Reporte
            </button>
            <Link to="/dashboard" className="btn-secondary" style={{ borderRadius: '20px' }}>Volver</Link>
          </div>
        </div>
      </header>

      <div className="add-column-bar">
        <form onSubmit={handleCreateColumn} style={{ display: 'flex', gap: '10px' }}>
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
            const columnCards = cards
              .filter(c => c.columnId === col._id || c.columnId === col.id)
              .filter(c => searchTitle ? c.title.toLowerCase().includes(searchTitle.toLowerCase()) : true)
              .filter(c => assigneeFilter ? c.assignedTo === assigneeFilter : true);
            
            return (
              <div key={col._id} className="kanban-column">
                <div className="column-header">
                  <h3>{col.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="card-count">{columnCards.length}</span>
                    <button 
                      onClick={() => {
                        if(window.confirm('¿Eliminar esta columna y todo su contenido?')) {
                          removeColumn(col._id).then(fetchBoardData).catch(e => showAlert.error('Error', e.response?.data?.message || 'Error'));
                        }
                      }} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Eliminar columna"
                    >
                      ×
                    </button>
                  </div>
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
                          {(provided) => {
                            // Encontrar al miembro asignado
                            const assignee = members.find(m => (m.user?._id || m.user) === card.assignedTo);
                            const assigneeName = assignee ? (assignee.user?.name || assignee.user?.email || 'Asignado') : null;
                            
                            return (
                              <div 
                                className="kanban-card"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setEditingCard(card)}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h4>{card.title}</h4>
                                  <button onClick={(e) => handleDeleteCard(e, card._id)} className="btn-delete-card">×</button>
                                </div>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                                  {card.priority && (
                                    <span style={{ fontSize: '0.8rem', padding: '2px 6px', borderRadius: '10px', background: 'var(--accent)', color: 'white', display: 'inline-block' }}>
                                      {card.priority}
                                    </span>
                                  )}
                                  {assigneeName && (
                                    <span style={{ fontSize: '0.8rem', padding: '2px 6px', borderRadius: '10px', background: 'var(--bg-secondary)', color: 'var(--text)', display: 'inline-block', border: '1px solid var(--border)' }}>
                                      👤 {assigneeName}
                                    </span>
                                  )}
                                </div>
                                {card.tasks && card.tasks.length > 0 && (
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                    <i className="fas fa-check-square"></i> {card.tasks.filter((t: any) => t.completed).length}/{card.tasks.length}
                                  </div>
                                )}
                              </div>
                            )
                          }}
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
      
      {editingCard && (
        <EditCardModal 
          card={editingCard} 
          members={members}
          onClose={() => setEditingCard(null)} 
          onSave={handleUpdateCardDetails} 
        />
      )}

      {showReport && (
        <ReportModal 
          boardName="Kanban Board"
          columns={columns}
          cards={cards}
          members={members}
          onClose={() => setShowReport(false)}
        />
      )}
      </div>
    </div>
  );
};

export default KanbanBoard;
