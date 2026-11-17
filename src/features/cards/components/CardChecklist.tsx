import { useState, useRef } from 'react';
import { CheckCheck, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { useToast } from '@/components/ui/Toast/Toast';
import { updateCard } from '@/services/socket/socketService';
import type { UpdateCardPayload } from '@/services/socket/socketEvents';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { useActiveBoardStore } from '@/features/boards/store/useActiveBoardStore';
import type { Card } from '../types/card.types';
import { ChecklistProgress } from './ChecklistProgress';

export function CardChecklist({ card }: { card: Card }) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const toast = useToast();
  const change = async (subtask: UpdateCardPayload['subtask']) => {
    if (locked.current) return;
    locked.current = true; setBusy(true);
    try {
      const updated = await updateCard({ cardId: card.id, columnId: card.columnId, subtask });
      useActiveBoardStore.getState().changeCard(updated);
      if (subtask?.action === 'add') setTitle('');
    } catch (error) { toast.error(errorHandler(error).message); }
    finally { locked.current = false; setBusy(false); }
  };
  return <section className="space-y-4 border-t border-(--border-subtle) pt-6" aria-label="Subtareas">
    <h3 className="flex items-center gap-2 text-sm font-semibold"><CheckCheck className="size-4 text-(--sand)" />Subtareas</h3>
    <ChecklistProgress subtasks={card.subtasks} />
    <ul className="space-y-1">
      {card.subtasks.map(task => <li key={task.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-(--ink-hover)">
        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-(--sand)" checked={task.completed} disabled={busy} onChange={e => void change({ action: 'toggle', id: task.id, completed: e.target.checked })} />
          <span className={task.completed ? 'break-words text-(--text-muted) line-through' : 'break-words'}>{task.title}</span>
        </label>
        <button aria-label={`Eliminar subtarea ${task.title}`} disabled={busy} className="p-2 text-(--text-muted) hover:text-(--cream)" onClick={() => void change({ action: 'delete', id: task.id })}><Trash2 className="size-3.5" /></button>
      </li>)}
    </ul>
    <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (title.trim()) void change({ action: 'add', id: crypto.randomUUID(), title: title.trim() }); }}>
      <input aria-label="Nueva subtarea" className="workspace-select min-w-0 flex-1" placeholder="Añadir una subtarea…" maxLength={200} value={title} onChange={e => setTitle(e.target.value)} disabled={busy} />
      <Button type="submit" size="sm" loading={busy} disabled={!title.trim()} icon={<Plus className="size-4" />}>Añadir</Button>
    </form>
  </section>;
}
