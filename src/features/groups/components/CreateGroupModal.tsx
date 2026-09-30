import { useState, type FormEvent } from 'react';
import { Users } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { FileDropzone } from '@/components/ui/FileDropzone/FileDropzone';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Modal } from '@/components/ui/Modal/Modal';
import { MEDIA_RULE } from '@/services/uploads/fileValidation';
import type { CreateGroupFormData } from '../schemas/groupSchema';
import { useCreateGroup } from '../hooks/useCreateGroup';

export interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (groupId: string) => void;
}

export function CreateGroupModal({ open, onClose, onCreated }: CreateGroupModalProps) {
  const [values, setValues] = useState<CreateGroupFormData>({ name: '', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const { loading, error, submit } = useCreateGroup();

  const fieldErrors: Record<string, string> =
    error?.hasValidationIssues === true
      ? Object.fromEntries(error.issues.map((issue) => [issue.path, issue.message]))
      : {};

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, name: event.target.value }));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, description: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const group = await submit({ ...values, file: image });
    if (group) {
      setValues({ name: '', description: '' });
      setImage(null);
      onCreated(group.id);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Crear un grupo"
      description="Un grupo es tu espacio de trabajo: contiene tableros y miembros con roles."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {error && !error.hasValidationIssues ? (
          <Alert variant="danger" title="No se pudo crear el grupo">
            {error.message}
          </Alert>
        ) : null}

        <Input
          label="Nombre del grupo"
          name="name"
          placeholder="Equipo de producto"
          required
          value={values.name}
          onChange={handleNameChange}
          error={fieldErrors.name}
          disabled={loading}
        />

        <TextArea
          label="Descripción"
          name="description"
          placeholder="¿Para qué es este grupo de trabajo?"
          value={values.description ?? ''}
          onChange={handleDescriptionChange}
          disabled={loading}
          hint="Opcional: ayuda al equipo a entender el propósito del espacio."
        />

        <FileDropzone
          rule={MEDIA_RULE}
          value={image}
          onChange={setImage}
          label="Imagen del grupo (opcional)"
          hint="Se mostrará junto al nombre del espacio de trabajo."
          disabled={loading}
          compact
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={<Users aria-hidden="true" className="size-4" />}
          >
            Crear grupo
          </Button>
        </div>
      </form>
    </Modal>
  );
}
