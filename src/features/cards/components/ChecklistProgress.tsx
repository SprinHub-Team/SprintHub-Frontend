import type { Card } from '../types/card.types';
export function ChecklistProgress({ subtasks }: { subtasks: Card['subtasks'] }) {
  const done = subtasks.filter(t => t.completed).length;
  const percentage = subtasks.length ? Math.round(done / subtasks.length * 100) : 0;
  return <div className="w-full space-y-2">
    <div className="flex justify-between text-xs text-(--text-on-dark-muted)"><span>{done}/{subtasks.length} subtareas</span><span>{percentage}%</span></div>
    <div role="progressbar" aria-label="Progreso de subtareas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} className="h-1.5 overflow-hidden rounded-full bg-(--ink-hover)">
      <div className="h-full rounded-full bg-(image:--gradient-main) transition-[width] duration-500 ease-out" style={{ width: `${percentage}%` }} />
    </div>
  </div>;
}
