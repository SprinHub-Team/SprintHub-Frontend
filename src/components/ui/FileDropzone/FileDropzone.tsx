import { useCallback, useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { CircleAlert, FileAudio, FileImage, FileSpreadsheet, FileText, Paperclip, UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  fileCategory,
  formatBytes,
  validateFile,
  type UploadRule,
} from '@/services/uploads/fileValidation';

export interface FileDropzoneProps {
  rule: UploadRule;
  value: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  error?: string | null;
  preview?: boolean;
  compact?: boolean;
  className?: string;
}

const CATEGORY_ICONS = {
  image: FileImage,
  audio: FileAudio,
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  other: Paperclip,
} as const;

export function FileDropzone({
  rule,
  value,
  onChange,
  label,
  hint,
  disabled = false,
  error,
  preview = true,
  compact = false,
  className,
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepthRef = useRef(0);

  const controlId = useId();
  const errorId = `${controlId}-error`;
  const hintId = `${controlId}-hint`;
  const statusId = `${controlId}-status`;

  const message = localError ?? error ?? null;

  useEffect(() => {
    if (!preview || !value || fileCategory(value.name, value.type) !== 'image') {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value, preview]);

  useEffect(() => {
    if (!value && inputRef.current && inputRef.current.value !== '') {
      inputRef.current.value = '';
    }
  }, [value]);

  const acceptFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      const validation = validateFile(file, rule);
      if (validation) {
        setLocalError(validation.message);
        if (inputRef.current) inputRef.current.value = '';
        return;
      }
      setLocalError(null);
      onChange(file);
    },
    [onChange, rule],
  );

  const clearFile = useCallback(() => {
    setLocalError(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  }, [onChange]);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    if (!disabled && event.dataTransfer?.types?.includes('Files')) {
      setDragActive(true);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setDragActive(false);
    if (disabled) return;
    const dropped = event.dataTransfer?.files?.[0];
    acceptFile(dropped ?? null);
  };

  const handleOpenPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenPicker();
    }
  };

  const describedBy = [message ? errorId : null, hint && !message ? hintId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? (
        <span id={`${controlId}-label`} className="text-sm font-medium text-(--text-on-dark)">
          {label}
        </span>
      ) : null}

      <input
        ref={inputRef}
        id={controlId}
        type="file"
        accept={rule.accept}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={(event) => {
          const selected = event.target.files?.[0] ?? null;
          if (selected) acceptFile(selected);
        }}
      />

      {value ? (
        <div
          className={cn(
            'flex items-center gap-3.5 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) p-3.5',
            'transition-[border-color,box-shadow] duration-200 ease-out',
          )}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`Vista previa de ${value.name}`}
              className="size-14 shrink-0 rounded-(--radius-xs) border border-(--border-subtle) object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-(--radius-xs) border border-(--border-subtle) bg-(--ink-raised)"
            >
              {renderCategoryIcon(value.name, value.type)}
            </span>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-(--text-on-dark)" title={value.name}>
              {value.name}
            </span>
            <span className="text-xs text-(--text-muted)">
              {formatBytes(value.size)} · {describeCategory(value.name, value.type)}
            </span>
            {message ? (
              <p id={errorId} className="mt-1 flex items-start gap-1.5 text-xs text-(--cream)" role="alert">
                <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-(--sand)" />
                <span>{message}</span>
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={clearFile}
            disabled={disabled}
            aria-label="Quitar archivo seleccionado"
            className="shrink-0 self-start rounded-(--radius-sm) p-1.5 text-(--text-muted) transition-colors duration-200 ease-out hover:bg-(--ink-raised) hover:text-(--cream) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={label ? `${controlId}-label` : undefined}
          aria-describedby={describedBy || undefined}
          aria-disabled={disabled || undefined}
          aria-invalid={message ? true : undefined}
          onClick={handleOpenPicker}
          onKeyDown={handleKeyDown}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-(--radius-sm)',
            'border-2 border-dashed text-center transition-[border-color,background-color] duration-200 ease-out',
            compact ? 'px-4 py-5' : 'px-6 py-8',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)',
            dragActive
              ? 'border-(--dropzone-border-active) bg-(--dropzone-bg-hover)'
              : 'border-(--dropzone-border) bg-(--dropzone-bg) hover:border-(--border-dark) hover:bg-(--dropzone-bg-hover)',
            disabled && 'cursor-not-allowed opacity-50',
            message && !dragActive && 'border-(--danger) bg-(--dropzone-error-bg)',
          )}
        >
          <UploadCloud
            aria-hidden="true"
            className={cn('shrink-0', compact ? 'size-6' : 'size-8', dragActive ? 'text-(--sand)' : 'text-(--taupe)')}
          />
          <p className="text-sm font-medium text-(--text-on-dark)">
            {dragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo'}
          </p>
          <p className="text-xs text-(--text-muted)">
            o <span className="font-semibold text-(--cream) underline decoration-(--taupe) underline-offset-2">seléccionalo desde tu equipo</span>
          </p>
          <p className="text-xs text-(--text-muted)">Admite {rule.description} · máximo 15 MB</p>
        </div>
      )}

      {!value && message ? (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-(--cream)" role="alert">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-(--sand)" />
          <span>{message}</span>
        </p>
      ) : null}

      {hint && !message ? (
        <p id={hintId} className="text-sm text-(--text-muted)">
          {hint}
        </p>
      ) : null}

      <span id={statusId} className="sr-only" aria-live="polite">
        {value ? `Archivo seleccionado: ${value.name}` : 'Ningún archivo seleccionado'}
      </span>
    </div>
  );
}

function renderCategoryIcon(fileName: string, mimeType: string) {
  const category = fileCategory(fileName, mimeType);
  const Icon = CATEGORY_ICONS[category];
  return <Icon aria-hidden="true" className="size-6 text-(--taupe)" />;
}

function describeCategory(fileName: string, mimeType: string): string {
  switch (fileCategory(fileName, mimeType)) {
    case 'image':
      return 'Imagen';
    case 'audio':
      return 'Audio';
    case 'pdf':
      return 'Documento PDF';
    case 'spreadsheet':
      return 'Hoja de cálculo';
    default:
      return 'Archivo';
  }
}
