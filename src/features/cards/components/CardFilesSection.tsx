import { useEffect, useState } from 'react';
import { Download, FileAudio, FileImage, FileSpreadsheet, FileText, Paperclip, Trash2, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { FileDropzone } from '@/components/ui/FileDropzone/FileDropzone';
import { cn } from '@/lib/utils';
import { CARD_FILE_RULE, fileCategory, formatBytes } from '@/services/uploads/fileValidation';
import type { CardFileDto } from '../types/card.dto';

const CATEGORY_ICONS = {
  image: FileImage,
  audio: FileAudio,
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  other: Paperclip,
} as const;

const CATEGORY_LABELS: Record<ReturnType<typeof fileCategory>, string> = {
  image: 'Imagen',
  audio: 'Audio',
  pdf: 'PDF',
  spreadsheet: 'Hoja de cálculo',
  other: 'Archivo',
};

export interface CardFilesSectionProps {
  cardId: string;
  files: CardFileDto[];
  onAddFile: (file: File) => Promise<boolean>;
  onRemoveFile: (filePath: string) => Promise<boolean>;
  uploading: boolean;
  removing: boolean;
}

export function CardFilesSection({
  cardId,
  files,
  onAddFile,
  onRemoveFile,
  uploading,
  removing,
}: CardFilesSectionProps) {
  const [selected, setSelected] = useState<File | null>(null);
  const [confirmingPath, setConfirmingPath] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
    setConfirmingPath(null);
  }, [cardId]);

  useEffect(() => {
    if (!confirmingPath) return undefined;
    const timer = setTimeout(() => setConfirmingPath(null), 3000);
    return () => clearTimeout(timer);
  }, [confirmingPath]);

  const handleUpload = async () => {
    if (!selected) return;
    const succeeded = await onAddFile(selected);
    if (succeeded) {
      setSelected(null);
    }
  };

  return (
    <section className="flex flex-col gap-4 border-t border-(--border-subtle) pt-6" aria-label="Archivos adjuntos">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-(--text-on-dark)">
        <Paperclip aria-hidden="true" className="size-4 text-(--taupe)" />
        Archivos ({files.length})
      </h3>

      <FileDropzone
        rule={CARD_FILE_RULE}
        value={selected}
        onChange={setSelected}
        label="Adjuntar archivo"
        hint="Imágenes, audios, PDF y hojas de cálculo. Se envían por el canal realtime del tablero."
        disabled={uploading}
        compact
      />

      {selected ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => void handleUpload()}
            loading={uploading}
            icon={<UploadCloud aria-hidden="true" className="size-4" />}
          >
            Adjuntar a la tarjeta
          </Button>
        </div>
      ) : null}

      {files.length === 0 ? (
        <p className="rounded-(--radius-sm) border border-dashed border-(--border-subtle) px-3 py-4 text-center text-xs text-(--text-muted)">
          Esta tarjeta todavía no tiene archivos adjuntos.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {files.map((file) => {
            const category = fileCategory(file.fileName, '');
            const FileIcon = CATEGORY_ICONS[category];
            const isConfirming = confirmingPath === file.path;
            return (
              <li
                key={file.path}
                className="flex items-center gap-3 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) p-2.5 transition-[border-color] duration-200 ease-out hover:border-(--border-dark)"
              >
                {category === 'image' && file.url.startsWith('data:image') ? (
                  <img
                    src={file.url}
                    alt={`Miniatura de ${file.fileName}`}
                    className="size-10 shrink-0 rounded-(--radius-xs) border border-(--border-subtle) object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-xs) border border-(--border-subtle) bg-(--ink-raised)"
                  >
                    <FileIcon aria-hidden="true" className="size-5 text-(--taupe)" />
                  </span>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-(--text-on-dark)" title={file.fileName}>
                    {file.fileName}
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5 text-xs text-(--text-muted)">
                    <Badge tone="muted">{CATEGORY_LABELS[category]}</Badge>
                    {file.url.startsWith('data:') ? (
                      <span>{formatBytes(Math.round((file.url.length * 3) / 4))}</span>
                    ) : null}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <a
                    href={file.url}
                    download={file.fileName}
                    title={`Descargar ${file.fileName}`}
                    aria-label={`Descargar ${file.fileName}`}
                    className="rounded-(--radius-sm) p-2 text-(--taupe) transition-colors duration-200 ease-out hover:bg-(--ink-raised) hover:text-(--cream)"
                  >
                    <Download aria-hidden="true" className="size-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isConfirming) {
                        setConfirmingPath(file.path);
                        return;
                      }
                      setConfirmingPath(null);
                      void onRemoveFile(file.path);
                    }}
                    disabled={removing}
                    aria-label={
                      isConfirming
                        ? `Confirmar eliminación de ${file.fileName}`
                        : `Eliminar ${file.fileName}`
                    }
                    title={isConfirming ? 'Haz clic de nuevo para confirmar' : 'Retirar archivo'}
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
      )}
    </section>
  );
}
