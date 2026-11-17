import { AssigneeSelect, PrioritySelect } from '@/features/cards/components/CardFieldSelects';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Button } from '@/components/ui/Button/Button';
import type { GroupMemberDto } from '@/features/groups/types/group.dto';
import type { Issue, IssueInput } from '../services/backlogService';

export function IssueEditor({ issue, members, busy, onClose, onSave }: { issue: Issue | null; members: GroupMemberDto[]; busy: boolean; onClose: () => void; onSave: (data: IssueInput) => Promise<boolean> }) {
  const [values, setValues] = useState({ title: issue?.title ?? '', description: issue?.description ?? '', assignedTo: issue?.assignedTo?.id ?? '', priority: issue?.priority ?? 'media', issueType: issue?.issueType ?? 'historia', epic: issue?.epic ?? '', storyPoints: issue?.storyPoints ?? 0, status: issue?.status ?? 'pendiente', dueDate: issue?.dueDate ? new Date(issue.dueDate).toLocaleDateString('en-CA') : '' });
  const change = (field: keyof typeof values, value: string | number) => setValues(v => ({ ...v, [field]: value }));
  return <Modal open onClose={onClose} title={issue ? 'Editar incidencia' : 'Nueva incidencia'} description="Define el trabajo y los criterios de aceptación del equipo.">
    <form className="space-y-5" onSubmit={async e => { e.preventDefault(); if (await onSave({ ...values, title: values.title.trim(), assignedTo: values.assignedTo || null, dueDate: values.dueDate ? new Date(values.dueDate + 'T23:59:59').toISOString() : null })) onClose(); }}>
      <Input name="title" label="Título" required minLength={2} maxLength={150} value={values.title} onChange={e => change('title', e.target.value)} />
      <TextArea name="description" label="Descripción y criterios de aceptación" value={values.description} onChange={e => change('description', e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="workspace-label">Tipo<select className="workspace-select" value={values.issueType} onChange={e => change('issueType', e.target.value)}><option value="historia">Historia</option><option value="tarea">Tarea</option><option value="error">Error</option></select></label>
        <PrioritySelect value={values.priority} disabled={busy} onChange={priority => change('priority', priority)} />
        <AssigneeSelect members={members} value={values.assignedTo} disabled={busy} onChange={assignedTo => change('assignedTo', assignedTo)} />
        <label className="workspace-label">Estado<select className="workspace-select" value={values.status} onChange={e => change('status', e.target.value)}><option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option></select></label>
        <Input name="points" label="Puntos de historia" type="number" min={0} max={1000} step={1} value={values.storyPoints} onChange={e => change('storyPoints', Number(e.target.value))} />
        <Input name="due" label="Vencimiento" type="date" value={values.dueDate} onChange={e => change('dueDate', e.target.value)} />
      </div>
      <Input name="epic" label="Épica" placeholder="Ej. Experiencia de usuario" maxLength={100} value={values.epic} onChange={e => change('epic', e.target.value)} />
      <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button><Button type="submit" loading={busy}>Guardar incidencia</Button></div>
    </form>
  </Modal>;
}
