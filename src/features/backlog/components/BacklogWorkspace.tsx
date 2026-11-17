import { useState, type ReactNode } from 'react';
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, useDroppable, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowUp, BookOpen, Bug, CheckSquare, ChevronDown, Download, GripVertical, ListTodo, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import type { GroupDetails } from '@/features/groups/types/group.types';
import { useDashboardStore } from '@/features/dashboard/store/useDashboardStore';
import { cn } from '@/lib/utils';
import { useBacklog } from '../hooks/useBacklog';
import { backlogService, type Issue, type Sprint } from '../services/backlogService';
import { IssueEditor } from './IssueEditor';

const statusLabel = { pendiente: 'Pendiente', en_progreso: 'En progreso', completada: 'Completada' };
function formatSprintDate(value: string) {
  const date = value.length === 10 ? value + 'T00:00:00' : value;
  return new Date(date).toLocaleDateString();
}

const typeIcon = { historia: BookOpen, tarea: CheckSquare, error: Bug };

function IssueRow({ issue, disabled, selected, onSelect, onEdit, onMove, onRank, sprints, onOpenBoard }: {
  issue: Issue; disabled: boolean; selected: boolean; onSelect: () => void; onEdit: () => void; onMove: (id: string) => void; onRank: (direction: number) => void; sprints: Sprint[]; onOpenBoard: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: issue.id, disabled });
  const Icon = typeIcon[issue.issueType];
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={cn('backlog-row group', selected && 'is-selected', isDragging && 'opacity-30')}>
    <button {...attributes} {...listeners} aria-label={`Arrastrar ${issue.title}`} disabled={disabled} className="touch-none p-1 text-(--text-muted) hover:text-(--cream)"><GripVertical className="size-4" /></button>
    <input type="checkbox" aria-label={`Seleccionar ${issue.title}`} checked={selected} onChange={onSelect} disabled={disabled} className="accent-(--sand)" />
    <Icon className="size-4 shrink-0 text-(--sand)" aria-label={issue.issueType} />
    <button onClick={onEdit} className="min-w-0 flex-1 text-left" disabled={disabled}>
      <span className="mb-1 block text-[10px] tracking-wider text-(--text-muted)">SH-{issue.id.slice(-6).toUpperCase()}</span>
      <span className="block truncate text-sm font-medium">{issue.title}</span>
      {issue.epic && <span className="mt-1 block truncate text-xs text-(--taupe)">{issue.epic}</span>}
    </button>
    <div className="hidden min-w-24 text-xs text-(--text-on-dark-muted) lg:block">{issue.assignedTo?.name ?? 'Sin asignar'}</div>
    <span className="hidden text-xs text-(--text-muted) xl:block">{statusLabel[issue.status]}</span>
    <Badge tone={issue.priority === 'alta' ? 'outline' : 'muted'}>{issue.priority}</Badge>
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--ink-hover) text-xs" title="Puntos de historia">{issue.storyPoints}</span>
    <select aria-label={`Mover ${issue.title} a sprint`} className="workspace-select max-w-32 text-xs" value={issue.sprintId ?? ''} disabled={disabled} onChange={e => onMove(e.target.value)}>
      <option value="">Backlog</option>{sprints.filter(s => s.status !== 'completado' || s.id === issue.sprintId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
    <div className="flex flex-col"><button disabled={disabled} aria-label={`Subir ${issue.title}`} onClick={() => onRank(-1)} className="p-1 text-(--text-muted) hover:text-(--cream)"><ArrowUp className="size-3" /></button><button disabled={disabled} aria-label={`Bajar ${issue.title}`} onClick={() => onRank(1)} className="p-1 text-(--text-muted) hover:text-(--cream)"><ArrowDown className="size-3" /></button></div>
    {issue.boardId && <button className="hidden text-xs text-(--sand) xl:block" onClick={onOpenBoard}>Tablero ↗</button>}
  </div>;
}

function IssueSection({ id, title, subtitle, count, points, children, actions, collapsed, onCollapse, disabled }: { id: string; title: string; subtitle: string; count: number; points: number; children: ReactNode; actions?: ReactNode; collapsed: boolean; onCollapse: () => void; disabled: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `section:${id}`, disabled });
  return <section ref={setNodeRef} className={cn('workspace-panel overflow-hidden transition-colors', isOver && 'border-(--sand)! bg-(--drop-target-bg)!')}>
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border-subtle) p-4">
      <button onClick={onCollapse} aria-expanded={!collapsed} className="flex items-center gap-3 text-left"><ChevronDown className={cn('size-4 text-(--taupe) transition-transform', collapsed && '-rotate-90')} /><div><h3 className="text-sm font-semibold">{title} <span className="ml-2 text-xs font-normal text-(--text-muted)">{count} incidencias · {points} pts</span></h3><p className="mt-1 text-xs text-(--text-muted)">{subtitle}</p></div></button>
      {actions}
    </header>
    {!collapsed && <div className="min-h-24 p-2">{children}</div>}
  </section>;
}

export function BacklogWorkspace({ group, isAdmin }: { group: GroupDetails; isAdmin: boolean }) {
  const { data, error, busy, reload, run } = useBacklog(group.id);
  const [search, setSearch] = useState(''); const [assignee, setAssignee] = useState(''); const [priority, setPriority] = useState(''); const [epic, setEpic] = useState('');
  const [editor, setEditor] = useState<Issue | 'new' | null>(null);
  const [sprintOpen, setSprintOpen] = useState(false);
  const [transition, setTransition] = useState<Sprint | null>(null);
  const [destination, setDestination] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dragging, setDragging] = useState<Issue | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sprintToDelete, setSprintToDelete] = useState<Sprint | null>(null);
  const selectBoard = useDashboardStore(s => s.selectBoard);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  if (!data) return error ? <ErrorState title="No se pudo cargar el backlog" message={error} onRetry={() => void reload()} /> : <LoadingState message="Preparando el product backlog…" />;
  const filtered = data.cards.filter(c => `${c.title} ${c.description} ${c.epic} SH-${c.id.slice(-6)}`.toLowerCase().includes(search.toLowerCase()) && (!assignee || (assignee === 'none' ? !c.assignedTo : c.assignedTo?.id === assignee)) && (!priority || c.priority === priority) && (!epic || c.epic === epic));
  const selectedIssues = data.cards.filter(c => selected.includes(c.id));
  const toggleCollapse = (id: string) => setCollapsed(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  const move = (issue: Issue, sprintId: string) => run(() => backlogService.move(issue.id, sprintId || null), 'Incidencia movida');
  const rank = (issue: Issue, direction: number) => {
    const siblings = data.cards.filter(c => c.sprintId === issue.sprintId);
    const index = siblings.findIndex(c => c.id === issue.id); const target = index + direction;
    if (target < 0 || target >= siblings.length) return;
    void run(async () => {
      [siblings[index], siblings[target]] = [siblings[target], siblings[index]];
      // Reindex the complete list so legacy equal ranks and filtered views stay deterministic.
      await backlogService.reorder(group.id, issue.sprintId, siblings.map(c => c.id));
    }, 'Prioridad de orden actualizada');
  };
  const drop = (event: DragEndEvent) => {
    setDragging(null); if (!event.over || event.active.id === event.over.id) return;
    const issue = data.cards.find(c => c.id === event.active.id); if (!issue) return;
    const target = data.cards.find(c => c.id === event.over?.id);
    const sprintId = target ? target.sprintId : String(event.over.id).replace('section:', '') || null;
    if (data.sprints.some(s => s.id === sprintId && s.status === 'completado')) return;
    void run(async () => {
      if (issue.sprintId !== sprintId) await backlogService.move(issue.id, sprintId);
      const siblings = data.cards.filter(c => c.sprintId === sprintId && c.id !== issue.id);
      const index = target ? siblings.findIndex(c => c.id === target.id) : siblings.length;
      siblings.splice(Math.max(0, index), 0, issue);
      await backlogService.reorder(group.id, sprintId, siblings.map(c => c.id));
    }, 'Backlog reorganizado');
  };
  const renderRows = (sprintId: string | null, closed = false) => {
    const rows = filtered.filter(c => c.sprintId === sprintId);
    return <SortableContext items={rows.map(c => c.id)} strategy={verticalListSortingStrategy}>{rows.length ? rows.map(issue => <IssueRow key={issue.id} issue={issue} disabled={busy || closed} selected={selected.includes(issue.id)} onSelect={() => setSelected(ids => ids.includes(issue.id) ? ids.filter(id => id !== issue.id) : [...ids, issue.id])} onEdit={() => setEditor(issue)} onMove={id => void move(issue, id)} onRank={dir => rank(issue, dir)} sprints={data.sprints} onOpenBoard={() => issue.boardId && selectBoard(group.id, issue.boardId)} />) : <p className="py-8 text-center text-sm text-(--text-muted)">{search || assignee || priority || epic ? 'No hay incidencias que coincidan con los filtros.' : 'Arrastra incidencias aquí para planificar el trabajo.'}</p>}</SortableContext>;
  };
  return <div className="workspace-enter mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="workspace-eyebrow">{group.name} / Planificación</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Product backlog<span className="text-(--sand)">.</span></h1><p className="mt-2 text-sm text-(--text-muted)">Organiza incidencias y planifica sprints.</p></div><div className="flex flex-wrap gap-2"><Button size="sm" variant="ghost" onClick={() => void reload()} disabled={busy} aria-label="Actualizar backlog" icon={<RefreshCw className="size-4" />}>Actualizar</Button><Button size="sm" variant="secondary" onClick={() => setSprintOpen(true)} icon={<Plus className="size-4" />}>Crear sprint</Button><Button size="sm" onClick={() => setEditor('new')} icon={<Plus className="size-4" />}>Crear incidencia</Button></div></header>
    {error && <p role="alert" className="workspace-panel p-3 text-sm">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-3">{[{ label: 'Por planificar', value: data.cards.filter(c => !c.sprintId).length }, { label: 'Sprint activo', value: data.sprints.find(s => s.status === 'activo')?.name ?? 'Sin iniciar' }, { label: 'Puntos del backlog', value: data.cards.filter(c => !c.sprintId).reduce((sum, c) => sum + c.storyPoints, 0) }].map(item => <div className="workspace-panel p-4" key={item.label}><p className="workspace-eyebrow">{item.label}</p><p className="mt-2 truncate text-xl font-semibold text-(--cream)">{item.value}</p></div>)}</div>
    <div className="flex flex-wrap items-center gap-3"><label className="relative min-w-48 flex-1"><Search className="absolute top-3 left-3 size-4 text-(--taupe)" /><input className="workspace-select w-full pl-10!" aria-label="Buscar incidencias" placeholder="Buscar en el backlog…" value={search} onChange={e => setSearch(e.target.value)} /></label><select className="workspace-select" aria-label="Filtrar por responsable" value={assignee} onChange={e => setAssignee(e.target.value)}><option value="">Todo el equipo</option><option value="none">Sin asignar</option>{group.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select><select className="workspace-select" aria-label="Filtrar por prioridad" value={priority} onChange={e => setPriority(e.target.value)}><option value="">Todas las prioridades</option><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select><select className="workspace-select" aria-label="Filtrar por épica" value={epic} onChange={e => setEpic(e.target.value)}><option value="">Todas las épicas</option>{[...new Set(data.cards.map(c => c.epic).filter(Boolean))].map(e => <option key={e}>{e}</option>)}</select><Button size="sm" variant="ghost" icon={<Download className="size-4" />} onClick={() => void run(() => backlogService.exportCsv(group.id), 'Backlog exportado')}>CSV</Button></div>
    {!!selectedIssues.length && <div className="workspace-panel flex flex-wrap items-center gap-3 p-3"><span className="text-sm">{selectedIssues.length} seleccionadas</span><select className="workspace-select" aria-label="Mover incidencias seleccionadas" value="choose" disabled={busy} onChange={e => { const id = e.target.value; void run(async () => { for (const item of selectedIssues) await backlogService.move(item.id, id || null); setSelected([]); }, 'Incidencias movidas'); }}><option value="choose" disabled>Mover a…</option><option value="">Backlog</option>{data.sprints.filter(s => s.status !== 'completado').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><select className="workspace-select max-w-64" aria-label="Columna destino" value={destination} onChange={e => setDestination(e.target.value)}><option value="">Columna del tablero…</option>{data.destinations.map(d => <option key={d.id} value={d.id}>{d.boardName} / {d.name}</option>)}</select><Button size="sm" variant="secondary" disabled={busy || !destination} onClick={() => void run(async () => { for (const item of selectedIssues) await backlogService.link(item.id, destination); setSelected([]); }, 'Incidencias vinculadas al tablero')}>Enviar al tablero</Button>{isAdmin && <Button size="sm" variant="ghost" disabled={busy} icon={<Trash2 className="size-4" />} onClick={() => setDeleting(true)}>Eliminar</Button>}<Button size="sm" variant="ghost" onClick={() => setSelected([])}>Cancelar selección</Button></div>}
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={e => setDragging(data.cards.find(c => c.id === e.active.id) ?? null)} onDragEnd={drop} onDragCancel={() => setDragging(null)}>
      <div className="space-y-5">{data.sprints.filter(s => showHistory || s.status !== 'completado').map(sprint => {
        const items = data.cards.filter(c => c.sprintId === sprint.id);
        const state = sprint.status === 'activo' ? '● En curso' : sprint.status === 'completado' ? '✓ Completado' : 'Planificado';
        const dates = `${formatSprintDate(sprint.startDate)} — ${formatSprintDate(sprint.endDate)}`;
        return (
          <IssueSection
            key={sprint.id}
            id={sprint.id}
            title={sprint.name}
            subtitle={[state, dates, sprint.goal].filter(Boolean).join(' · ')}
            count={items.length}
            points={items.reduce((n, c) => n + c.storyPoints, 0)}
            collapsed={collapsed.includes(sprint.id)}
            onCollapse={() => toggleCollapse(sprint.id)}
            disabled={busy || sprint.status === 'completado'}
            actions={
              <div className="flex flex-wrap gap-2">
                {sprint.status !== 'completado' && (
                  <Button size="sm" variant={sprint.status === 'activo' ? 'primary' : 'secondary'}
                    disabled={busy || (sprint.status === 'planificado' && (!items.length || data.sprints.some(s => s.status === 'activo')))}
                    onClick={() => setTransition(sprint)}
                  >
                    {sprint.status === 'activo' ? 'Completar sprint' : 'Iniciar sprint'}
                  </Button>
                )}
                {isAdmin && (
                  <Button size="sm" variant="ghost" disabled={busy} aria-label={`Eliminar sprint ${sprint.name}`}
                    icon={<Trash2 aria-hidden="true" className="size-4" />} onClick={() => setSprintToDelete(sprint)}
                  >
                    Eliminar sprint
                  </Button>
                )}
              </div>
            }
          >
            {renderRows(sprint.id, sprint.status === 'completado')}
          </IssueSection>
        );
      })}<IssueSection id="" title="Backlog" subtitle="Prioriza, estima y prepara el siguiente sprint." count={data.cards.filter(c => !c.sprintId).length} points={data.cards.filter(c => !c.sprintId).reduce((sum, c) => sum + c.storyPoints, 0)} collapsed={collapsed.includes('backlog')} onCollapse={() => toggleCollapse('backlog')} disabled={busy} actions={<ListTodo className="size-5 text-(--taupe)" />}>{renderRows(null)}<button className="flex w-full items-center gap-2 rounded-lg p-3 text-sm text-(--taupe) hover:bg-(--ink-hover) hover:text-(--cream)" onClick={() => setEditor('new')}><Plus className="size-4" />Crear incidencia</button></IssueSection></div>
      <DragOverlay>{dragging && <div className="workspace-panel drag-lift rounded-xl p-4 text-sm">{dragging.title}</div>}</DragOverlay>
    </DndContext>
    <label className="flex items-center gap-2 text-sm text-(--text-muted)"><input type="checkbox" className="accent-(--sand)" checked={showHistory} onChange={e => setShowHistory(e.target.checked)} />Mostrar sprints completados</label>
    {sprintToDelete && (
      <Modal
        open
        onClose={() => { if (!busy) setSprintToDelete(null); }}
        title={`Eliminar ${sprintToDelete.name}`}
        description="Las incidencias volverán al product backlog y conservarán su estado y sus tarjetas vinculadas."
      >
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" disabled={busy} onClick={() => setSprintToDelete(null)}>Cancelar</Button>
          <Button variant="danger" loading={busy} onClick={async () => {
            if (await run(() => backlogService.deleteSprint(sprintToDelete.id), 'Sprint eliminado')) setSprintToDelete(null);
          }}>
            Eliminar sprint
          </Button>
        </div>
      </Modal>
    )}
    {editor && <IssueEditor issue={editor === 'new' ? null : editor} members={group.members} busy={busy} onClose={() => setEditor(null)} onSave={values => run(() => editor === 'new' ? backlogService.create(group.id, values) : backlogService.update(editor.id, values), 'Incidencia guardada')} />}
    <Modal open={sprintOpen} onClose={() => setSprintOpen(false)} title="Crear sprint" description="Un objetivo claro y un periodo de trabajo para tu equipo."><form className="space-y-4" onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); void run(() => backlogService.createSprint(group.id, { name: String(form.get('name')).trim(), goal: String(form.get('goal')), startDate: new Date(String(form.get('startDate')) + 'T00:00:00').toISOString(), endDate: new Date(String(form.get('endDate')) + 'T23:59:59').toISOString() }), 'Sprint creado').then(ok => { if (ok) setSprintOpen(false); }); }}><Input label="Nombre" name="name" required minLength={2} maxLength={100} placeholder="Sprint 01" /><Input label="Objetivo" name="goal" /><div className="grid gap-4 sm:grid-cols-2"><Input label="Inicio" name="startDate" type="date" required /><Input label="Fin" name="endDate" type="date" required /></div><Button type="submit" loading={busy}>Crear sprint</Button></form></Modal>
    <Modal open={!!transition} onClose={() => setTransition(null)} title={transition?.status === 'activo' ? 'Completar sprint' : 'Iniciar sprint'} description={transition?.status === 'activo' ? 'Las incidencias incompletas volverán al backlog. Las completadas quedarán en el historial del sprint.' : 'Las incidencias se vincularán al tablero seleccionado para comenzar a trabajar.'}>{transition?.status === 'planificado' && <label className="workspace-label">Columna inicial<select className="workspace-select" value={destination} onChange={e => setDestination(e.target.value)}><option value="">Selecciona una columna</option>{data.destinations.map(d => <option key={d.id} value={d.id}>{d.boardName} / {d.name}</option>)}</select>{!data.destinations.length && <span>Crea un tablero con columnas para iniciar el sprint.</span>}</label>}<div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setTransition(null)}>Cancelar</Button><Button loading={busy} disabled={transition?.status === 'planificado' && !destination} onClick={() => transition && void run(() => backlogService.transition(transition.id, transition.status === 'activo' ? 'completado' : 'activo', destination || undefined), 'Sprint actualizado').then(ok => { if (ok) setTransition(null); })}>Confirmar</Button></div></Modal>
    <Modal open={deleting} onClose={() => setDeleting(false)} title="Eliminar incidencias" description={`Se eliminarán ${selectedIssues.length} incidencias. Las vinculadas a tarjetas deben desvincularse eliminando primero su tarjeta.`}><Button variant="danger" loading={busy} onClick={() => void run(async () => { for (const item of selectedIssues) await backlogService.remove(item.id); setSelected([]); }, 'Incidencias eliminadas').then(ok => { if (ok) setDeleting(false); })}>Eliminar seleccionadas</Button></Modal>
  </div>;
}
