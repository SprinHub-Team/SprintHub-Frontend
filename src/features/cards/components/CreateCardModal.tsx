import { AssigneeSelect, PrioritySelect } from './CardFieldSelects';
import { useState, type FormEvent } from 'react';
import { SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { zodFieldErrors } from '@/lib/zodFormErrors';
import { createCardSchema, type CreateCardFormData } from '../schemas/cardFormSchema';
import { useCardMutations } from '../hooks/useCardMutations';
import type { GroupMemberDto } from '@/features/groups/types/group.dto';

export interface CreateCardModalProps {
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnName: string;
  members: GroupMemberDto[];
}

export function CreateCardModal({
  open,
  onClose,
  columnId,
  columnName,
  members,
}: CreateCardModalProps) {
  const [values, setValues] = useState<CreateCardFormData>({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'media',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { loading, create } = useCardMutations();

  const handleChange = (field: keyof CreateCardFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = createCardSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error.issues));
      return;
    }
    setFieldErrors({});
    const succeeded = await create(columnId, parsed.data);
    if (succeeded) {
      setValues({ title: '', description: '', assignedTo: '', priority: 'media' });
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva tarjeta"
      description={`Se creará en la columna “${columnName}”.`}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Input
          label="Título"
          name="card-title"
          placeholder="Implementar endpoint de login"
          required
          value={values.title}
          onChange={handleChange('title')}
          error={fieldErrors.title}
          disabled={loading}
        />

        <Input label="Fecha de vencimiento" name="card-due-date" type="date" value={values.dueDate ?? ''} onChange={handleChange('dueDate')} disabled={loading} />
        <TextArea
          label="Descripción"
          name="card-description"
          placeholder="Detalles, criterios de aceptación, contexto…"
          value={values.description ?? ''}
          onChange={handleChange('description')}
          disabled={loading}
          hint="Opcional."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PrioritySelect value={values.priority} disabled={loading} onChange={priority => setValues(current => ({ ...current, priority }))} />
          <AssigneeSelect members={members} value={values.assignedTo ?? ''} disabled={loading}
            onChange={assignedTo => setValues(current => ({ ...current, assignedTo }))} />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={<SquarePlus aria-hidden="true" className="size-4" />}
          >
            Crear tarjeta
          </Button>
        </div>
      </form>
    </Modal>
  );
}
