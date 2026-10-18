import { useState, type FormEvent } from 'react';
import { KanbanSquare } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Modal } from '@/components/ui/Modal/Modal';
import { useCreateBoard } from '../hooks/useBoardMutations';
import type { CreateBoardFormData } from '../schemas/boardFormSchema';
import formStyles from '@/components/ui/ModalForm/ModalForm.module.css';

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
  });
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const board = await submit(groupId, values);
    if (board) {
      setValues({ title: '', description: '' });
      onCreated(board.id);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo tablero"
      description="Crea un tablero dentro del grupo actual. Se generan las columnas Por hacer, En proceso y Hecho."
    >
      <form onSubmit={handleSubmit} noValidate className={formStyles.form}>
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

        <div className={formStyles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={<KanbanSquare aria-hidden="true" className="icon-md" />}
          >
            Crear tablero
          </Button>
        </div>
      </form>
    </Modal>
  );
}
