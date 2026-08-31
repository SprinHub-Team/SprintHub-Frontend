import React, { useState } from 'react';
import './Kanban.css'; // Mismo estilo

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
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority || 'media');
  const [tasks, setTasks] = useState<Task[]>(card.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const [assignedTo, setAssignedTo] = useState(card.assignedTo || '');

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
