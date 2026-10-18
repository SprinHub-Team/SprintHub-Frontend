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
import formStyles from '@/components/ui/ModalForm/ModalForm.module.css';
import styles from './CreateCardModal.module.css';

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
      <form onSubmit={handleSubmit} noValidate className={formStyles.form}>
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

        <TextArea
          label="Descripción"
          name="card-description"
          placeholder="Detalles, criterios de aceptación, contexto…"
          value={values.description ?? ''}
          onChange={handleChange('description')}
          disabled={loading}
          hint="Opcional."
        />

        <div className={styles.fieldsGrid}>
          <div className={styles.field}>
            <label htmlFor="card-priority" className={styles.fieldLabel}>
              Prioridad
            </label>
            <select
              id="card-priority"
              name="priority"
              className="field-select"
              value={values.priority}
              onChange={handleChange('priority')}
              disabled={loading}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="card-assigned" className={styles.fieldLabel}>
              Responsable
            </label>
            <select
              id="card-assigned"
              name="assignedTo"
              className="field-select"
              value={values.assignedTo ?? ''}
              onChange={handleChange('assignedTo')}
              disabled={loading}
            >
              <option value="">Sin asignar</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={formStyles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={<SquarePlus aria-hidden="true" className="icon-md" />}
          >
            Crear tarjeta
          </Button>
        </div>
      </form>
    </Modal>
  );
}
