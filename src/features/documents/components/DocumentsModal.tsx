import { useEffect, useState, type FormEvent } from 'react';
import { Download, FileSpreadsheet, FileText, Trash2, UploadCloud } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { FileDropzone } from '@/components/ui/FileDropzone/FileDropzone';
import { Input } from '@/components/ui/Input/Input';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { Modal } from '@/components/ui/Modal/Modal';
import { cn } from '@/lib/utils';
import { DOCUMENT_RULE, fileCategory } from '@/services/uploads/fileValidation';
import { useDocuments } from '../hooks/useDocuments';
import type { GroupDetails } from '@/features/groups/types/group.types';

export interface DocumentsModalProps {
  open: boolean;
  onClose: () => void;
  group: GroupDetails | null;
}

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function DocumentsModal({ open, onClose, group }: DocumentsModalProps) {
  const { documents, status, error, uploading, deletingId, upload, remove } = useDocuments(
    open ? group?.id ?? null : null,
  );
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setFile(null);
      setTitleError(null);
      setConfirmingId(null);
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length < 2 || trimmed.length > 150) {
      setTitleError('El título debe tener entre 2 y 150 caracteres');
      return;
    }
    if (!file) return;
    setTitleError(null);
    const succeeded = await upload({ title: trimmed, file });
    if (succeeded) {
      setTitle('');
      setFile(null);
    }
  };

  return (
    <Modal
      open={open && group !== null}
      onClose={onClose}
      title="Documentos del proyecto"
      description={
        group
          ? `Archivos compartidos del espacio de trabajo “${group.name}”: PDF y hojas de cálculo.`
          : undefined
      }
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-7">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Título del documento"
            name="document-title"
            placeholder="Acta de kickoff del sprint"
            required
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) setTitleError(null);
            }}
            error={titleError ?? undefined}
            disabled={uploading}
          />

          <FileDropzone
            rule={DOCUMENT_RULE}
            value={file}
            onChange={setFile}
            label="Archivo"
            hint="Los documentos quedan disponibles para todos los miembros del grupo."
            disabled={uploading}
            compact
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              loading={uploading}
              disabled={!file}
              icon={<UploadCloud aria-hidden="true" className="size-4" />}
            >
              Subir documento
            </Button>
          </div>
        </form>

        <section className="flex flex-col gap-3" aria-label="Documentos subidos">
          <h3 className="text-sm font-semibold text-(--text-on-dark)">
            Documentos ({documents.length})
          </h3>

          {status === 'loading' ? (
            <LoadingState message="Cargando documentos…" />
          ) : null}

          {status === 'error' ? (
            <Alert variant="danger" title="No se pudieron cargar los documentos">
              {error ?? 'Ocurrió un error al comunicarse con el servidor.'}
            </Alert>
          ) : null}

          {status === 'success' && documents.length === 0 ? (
            <p className="rounded-(--radius-sm) border border-dashed border-(--border-subtle) px-4 py-6 text-center text-sm text-(--text-muted)">
              Aún no hay documentos. Sube el primero con el formulario de arriba.
            </p>
          ) : null}

          {documents.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {documents.map((document) => {
                const category = fileCategory(document.fileName, '');
                const DocumentIcon = category === 'spreadsheet' ? FileSpreadsheet : FileText;
                const isDeleting = deletingId === document.id;
                const isConfirming = confirmingId === document.id;
                return (
                  <li
                    key={document.id}
                    className="flex items-center gap-3.5 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) p-3.5 transition-[border-color] duration-200 ease-out hover:border-(--border-dark)"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-(--radius-xs) border border-(--border-subtle) bg-(--ink-raised)"
                    >
                      <DocumentIcon
                        className={cn(
                          'size-5',
                          category === 'spreadsheet' ? 'text-(--file-spreadsheet)' : 'text-(--file-document)',
                        )}
                      />
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate text-sm font-medium text-(--text-on-dark)" title={document.title}>
                        {document.title}
                      </span>
                      <span className="truncate text-xs text-(--text-muted)" title={document.fileName}>
                        {document.fileName}
                      </span>
                      <span className="flex flex-wrap items-center gap-1.5 text-xs text-(--text-muted)">
                        <Badge tone="muted">{document.uploadedBy.name}</Badge>
                        <span aria-hidden="true">·</span>
                        <time dateTime={document.createdAt}>
                          {dateFormatter.format(new Date(document.createdAt))}
                        </time>
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <a
                        href={document.fileUrl}
                        download={document.fileName}
                        title={`Descargar ${document.fileName}`}
                        aria-label={`Descargar ${document.title}`}
                        className="rounded-(--radius-sm) p-2 text-(--taupe) transition-colors duration-200 ease-out hover:bg-(--ink-raised) hover:text-(--cream)"
                      >
                        <Download aria-hidden="true" className="size-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isConfirming) {
                            setConfirmingId(document.id);
                            return;
                          }
                          setConfirmingId(null);
                          void remove(document.id);
                        }}
                        disabled={isDeleting}
                        aria-label={
                          isConfirming
                            ? `Confirmar eliminación de ${document.title}`
                            : `Eliminar ${document.title}`
                        }
                        title={isConfirming ? 'Haz clic de nuevo para confirmar' : 'Eliminar documento'}
                        className={cn(
                          'rounded-(--radius-sm) p-2 transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50',
                          isConfirming
                            ? 'bg-(--brown) text-(--paper)'
                            : 'text-(--taupe) hover:bg-(--ink-raised) hover:text-(--cream)',
                        )}
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      </div>
    </Modal>
  );
}
