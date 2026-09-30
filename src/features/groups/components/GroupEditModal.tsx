import { useEffect, useState, type FormEvent } from 'react';
import { Pencil } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { FileDropzone } from '@/components/ui/FileDropzone/FileDropzone';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Modal } from '@/components/ui/Modal/Modal';
import { MEDIA_RULE } from '@/services/uploads/fileValidation';
import { useUpdateGroup } from '../hooks/useUpdateGroup';
import type { GroupDetails } from '../types/group.types';

export interface GroupEditModalProps {
  open: boolean;
  onClose: () => void;
  group: GroupDetails | null;
}

interface EditValues {
  name: string;
  description: string;
}

export function GroupEditModal({ open, onClose, group }: GroupEditModalProps) {
  const [values, setValues] = useState<EditValues>({ name: '', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const { loading, submit } = useUpdateGroup();

  useEffect(() => {
    if (open && group) {
      setValues({ name: group.name, description: group.description });
      setImage(null);
    }
  }, [open, group]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, name: event.target.value }));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, description: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!group) return;
    const succeeded = await submit(group.id, { ...values, file: image });
    if (succeeded) {
      onClose();
    }
  };

  return (
    <Modal
      open={open && group !== null}
      onClose={onClose}
      title="Editar grupo"
      description={group ? `Ajusta los datos y la imagen de “${group.name}”.` : undefined}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {group?.profilePicture ? (
          <div className="flex items-center gap-3.5 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) p-3">
            <img
              src={group.profilePicture}
              alt={`Imagen actual de ${group.name}`}
              className="size-14 shrink-0 rounded-(--radius-xs) border border-(--border-subtle) object-cover"
            />
            <p className="text-sm text-(--text-muted)">
              Imagen actual del espacio de trabajo. Al seleccionar un archivo nuevo, la reemplazarás
              al guardar.
            </p>
          </div>
        ) : null}

        <Input
          label="Nombre del grupo"
          name="edit-group-name"
          placeholder="Equipo de producto"
          required
          value={values.name}
          onChange={handleNameChange}
          disabled={loading}
        />

        <TextArea
          label="Descripción"
          name="edit-group-description"
          placeholder="¿Para qué es este grupo de trabajo?"
          value={values.description}
          onChange={handleDescriptionChange}
          disabled={loading}
          hint="Opcional: ayuda al equipo a entender el propósito del espacio."
        />

        <FileDropzone
          rule={MEDIA_RULE}
          value={image}
          onChange={setImage}
          label="Nueva imagen (opcional)"
          hint="Reemplaza la imagen actual al guardar los cambios."
          disabled={loading}
          compact
        />

        <Alert variant="info" title="Los cambios son visibles para todos los miembros del grupo." />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} icon={<Pencil aria-hidden="true" className="size-4" />}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}
