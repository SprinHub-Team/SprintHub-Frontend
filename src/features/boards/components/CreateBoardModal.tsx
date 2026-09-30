import { useState, type FormEvent } from 'react';
import { KanbanSquare } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Modal } from '@/components/ui/Modal/Modal';
import { cn } from '@/lib/utils';
import { useBoardTemplates, useCreateBoard } from '../hooks/useBoardMutations';
import type { CreateBoardFormData } from '../schemas/boardFormSchema';
import type { BoardTemplate } from '../types/board.types';

export interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  onCreated: (boardId: string) => void;
}

export function CreateBoardModal({ open, onClose, groupId, onCreated }: CreateBoardModalProps) {
  const [values, setValues] = useState<CreateBoardFormData>({
    title: '',
    description: '',
    templateId: '',
  });
  const { templates, status } = useBoardTemplates();
  const { loading, error, submit } = useCreateBoard();

  const fieldErrors: Record<string, string> =
    error?.hasValidationIssues === true
      ? Object.fromEntries(error.issues.map((issue) => [issue.path, issue.message]))
      : {};

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, title: event.target.value }));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, description: event.target.value }));
  };

  const handleTemplateChange = (templateId: string) => {
    setValues((current) => ({ ...current, templateId }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const board = await submit(groupId, values);
    if (board) {
      setValues({ title: '', description: '', templateId: '' });
      onCreated(board.id);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo tablero"
      description="Crea un tablero dentro del grupo actual y elige cómo empezar."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {error && !error.hasValidationIssues ? (
          <Alert variant="danger" title="No se pudo crear el tablero">
            {error.message}
          </Alert>
        ) : null}

        <Input
          label="Título del tablero"
          name="title"
          placeholder="Sprint 14 — Desarrollo"
          required
          value={values.title}
          onChange={handleTitleChange}
          error={fieldErrors.title}
          disabled={loading}
        />

        <TextArea
          label="Descripción"
          name="description"
          placeholder="Objetivo de este tablero"
          value={values.description ?? ''}
          onChange={handleDescriptionChange}
          disabled={loading}
          hint="Opcional: contexto para el equipo."
        />

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-medium text-(--text-on-dark)">
            Plantilla de inicio
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TemplateOption
              selected={values.templateId === ''}
              onSelect={() => handleTemplateChange('')}
              title="Columnas por defecto"
              description="Por hacer · En proceso · Hecho"
            />
            {status === 'loading' ? (
              <p className="col-span-full text-sm text-(--text-muted)">Cargando plantillas…</p>
            ) : null}
            {templates.map((template: BoardTemplate) => (
              <TemplateOption
                key={template.id}
                selected={values.templateId === template.id}
                onSelect={() => handleTemplateChange(template.id)}
                title={template.name}
                description={template.description}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={<KanbanSquare aria-hidden="true" className="size-4" />}
          >
            Crear tablero
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface TemplateOptionProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
}

function TemplateOption({ selected, onSelect, title, description }: TemplateOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex flex-col items-start gap-1.5 rounded-(--radius-sm) border p-4 text-left',
        'transition-[border-color,background-color] duration-200 ease-out',
        selected
          ? 'border-(--sand) bg-(--ink-raised)'
          : 'border-(--border-subtle) bg-(--ink-soft) hover:border-(--border-dark)',
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-(--text-on-dark)">
        <span
          aria-hidden="true"
          className={cn(
            'size-3 rounded-full border',
            selected ? 'border-(--sand) bg-(--sand)' : 'border-(--taupe)',
          )}
        />
        {title}
      </span>
      <span className="text-xs leading-relaxed text-(--text-muted)">{description}</span>
    </button>
  );
}
