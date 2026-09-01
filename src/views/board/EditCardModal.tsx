import React, { useState, useEffect } from 'react';
import './Kanban.css'; 
import { getCommentsByCard, createComment, deleteComment } from '../../services/sprintHubServices';
import { useAuthStore } from '../../store/useAuthStore';

interface Task {
  title: string;
  completed: boolean;
}

interface EditCardModalProps {
  card: any;
  members?: any[];
  onClose: () => void;
  onSave: (id: string, data: any) => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, members = [], onClose, onSave }) => {
  const user = useAuthStore(state => state.user);
  
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority || 'media');
  const [tasks, setTasks] = useState<Task[]>(card.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(card.assignedTo || '');

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const res = await getCommentsByCard(card._id);
      setComments(res.data || res || []);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [card._id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    try {
      await createComment({
        name: user.name,
        description: newComment,
        cardId: card._id,
        createdFor: user.id || (user as any)._id,
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error creating comment', error);
      alert('Error al crear comentario');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('¿Seguro que deseas borrar este comentario?')) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment', error);
      alert('Error al eliminar comentario');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(card._id, {
      title,
      description,
      priority,
      tasks,
      assignedTo: assignedTo || undefined, // Evitar enviar string vacío
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { title: newTaskTitle, completed: false }]);
    setNewTaskTitle('');
  };

  const toggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const removeTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content apple-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar Tarjeta</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSave} className="modal-body">
          <div className="form-group">
            <label>Título de la tarea</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="apple-input"
              placeholder="Ej. Diseño de UI"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="apple-input"
              placeholder="Añade detalles más específicos..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prioridad</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="apple-select"
              >
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🟢 Baja</option>
              </select>
            </div>
            <div className="form-group">
              <label>Asignado a</label>
              <select
                value={assignedTo} 
                onChange={(e) => setAssignedTo(e.target.value)}
                className="apple-select"
              >
                <option value="">👤 Sin asignar</option>
                {members.map((m, i) => (
                  <option key={i} value={m.user?._id || m.user}>{m.user?.name || m.user?.email || m.user}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group checklist-section">
            <label>Subtareas (Checklist)</label>
            
            {/* Barra de progreso */}
            {totalTasks > 0 && (
              <div className="progress-container">
                <div className="progress-header">
                  <span>Progreso</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercent}%`, backgroundColor: progressPercent === 100 ? 'var(--success)' : 'var(--accent)' }}
                  ></div>
                </div>
              </div>
            )}

            <div className="add-task-row">
              <input 
                type="text" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                placeholder="Añadir un elemento..."
                className="apple-input"
              />
              <button type="button" onClick={handleAddTask} className="btn-secondary add-task-btn">Añadir</button>
            </div>
            
            <ul className="task-list">
              {tasks.map((task, index) => (
                <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(index)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span className="task-title">{task.title}</span>
                  <button type="button" onClick={() => removeTask(index)} className="remove-task-btn">×</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group comments-section" style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '1.1rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>Comentarios</label>
            
            <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
              {comments.map((comment) => (
                <div key={comment._id} className="comment-bubble" style={{ 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '16px', 
                  borderTopLeftRadius: '4px',
                  padding: '12px 16px',
                  position: 'relative',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem' }}>
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      {comment.name}
                    </span>
                    <button type="button" onClick={() => handleDeleteComment(comment._id)} className="remove-comment-btn" style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', 
                      width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                    }}>×</button>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#f3f4f6', lineHeight: '1.4' }}>{comment.description}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.4)' }}>
                  <i className="fas fa-comments" style={{ fontSize: '2rem', marginBottom: '8px', display: 'block' }}></i>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Sé el primero en comentar</p>
                </div>
              )}
            </div>

            <div className="add-comment-row" style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '16px' }}>
              <input 
                type="text" 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Escribe un comentario brillante..."
                className="apple-input"
                style={{ flex: 1, border: 'none', background: 'transparent', boxShadow: 'none' }}
                onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
              />
              <button type="button" onClick={handleAddComment} style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', 
                borderRadius: '12px', padding: '0 20px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s'
              }}>Enviar</button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;
